export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'API para autenticar usuário',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParamsSchema'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/accountSchema'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequestComponent'
      },
      401: {
        $ref: '#/components/unauthorizedRequestComponent'
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
