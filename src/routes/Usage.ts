
import * as Koa from 'koa'
import * as Router from 'koa-router'
import { UsageController } from '../controllers/Usage'

let controller = new UsageController()

export let UsageRouter = new Router({
  prefix: '/usages'
})

UsageRouter.post('/', controller.create.bind(controller))

UsageRouter.get('/', controller.find.bind(controller))

UsageRouter.get('/:contentId', controller.get.bind(controller))
//
// UsageRouter.del('/:contentId', controller.delete.bind(controller))
//
UsageRouter.put('/:contentId', controller.update.bind(controller))
