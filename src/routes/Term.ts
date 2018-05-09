
import * as Koa from 'koa'
import * as Router from 'koa-router'
import { TermController } from '../controllers/Term'

let controller = new TermController()

export let TermRouter = new Router({
  prefix: '/terms'
})

TermRouter.post('/', controller.create.bind(controller))

TermRouter.get('/', controller.find.bind(controller))

TermRouter.get('/:contentId', controller.get.bind(controller))
//
// TermRouter.del('/:contentId', controller.delete.bind(controller))
//
TermRouter.put('/:contentId', controller.update.bind(controller))
