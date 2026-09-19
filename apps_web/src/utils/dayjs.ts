import dayjs, { extend } from 'dayjs'
import utc from 'dayjs/plugin/utc'

extend(utc)

export const dayjslocal = dayjs
export const dayjsutc = dayjs.utc
