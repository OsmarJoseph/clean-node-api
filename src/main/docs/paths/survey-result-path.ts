export const surveyResultPath = {
  put: {
    tags: ['Enquete'],
    summary: 'API para criar a resposta de uma enquete',
    security: [{
      apiKeyAuthSchema: []
    }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyResultParamsSchema'
          }
        }
      }
    },
    parameters: [{
      in: 'path',
      name: 'surveyId',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResultSchema'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidenRequestComponent'
      },
      404: {
        $ref: '#/components/notFoundComponent'
      },
      500: {
        $ref: '#/components/serverErrorComponent'
      }
    }
  },
  get: {
    tags: ['Enquete'],
    summary: 'API para consultar o resultado de uma enquete',
    security: [{
      apiKeyAuthSchema: []
    }],
    parameters: [{
      in: 'path',
      name: 'surveyId',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResultSchema'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidenRequestComponent'
      },
      404: {
        $ref: '#/components/notFoundComponent'
      },
      500: {
        $ref: '#/components/serverErrorComponent'
      }
    }
  }
}
