import { Connection } from '../entities/Connection'
import { ContentController } from './Content'
import * as Ops from '../operations/Connection'

export class ConnectionController extends ContentController<
  Connection,

  // Create.
  Ops.CreateConnectionOptions,
  Ops.CreateConnectionsOptions,
  Ops.CreateConnection,
  never, // Ops.CreateConnections,

  // Find
  Ops.FindConnectionOptions,
  Ops.FindConnectionsOptions,
  Ops.FindConnection,
  Ops.FindConnections,

  // Find/Create
  never, // Ops.FindCreateConnectionOptions,
  never, // Ops.FindCreateConnectionsOptions,
  never, // Ops.FindCreateConnection,
  never, // Ops.FindCreateConnections,

  // Get
  Ops.GetConnectionOptions,
  Ops.GetConnectionsOptions,
  Ops.GetConnection,
  Ops.GetConnections,

  // Update
  Ops.UpdateConnectionOptions,
  never,
  Ops.UpdateConnection,
  never
> {
  constructor() {
    super()
    this.type = Connection

    // Create
    this.createOneOptions = Ops.CreateConnectionOptions
    this.createManyOptions = Ops.CreateConnectionsOptions
    this.createOne = Ops.CreateConnection
    // this.createMany = Ops.CreateConnections

    // Find
    this.findOneOptions = Ops.FindConnectionOptions
    this.findManyOptions = Ops.FindConnectionsOptions
    this.findOne = Ops.FindConnection
    this.findMany = Ops.FindConnections

    // Find/Create
    // this.findCreateOneOptions = Ops.FindCreateConnectionOptions
    // this.findCreateManyOptions = Ops.FindCreateConnectionsOptions
    // this.findCreateOne = Ops.FindCreateConnection
    // this.findCreateMany = Ops.FindCreateConnections

    // Get
    this.getOneOptions = Ops.GetConnectionOptions
    this.getManyOptions = Ops.GetConnectionsOptions
    this.getOne = Ops.GetConnection
    this.getMany = Ops.GetConnections

    // Update
    this.updateOneOptions = Ops.UpdateConnectionOptions
    this.updateOne = Ops.UpdateConnection
  }
}
