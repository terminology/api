
import * as Koa from 'koa'
import { ConnectionRouter } from './Connection'
import { InquiryRouter } from './Inquiry'
import { TermRouter } from './Term'
import { UsageRouter } from './Usage'
import { UserRouter } from './User'

export function routes(api: Koa): Koa {
  api.use(ConnectionRouter.routes())
  api.use(InquiryRouter.routes())
  api.use(TermRouter.routes())
  api.use(UsageRouter.routes())
  api.use(UserRouter.routes())
  return api
}
