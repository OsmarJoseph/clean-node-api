export const unauthorizedRequestComponent = {
  description: 'Credencias inválidas',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/errorSchema',
      },
    },
  },
}
