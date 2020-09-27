export const surveySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    question: {
      type: 'string'
    },
    possibleAnswers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswerSchema'
      }
    },
    date: {
      type: 'string'
    }
  }
}
