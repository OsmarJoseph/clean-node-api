export const surveyPath = {
  get: {
    security: [{
      apiKeyAuthSchema: []
    }],
    tags: ['Enquete'],
    summary: 'API listar todas as enquetes',
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveysListSchema'
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
  post: {
    tags: ['Enquete'],
    summary: 'API para criar uma enquete',
    security: [{
      apiKeyAuthSchema: []
    }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurveyParamsSchema'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Sucesso'
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
