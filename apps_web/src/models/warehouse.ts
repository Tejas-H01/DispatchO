export interface WarehouseData {
  Id: string
  warehouseCode: string
  warehouseName: string
  address: string
  latitude: number
  longitude: number
  createdAt: number
  updatedAt: number
}

export const EMPTY_WAREHOUSE: WarehouseData = {
  Id: '',
  warehouseCode: '',
  warehouseName: '',
  address: '',
  latitude: 0,
  longitude: 0,
  createdAt: Date.now(),
  updatedAt: Date.now(),
}
