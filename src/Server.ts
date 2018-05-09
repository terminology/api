
import 'reflect-metadata'
import * as Koa from 'koa'
import * as Router from 'koa-router'
import bodyParser from 'koa-bodyparser-ts'
import * as responseTime from 'koa-response-time'
import * as requestId from 'koa-requestid'
import { createConnection } from 'typeorm'
import { routes } from './routes'
import { AuthenticationMiddleware } from './middleware/Authentication'

// Create the database connection.
createConnection().then(async connection => {
  const api = new Koa()

  api.use(requestId({
    header: false,
    query: false
  }))
  api.use(responseTime())
  api.use(bodyParser())
  api.use(AuthenticationMiddleware)

  routes(api)

  console.log('Server listening on 4000')
  api.listen(4000)
})
.catch(error => console.log(error))
