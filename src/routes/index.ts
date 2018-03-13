
import * as Koa from 'koa'
import { UserRouter } from './User'

export function routes(api: Koa): Koa {
  api.use(UserRouter.routes())
  return api
}
