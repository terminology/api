
import * as Koa from 'koa'
import * as Router from 'koa-router'
import { ConnectionController } from '../controllers/Connection'

let controller = new ConnectionController()

export let ConnectionRouter = new Router({
  prefix: '/connections'
})

ConnectionRouter.post('/', controller.create.bind(controller))

ConnectionRouter.get('/', controller.find.bind(controller))

ConnectionRouter.get('/:contentId', controller.get.bind(controller))
//
// ConnectionRouter.del('/:contentId', controller.delete.bind(controller))
//
ConnectionRouter.put('/:contentId', controller.update.bind(controller))
