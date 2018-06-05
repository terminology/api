
import 'reflect-metadata'
import * as Koa from 'koa'
import * as Router from 'koa-router'
import bodyParser from 'koa-bodyparser-ts'
import * as cors from '@koa/cors';
import responseTime = require('koa-response-time') // Lame
import * as error from 'koa-json-error'
import * as requestId from 'koa-requestid' // No type def.
import { createConnection } from 'typeorm'
import { routes } from './routes'
import { AuthenticationMiddleware } from './middleware/Authentication'

// Create the database connection.
createConnection().then(async connection => {
  const api = new Koa()

  // Configure middleware.
  api.use(error())
  api.use(cors({
    credentials: true
  }))
  api.use(requestId({
    header: false,
    query: false
  }))
  api.use(responseTime())
  api.use(bodyParser())
  api.use(AuthenticationMiddleware)

  // Add application routes.
  routes(api)

  // Listen for connections.
  console.log('Server listening on 4000')
  api.listen(4000)
})
.catch(error => console.log(error))
