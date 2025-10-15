import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { urqlMutation } from '$lib/graphql/client'

// GraphQL mutation for submitting survey response
const SUBMIT_SURVEY_RESPONSE_MUTATION = `
  mutation SubmitSurveyResponse($surveyId: ID!, $responses: [SurveyResponseInput]) {
    submitSurveyResponse(input: {
      surveyId: $surveyId
      responses: $responses
    }) {
      success
      responseId
    }
  }
`

interface SurveyResponse {
  questionKey: string
  questionText: string
  answerKey?: string
  answerText: string
  otherText?: string
}

interface SubmitSurveyRequest {
  surveyId: string
  responses: SurveyResponse[]
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Parse the request body
    const body: SubmitSurveyRequest = await request.json()
    
    // Validate required fields
    if (!body.surveyId) {
      return json(
        { 
          success: false, 
          message: 'Survey ID is required' 
        },
        { status: 400 }
      )
    }
    
    if (!body.responses || !Array.isArray(body.responses)) {
      return json(
        { 
          success: false, 
          message: 'Survey responses are required and must be an array' 
        },
        { status: 400 }
      )
    }
    
    // Validate each response has required fields
    for (const response of body.responses) {
      if (!response.questionKey || !response.questionText || !response.answerText) {
        return json(
          { 
            success: false, 
            message: 'Each response must have questionKey, questionText, and answerText' 
          },
          { status: 400 }
        )
      }
    }
    
    // Prepare variables for GraphQL mutation
    const variables = {
      surveyId: body.surveyId,
      responses: body.responses.map(response => ({
        questionKey: response.questionKey,
        questionText: response.questionText,
        answerKey: response.answerKey || null,
        answerText: response.answerText,
        otherText: response.otherText || null
      }))
    }
    
    
    
    // Submit to GraphQL API
    const result = await urqlMutation(SUBMIT_SURVEY_RESPONSE_MUTATION, variables)
    
    // Check if the mutation was successful
    if (result.submitSurveyResponse?.success) {
      return json({
        success: true,
        responseId: result.submitSurveyResponse.responseId,
        message: 'Survey submitted successfully'
      })
    } else {
      return json(
        { 
          success: false, 
          message: 'Failed to submit survey to GraphQL API' 
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Survey submission error:', error)
    
    // Handle GraphQL errors (urql throws errors differently)
    if (error && error.message) {
      return json(
        { 
          success: false, 
          message: 'GraphQL error: ' + error.message
        },
        { status: 500 }
      )
    }
    
    // Handle network or other errors
    return json(
      { 
        success: false, 
        message: 'Internal server error occurred while submitting survey'
      },
      { status: 500 }
    )
  }
}