import type { WarehouseData } from '../models'
import { CrudService } from './base/crudService'
import { appvars } from '../config'

const WarehouseService = new CrudService<WarehouseData>('warehouse', appvars.ENDPOINT.WAREHOUSE, {})

export default WarehouseService
