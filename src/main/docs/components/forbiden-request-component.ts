export const forbidenRequestComponent = {
  description: 'Acesso Negado',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/errorSchema'
      }
    }
  }
}
