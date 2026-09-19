import type { OrderData } from '../models'
import { appvars } from '../config'
import { CrudService } from './base/crudService'

const OrderService = new CrudService<OrderData>('order', appvars.ENDPOINT.ORDER, {})

export default OrderService
