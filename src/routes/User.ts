
import * as Koa from 'koa'
import * as Router from 'koa-router'
import { UserController } from '../controllers/User'

let controller = new UserController()

export let UserRouter = new Router({
  prefix: '/users'
})

UserRouter.post('/', controller.create.bind(controller))

// UserRouter.get('/', controller.find.bind(controller))

UserRouter.get('/:userId', controller.get.bind(controller))

UserRouter.get('/actions/confirm/email/:token', controller.confirmEmail.bind(controller))

// UserRouter.del('/:userId', controller.deleteUser.bind(controller))

UserRouter.put('/:userId', controller.update.bind(controller))
