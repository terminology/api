
import * as Koa from 'koa'
import * as Router from 'koa-router'
import { UserController } from '../controllers/User'

let controller = new UserController()

export let UserRouter = new Router({
  prefix: '/users'
})

UserRouter.post('/', controller.createUser.bind(controller))

UserRouter.get('/', controller.findUsers.bind(controller))

UserRouter.get('/:userId', controller.findUser.bind(controller))
