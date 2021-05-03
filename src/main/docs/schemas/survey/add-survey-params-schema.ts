export const addSurveyParamsSchema = {
  type: 'object',
  properties: {
    question: {
      type: 'string',
    },
    possibleAnswers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswerSchema',
      },
    },
  },
}
