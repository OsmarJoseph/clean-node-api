import { adaptMiddleware } from '@/main/adapters'
import { makeAuthMiddleware } from '@/main/factories'

export const normalAuth = adaptMiddleware(makeAuthMiddleware())
