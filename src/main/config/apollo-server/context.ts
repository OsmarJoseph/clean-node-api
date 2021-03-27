import { ExpressContext } from 'apollo-server-express'
import { Context, ContextFunction } from 'apollo-server-core'

export const context: ContextFunction<ExpressContext, Context> | Context = ({ req }) => ({ req })
