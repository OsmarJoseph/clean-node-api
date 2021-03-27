import { makeAuthMiddleware } from '@/main/factories'
import { SchemaDirectiveVisitor, ForbiddenError } from 'apollo-server-express'
import { GraphQLField, defaultFieldResolver } from 'graphql'

export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field: GraphQLField<any,any>): any {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (parent,args,context,info) => {
      const headers = context?.req?.headers

      const request = {
        accessToken: headers?.['x-access-token']
      }

      const { statusCode,body } = await makeAuthMiddleware().handle(request)

      if (statusCode === 200) {
        Object.assign(context?.req, body)
        return resolve.call(this,parent,args,context,info)
      } else {
        throw new ForbiddenError(body.message)
      }
    }
  }
}
