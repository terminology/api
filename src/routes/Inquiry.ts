
import * as Koa from 'koa'
import * as Router from 'koa-router'
import { InquiryController } from '../controllers/Inquiry'

let controller = new InquiryController()

export let InquiryRouter = new Router({
  prefix: '/inquiries'
})

InquiryRouter.post('/', controller.create.bind(controller))

// InquiryRouter.get('/', controller.find.bind(controller))
//
// InquiryRouter.get('/:contentId', controller.get.bind(controller))
//
// InquiryRouter.del('/:contentId', controller.delete.bind(controller))
//
// InquiryRouter.put('/:contentId', controller.update.bind(controller))
