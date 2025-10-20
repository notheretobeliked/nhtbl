<script lang="ts">
  import { getContext, onMount } from 'svelte'
  import type { ExtendedEditorBlock } from '$lib/types/wp-types'

  interface Props {
    block: ExtendedEditorBlock
  }

  let { block }: Props = $props()

  // Default Likert scale options
  const defaultLikertOptions = [
    { optionValue: 'strongly-disagree', optionLabel: 'Strongly Disagree' },
    { optionValue: 'disagree', optionLabel: 'Disagree' },
    { optionValue: 'neutral', optionLabel: 'Neutral' },
    { optionValue: 'agree', optionLabel: 'Agree' },
    { optionValue: 'strongly-agree', optionLabel: 'Strongly Agree' }
  ]

  // Extract questions from the survey block and populate default Likert options if needed
  const questions = (block.surveyBlock?.questions || []).map(question => {
    // If this is a Likert scale with UseDefaultLikertOptions, ensure options are populated
    if (question.questionType[0] === 'likert_scale' && question.UseDefaultLikertOptions === 1) {
      return {
        ...question,
        options: defaultLikertOptions
      }
    }
    return question
  })

  // Initialize form data with reactive state
  let formData = $state<Record<string, any>>({})

  // Initialize form data for all questions
  questions.forEach(question => {
    if (question.questionType[0] === 'checkbox') {
      formData[question.questionKey] = []
    } else {
      formData[question.questionKey] = ''
    }
    
    // Initialize "other" text fields if allowOther is true
    if (question.allowOther) {
      formData[`${question.questionKey}_other`] = ''
    }
  })

  // Export formData so parent components can access it
  export { formData }

  // Handle checkbox changes
  function handleCheckboxChange(questionKey: string, optionValue: string, checked: boolean) {
    if (checked) {
      formData[questionKey] = [...(formData[questionKey] || []), optionValue]
    } else {
      formData[questionKey] = (formData[questionKey] || []).filter((val: string) => val !== optionValue)
    }
  }

  // Handle "other" option selection
  function handleOtherOptionChange(questionKey: string, questionType: string) {
    if (questionType === 'multiple_choice') {
      formData[questionKey] = 'other'
    } else if (questionType === 'checkbox') {
      const currentValues = formData[questionKey] || []
      if (!currentValues.includes('other')) {
        formData[questionKey] = [...currentValues, 'other']
      }
    }
  }

  // Validation helper
  function isQuestionValid(question: any): boolean {
    if (!question.required) return true
    
    const answer = formData[question.questionKey]
    
    if (question.questionType[0] === 'checkbox') {
      return Array.isArray(answer) && answer.length > 0
    }
    
    return answer !== '' && answer !== null && answer !== undefined
  }

  // Get validation status for all questions
  const validationStatus = $derived(() => {
    const status: Record<string, boolean> = {}
    questions.forEach(question => {
      status[question.questionKey] = isQuestionValid(question)
    })
    return status
  })

  // Check if all required questions are answered
  const isAllValid = $derived(() => {
    return questions.every(question => isQuestionValid(question))
  })

  // Get survey container registration function from context
  const registerSurveyBlock = getContext<((blockId: string, formData: Record<string, any>, validationStatus: Record<string, boolean>, isAllValid: boolean) => void) | null>('registerSurveyBlock')
  
  // Get question numbers getter from context
  const getQuestionNumbers = getContext<(() => Record<string, number>) | null>('getQuestionNumbers')
  
  // Register this block with the container and update when data changes
  $effect(() => {
    if (registerSurveyBlock && block.clientId) {
      registerSurveyBlock(block.clientId, formData, validationStatus(), isAllValid())
    }
  })

  // Get question number for a specific question key
  function getQuestionNumber(questionKey: string): number | null {
    if (getQuestionNumbers) {
      const numbers = getQuestionNumbers()
      return numbers[questionKey] || null
    }
    return null
  }

  // Expose validation status to parent (for backwards compatibility)
  export { validationStatus, isAllValid }
</script>

<div class="survey-block">
  {#each questions as question}
    <div class="question-container mb-8">
      <!-- Question Text -->
      <div class="question-header">
        <label for={question.questionKey} class="block text-lg font-sans text-black mb-3">
          {#if getQuestionNumber(question.questionKey)}
            <span class="font-medium text-black mr-2">{getQuestionNumber(question.questionKey)}.</span>
          {/if}
          {question.questionText}
          {#if question.required}
            <span class="text-nhtbl-base ml-1">*</span>
          {/if}
        </label>
      </div>

      <!-- Question Input based on type -->
      <div class="question-input">
        {#if question.questionType[0] === 'text'}
          <input
            type="text"
            id={question.questionKey}
            bind:value={formData[question.questionKey]}
            class="w-full px-3 py-2 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-nhtbl-green-base focus:border-transparent"
            class:border-nhtbl-purple-base={question.required && !validationStatus()[question.questionKey]}
            placeholder="Enter your answer..."
          />

        {:else if question.questionType[0] === 'textarea'}
          <textarea
            id={question.questionKey}
            bind:value={formData[question.questionKey]}
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nhtbl-green-base focus:border-transparent resize-vertical"
            class:border-red-500={question.required && !validationStatus()[question.questionKey]}
            placeholder="Enter your detailed answer..."
          ></textarea>

        {:else if question.questionType[0] === 'number'}
          <input
            type="number"
            id={question.questionKey}
            bind:value={formData[question.questionKey]}
            class="w-full px-3 py-2 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-nhtbl-green-base focus:border-transparent"
            class:border-nhtbl-purple-base={question.required && !validationStatus()[question.questionKey]}
            placeholder="Enter a number..."
          />

        {:else if question.questionType[0] === 'multiple_choice'}
          <div class="space-y-2">
            {#each question.options as option}
              <label class="font-sans flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.questionKey}
                  value={option.optionValue}
                  bind:group={formData[question.questionKey]}
                  class="text-nhtbl-green-base focus:ring-nhtbl-green-base"
                />
                <span class="text-black/80">{option.optionLabel}</span>
              </label>
            {/each}

            {#if question.allowOther}
              <div class="space-y-2">
                <label class="font-sans flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={question.questionKey}
                    value="other"
                    bind:group={formData[question.questionKey]}
                    on:change={() => handleOtherOptionChange(question.questionKey, 'multiple_choice')}
                    class="text-nhtbl-green-base focus:ring-nhtbl-green-base"
                  />
                  <span class="text-black/80">Other:</span>
                </label>
                {#if formData[question.questionKey] === 'other'}
                  <input
                    type="text"
                    bind:value={formData[`${question.questionKey}_other`]}
                    class="ml-6 w-full px-3 py-2 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-nhtbl-green-base focus:border-transparent"
                    placeholder="Please specify..."
                  />
                {/if}
              </div>
            {/if}
          </div>

        {:else if question.questionType[0] === 'checkbox'}
          <div class="space-y-2">
            {#each question.options as option}
              <label class="font-sans flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.optionValue}
                  checked={formData[question.questionKey]?.includes(option.optionValue)}
                  on:change={(e) => handleCheckboxChange(question.questionKey, option.optionValue, e.currentTarget.checked)}
                  class="text-nhtbl-green-base focus:ring-nhtbl-green-base rounded"
                />
                <span class="text-black/80">{option.optionLabel}</span>
              </label>
            {/each}

            {#if question.allowOther}
              <div class="space-y-2">
                <label class="font-sans flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value="other"
                    checked={formData[question.questionKey]?.includes('other')}
                    on:change={(e) => {
                      handleCheckboxChange(question.questionKey, 'other', e.currentTarget.checked)
                      if (e.currentTarget.checked) {
                        handleOtherOptionChange(question.questionKey, 'checkbox')
                      }
                    }}
                    class="text-nhtbl-green-base focus:ring-nhtbl-green-base rounded"
                  />
                  <span class="text-black/80">Other:</span>
                </label>
                {#if formData[question.questionKey]?.includes('other')}
                  <input
                    type="text"
                    bind:value={formData[`${question.questionKey}_other`]}
                    class="ml-6 w-full px-3 py-2 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-nhtbl-green-base focus:border-transparent"
                    placeholder="Please specify..."
                  />
                {/if}
              </div>
            {/if}
          </div>

        {:else if question.questionType[0] === 'likert_scale'}
          <div class="space-y-3">
            <div class="grid grid-cols-5 gap-2 text-center">
              {#each question.options as option, index}
                <label class="font-sans flex flex-col items-center space-y-1 cursor-pointer">
                  <input
                    type="radio"
                    name={question.questionKey}
                    value={option.optionValue}
                    bind:group={formData[question.questionKey]}
                    class="text-nhtbl-green-base focus:ring-nhtbl-green-base"
                  />
                  <span class="text-xs text-black/60 text-center leading-tight">
                    {option.optionLabel}
                  </span>
                </label>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Validation Error Message -->
        {#if question.required && !validationStatus()[question.questionKey]}
          <p class="text-sm text-nhtbl-purple-base mt-1">* This question requires an answer</p>
        {/if}
      </div>
    </div>
  {/each}

</div>

<style>
  /* Custom styling for form elements */
  .survey-block input[type="radio"]:checked {
    background-color: theme('colors.nhtbl-green.base');
    border-color: theme('colors.nhtbl-green.base');
  }

  .survey-block input[type="checkbox"]:checked {
    background-color: theme('colors.nhtbl-green.base');
    border-color: theme('colors.nhtbl-green.base');
  }
</style>