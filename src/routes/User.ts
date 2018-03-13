
import * as Koa from 'koa'
import * as Router from 'koa-router'
import { UserController } from '../controllers/User'

let controller = new UserController()

export let UserRouter = new Router({
  prefix: '/users'
})

UserRouter.post('/', controller.createUser.bind(controller))


UserRouter.get('/', async (ctx: Koa.Context) => {
  ctx.body = 'Hello User!'
})
