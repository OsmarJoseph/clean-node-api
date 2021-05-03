export const signUpPath = {
  post: {
    tags: ['Login'],
    summary: 'API fazer criar conta de usuario',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signUpParamsSchema',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/accessSchema',
            },
          },
        },
      },
      400: {
        $ref: '#/components/badRequestComponent',
      },
      403: {
        $ref: '#/components/forbidenRequestComponent',
      },
      404: {
        $ref: '#/components/notFoundComponent',
      },
      500: {
        $ref: '#/components/serverErrorComponent',
      },
    },
  },
}
