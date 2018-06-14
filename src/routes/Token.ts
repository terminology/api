
import * as Koa from 'koa'
import * as Router from 'koa-router'
import { TokenController } from '../controllers/Token'

let controller = new TokenController()

export let TokenRouter = new Router({
  prefix: '/tokens'
})

TokenRouter.post('/verify', controller.verify.bind(controller))

TokenRouter.post('/', controller.create.bind(controller))
