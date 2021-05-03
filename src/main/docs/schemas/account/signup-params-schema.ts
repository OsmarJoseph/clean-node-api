export const signUpParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    passwordConfirmation: {
      type: 'string',
    },
  },
  required: ['name', 'email', 'password', 'passwordConfirmation'],
}
