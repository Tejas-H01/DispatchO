export interface VehicleData {
  Id: string
  carNo: string
  carGrade: string
  maxWeight: number
  warehouseCode: string
}

export const EMPTY_VEHICLE_DATA: VehicleData = {
  Id: '',
  carNo: '',
  carGrade: '',
  maxWeight: 11000,
  warehouseCode: '',
}
