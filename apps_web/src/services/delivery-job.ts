import type { DeliveryJobData } from '../models'
import { appvars } from '../config'
import { QueryService } from './base/queryService'

const DeliveryJobService = new QueryService<DeliveryJobData>('delivery-job', appvars.ENDPOINT.DELIVERY_JOB, {})

export default DeliveryJobService
