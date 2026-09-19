import type { VehicleData } from '../models'
import { CrudService } from './base/crudService'
import { appvars } from '../config'

const VehicleService = new CrudService<VehicleData>('vehicle', appvars.ENDPOINT.VEHICLE, {})

export default VehicleService
