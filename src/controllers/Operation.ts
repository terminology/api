import { Context } from 'koa'
import { Controller } from './Controller'
import { getConnection } from 'typeorm'

export abstract class OperationController extends Controller {
}
