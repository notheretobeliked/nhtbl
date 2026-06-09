import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'

const SUBMIT_SURVEY_RESPONSE_MUTATION = `
  mutation SubmitSurveyResponse($surveyId: ID!, $responses: [SurveyResponseInput]) {
    submitSurveyResponse(input: { surveyId: $surveyId, responses: $responses }) {
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
		const body: SubmitSurveyRequest = await request.json()

		if (!body.surveyId) {
			return json({ success: false, message: 'Survey ID is required' }, { status: 400 })
		}
		if (!body.responses || !Array.isArray(body.responses)) {
			return json(
				{ success: false, message: 'Survey responses are required and must be an array' },
				{ status: 400 }
			)
		}
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

		const variables = {
			surveyId: body.surveyId,
			responses: body.responses.map((response) => ({
				questionKey: response.questionKey,
				questionText: response.questionText,
				answerKey: response.answerKey || null,
				answerText: response.answerText,
				otherText: response.otherText || null
			}))
		}

		const res = await graphqlQuery(SUBMIT_SURVEY_RESPONSE_MUTATION, variables)
		checkResponse(res)
		const { data } = await res.json()

		if (data?.submitSurveyResponse?.success) {
			return json({
				success: true,
				responseId: data.submitSurveyResponse.responseId,
				message: 'Survey submitted successfully'
			})
		}

		return json(
			{ success: false, message: 'Failed to submit survey to GraphQL API' },
			{ status: 500 }
		)
	} catch (error: unknown) {
		console.error('Survey submission error:', error)
		const message = error instanceof Error ? error.message : 'Internal server error'
		return json({ success: false, message: `Survey submission failed: ${message}` }, { status: 500 })
	}
}
