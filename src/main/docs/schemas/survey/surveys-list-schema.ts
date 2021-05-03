export const surveysListSchema = {
  type: 'array',
  items: {
    $ref: '#/schemas/surveySchema',
  },
}
