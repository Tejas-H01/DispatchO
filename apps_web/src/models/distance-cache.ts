export interface DistanceCacheData {
  Id: string
  warehouseCode: string
  numOfLocations: number
  status: string
  reason: string
  buildTime: string
}

export const EMPTY_DISTANCE_CACHE_DATA: DistanceCacheData = {
  Id: '',
  warehouseCode: '',
  numOfLocations: 0,
  status: '',
  reason: '',
  buildTime: '',
}
