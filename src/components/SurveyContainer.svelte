<script lang="ts">
  import { browser } from '$app/environment'
  import { setContext } from 'svelte'
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'

  interface Props {
    blocks: ExtendedEditorBlock[]
    pageId: string | number
  }

  let { blocks, pageId }: Props = $props()


  // Find all survey blocks in the provided blocks
  let surveyBlocks = $derived(() => {
    const findSurveyBlocks = (blockList: ExtendedEditorBlock[]): ExtendedEditorBlock[] => {
      let surveys: ExtendedEditorBlock[] = []
      
      for (const block of blockList) {
        if (block.name === 'acf/survey-block') {
          surveys.push(block)
        }
        
        // Recursively check inner blocks
        if (block.innerBlocks && block.innerBlocks.length > 0) {
          surveys = [...surveys, ...findSurveyBlocks(block.innerBlocks.filter((b): b is ExtendedEditorBlock => b !== null))]
        }
      }
      
      return surveys
    }
    
    return findSurveyBlocks(blocks)
  })

  // State for managing form data from all survey blocks
  let allFormData = $state<Record<string, Record<string, any>>>({})
  let allValidationStatus = $state<Record<string, Record<string, boolean>>>({})
  let allValidStatus = $state<Record<string, boolean>>({})

  // Submission state
  let isSubmitting = $state(false)
  let submissionStatus = $state<'idle' | 'success' | 'error'>('idle')
  let submissionMessage = $state('')

  // Update form data from a survey block
  function updateFormData(blockId: string, formData: Record<string, any>, validationStatus: Record<string, boolean>, isAllValid: boolean) {
    allFormData[blockId] = formData
    allValidationStatus[blockId] = validationStatus
    allValidStatus[blockId] = isAllValid
  }

  // Check if all survey blocks are valid
  const canSubmit = $derived(() => {
    if (surveyBlocks().length === 0) return false
    return Object.values(allValidStatus).every(status => status === true)
  })

  // Get all questions from all survey blocks
  const allQuestions = $derived(() => {
    const questions: any[] = []
    
    surveyBlocks().forEach(block => {
      if (block.surveyBlock?.questions) {
        questions.push(...block.surveyBlock.questions)
      }
    })
    
    return questions
  })

  // Get only required questions
  const requiredQuestions = $derived(() => {
    return allQuestions().filter(q => q.required)
  })

  // Create a mapping of questionKey to question number
  const questionNumbers = $derived.by(() => {
    const mapping: Record<string, number> = {}
    let questionNumber = 1
    
    allQuestions().forEach(question => {
      mapping[question.questionKey] = questionNumber
      questionNumber++
    })
    
    return mapping
  })

  // Calculate number of answered questions
  const answeredQuestionsCount = $derived(() => {
    let count = 0
    const combinedFormData: Record<string, any> = {}
    Object.values(allFormData).forEach(blockData => {
      Object.assign(combinedFormData, blockData)
    })

    allQuestions().forEach(question => {
      const answer = combinedFormData[question.questionKey]
      
      // Check if question has a valid answer
      if (question.questionType[0] === 'checkbox') {
        if (Array.isArray(answer) && answer.length > 0) {
          count++
        }
      } else {
        if (answer !== undefined && answer !== null && answer !== '') {
          count++
        }
      }
    })
    
    return count
  })

  // Calculate number of answered required questions
  const answeredRequiredQuestionsCount = $derived(() => {
    let count = 0
    const combinedFormData: Record<string, any> = {}
    Object.values(allFormData).forEach(blockData => {
      Object.assign(combinedFormData, blockData)
    })

    requiredQuestions().forEach(question => {
      const answer = combinedFormData[question.questionKey]
      
      // Check if question has a valid answer
      if (question.questionType[0] === 'checkbox') {
        if (Array.isArray(answer) && answer.length > 0) {
          count++
        }
      } else {
        if (answer !== undefined && answer !== null && answer !== '') {
          count++
        }
      }
    })
    
    return count
  })

  // Calculate progress percentage
  const progressPercentage = $derived(() => {
    const total = allQuestions().length
    if (total === 0) return 0
    return (answeredQuestionsCount() / total) * 100
  })

  // Transform form data for submission
  function transformFormDataForSubmission() {
    const responses: any[] = []
    
    // Combine all form data from all blocks
    const combinedFormData: Record<string, any> = {}
    Object.values(allFormData).forEach(blockData => {
      Object.assign(combinedFormData, blockData)
    })

    // Default Likert scale labels
    const defaultLikertLabels: Record<string, string> = {
      'strongly-disagree': 'Strongly Disagree',
      'disagree': 'Disagree',
      'neither-agree-nor-disagree': 'Neither Agree nor Disagree',
      'agree': 'Agree',
      'strongly-agree': 'Strongly Agree'
    }

    allQuestions().forEach(question => {
      const userAnswer = combinedFormData[question.questionKey]
      
      if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
        const response: any = {
          questionKey: question.questionKey,
          questionText: question.questionText
        }
        
        // Handle different question types
        if (['multiple_choice', 'likert_scale'].includes(question.questionType[0])) {
          response.answerKey = userAnswer
          
          // Check if this is a Likert scale with default options
          if (question.questionType[0] === 'likert_scale' && (question.useDefaultLikertOptions === true || question.useDefaultLikertOptions === 1)) {
            response.answerText = defaultLikertLabels[userAnswer] || userAnswer
          } else {
            // Find the option label for answerText
            const selectedOption = question.options?.find((opt: any) => opt.optionValue === userAnswer)
            response.answerText = selectedOption?.optionLabel || userAnswer
          }
        } else if (question.questionType[0] === 'checkbox') {
          // Handle checkbox arrays
          if (Array.isArray(userAnswer) && userAnswer.length > 0) {
            const selectedLabels = userAnswer.map(value => {
              const option = question.options?.find((opt: any) => opt.optionValue === value)
              return option?.optionLabel || value
            })
            response.answerText = selectedLabels.join(', ')
            response.answerKey = userAnswer.join(', ')
          }
        } else {
          // Text, textarea, number
          response.answerText = String(userAnswer)
        }
        
        // Handle "Other" responses
        const otherText = combinedFormData[`${question.questionKey}_other`]
        if (otherText) {
          response.otherText = otherText
        }
        
        responses.push(response)
      }
    })
    
    return responses
  }

  // Submit the survey
  async function submitSurvey() {
    if (!canSubmit() || isSubmitting) return
    
    isSubmitting = true
    submissionStatus = 'idle'
    submissionMessage = ''
    
    try {
      const responses = transformFormDataForSubmission()
      
      const submitData = {
        surveyId: String(pageId),
        responses
      }
      
      
      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        submissionStatus = 'success'
        submissionMessage = 'Survey submitted successfully! Thank you for your response.'
        
        // Clear form data after successful submission
        allFormData = {}
        allValidationStatus = {}
        allValidStatus = {}
      } else {
        submissionStatus = 'error'
        submissionMessage = result.message || 'Failed to submit survey. Please try again.'
      }
    } catch (error) {
      console.error('Survey submission error:', error)
      submissionStatus = 'error'
      submissionMessage = 'An error occurred while submitting the survey. Please try again.'
    } finally {
      isSubmitting = false
    }
  }

  // Function to register survey block components
  function registerSurveyBlock(blockId: string, formData: Record<string, any>, validationStatus: Record<string, boolean>, isAllValid: boolean) {
    updateFormData(blockId, formData, validationStatus, isAllValid)
  }

  // Provide registration function and question numbers through context
  setContext('registerSurveyBlock', registerSurveyBlock)
  setContext('getQuestionNumbers', () => questionNumbers)
</script>


{#if surveyBlocks().length > 0}
  <div class="survey-container {submissionStatus !== 'success' ? 'pb-32' : ''}">
    {#if submissionStatus === 'success'}
      <!-- Success message - hide questions -->
      <div class="max-w-2xl mx-auto mt-16 text-center">
        <div class="bg-nhtbl-green-base/10 border-2 border-nhtbl-green-base rounded-lg p-12">
          <div class="flex justify-center mb-6">
            <svg class="h-20 w-20 text-nhtbl-green-base" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-black mb-4">Thank You!</h2>
          <p class="text-lg text-black/80 mb-2">{submissionMessage}</p>
          <p class="text-sm text-black/60">Your responses have been recorded.</p>
        </div>
      </div>
    {:else}
      <!-- Page content (including survey blocks) will be rendered here -->
      <slot />
      
      <!-- Error message section -->
      {#if submissionStatus === 'error'}
        <div class="mt-8 p-6 bg-black/5 rounded-lg border border-black/10">
          <div class="p-4 bg-nhtbl-purple-base/20 border border-nhtbl-purple-base/30 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-black">{submissionMessage}</p>
              </div>
            </div>
          </div>
        </div>
      {/if}
    {/if}

    <!-- Fixed progress bar at bottom - hide after successful submission -->
    {#if submissionStatus !== 'success'}
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black/10 shadow-lg z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between gap-4 mb-3">
            <!-- Progress info -->
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-black/80">
                  Progress: {answeredQuestionsCount()} of {allQuestions().length} questions answered – {answeredRequiredQuestionsCount()} of {requiredQuestions().length} required questions answered
                </span>
                <span class="text-sm font-medium text-black/60">
                  {Math.round(progressPercentage())}%
                </span>
              </div>
              
              <!-- Progress bar -->
              <div class="w-full bg-black/10 rounded-full h-3 overflow-hidden">
                <div 
                  class="bg-nhtbl-green-base h-full rounded-full transition-all duration-300 ease-out"
                  style="width: {progressPercentage()}%"
                ></div>
              </div>
              
              <!-- Validation info -->
              {#if !canSubmit()}
                <p class="text-xs text-black/50 mt-1">
                  Please complete all required fields before submitting.
                </p>
              {/if}
            </div>
            
            <!-- Submit button -->
            <button
              type="button"
              onclick={submitSurvey}
              disabled={!canSubmit() || isSubmitting}
              class="px-6 py-3 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-nhtbl-green-base focus:ring-offset-2 transition-colors whitespace-nowrap
                     {canSubmit() && !isSubmitting 
                       ? 'bg-nhtbl-green-base text-black hover:bg-nhtbl-green-base/90 cursor-pointer' 
                       : 'bg-black/30 text-black/70 cursor-not-allowed'}"
            >
              {#if isSubmitting}
                <span class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              {:else}
                Submit Survey
              {/if}
            </button>
          </div>
        </div>
      </div>
    {/if}

  </div>
{:else}
  <!-- No survey blocks found, render content normally -->
  <div class="no-survey-content">
    <slot />
  </div>
{/if}