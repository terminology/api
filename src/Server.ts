
import 'reflect-metadata'
import * as Koa from 'koa'
import * as Router from 'koa-router'
import bodyParser from 'koa-bodyparser-ts'
import * as responseTime from 'koa-response-time'
import { createConnection } from 'typeorm'
import { routes } from './routes'

// Create the database connection.
createConnection().then(async connection => {
    const api = new Koa()

    api.use(responseTime())
    api.use(bodyParser())

    routes(api)

    const router = new Router()
    router.get('/*', async (ctx: Koa.Context) => {
      ctx.body = 'Hello World!'
    })
    api.use(router.routes())


    console.log('listening on 4000')
    api.listen(4000)
})
.catch(error => console.log(error))
