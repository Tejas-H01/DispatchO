import { Badge, ProgressBar, SpaceBetween, type ProgressBarProps, type TableProps } from '@cloudscape-design/components'
import type { DeliveryJobData, selectDeliveryJobData } from '../../../models'
import { dayjslocal } from '../../../utils/dayjs'
import { appvars } from '../../../config'

export const columnDefinitions: TableProps.ColumnDefinition<DeliveryJobData>[] = [
  { id: 'carNo', header: 'Car No.', sortingField: 'carNo', width: 120, cell: (i) => i.carNo },
  { id: 'deliveryTimeGroup', header: 'Time Group', sortingField: 'deliveryTimeGroup', width: 120, cell: (i) => i.deliveryTimeGroup },
  {
    id: 'orderCount',
    header: 'Order Count',
    width: 120,
    cell: (i) => (Array.isArray(i.segments) ? i.segments.length : 0),
  },
  { id: 'loadCapacity', header: 'Load Weight', sortingField: 'loadCapacity', width: 150, cell: (i) => i.loadCapacity },
  { id: 'maxCapacity', header: 'Max Capacity', sortingField: 'maxCapacity', width: 150, cell: (i) => i.maxCapacity },
  {
    id: 'utilization',
    header: 'Capacity Utilization',
    width: 200,
    cell: (i) => {
      const max = Number(i.maxCapacity)
      const load = Number(i.loadCapacity)

      if (i.maxCapacity == null || isNaN(max) || max <= 0 || isNaN(load)) {
        return 'N/A'
      }

      const actualPct = (load / max) * 100
      const clampedValue = Math.min(100, Math.max(0, Math.round(actualPct)))
      const formattedText = `${actualPct.toFixed(1)}%`

      let status: ProgressBarProps.Status = 'in-progress'
      if (actualPct > 100) {
        status = 'error'
      } else if (actualPct >= 80) {
        status = 'success'
      }

      return (
        <ProgressBar
          value={clampedValue}
          status={status}
          resultText={formattedText}
          additionalInfo={status === 'in-progress' ? formattedText : undefined}
        />
      )
    },
  },
  {
    id: 'warnings',
    header: 'Warnings',
    width: 220,
    cell: (i) => {
      const MAX_DISTANCE_METERS = 50_000 // 50 km — mirrors DispatchConstraintProvider.MAX_DISTANCE_AT_ONCE
      const MAX_STOPS = 5 // mirrors DispatchConstraintProvider.MAX_NUM_OF_DESTINATIONS_AT_ONCE
      const MIN_LOAD_RATIO = 0.7 // mirrors DispatchConstraintProvider.MIN_LOAD_WEIGHT_RATIO

      const max = Number(i.maxCapacity) || 0
      const load = Number(i.loadCapacity) || 0
      const routeDistM = Number(i.route?.distance?.value) || 0

      // Count non-return-to-warehouse stops
      const stopCount = Array.isArray(i.segments)
        ? i.segments.filter((s: any) => s?.segmentType !== 'TO_WAREHOUSE').length
        : 0

      const badges: JSX.Element[] = []

      if (max > 0 && load > max) {
        badges.push(<Badge key='over-cap' color='red'>Over Capacity</Badge>)
      }
      if (routeDistM > MAX_DISTANCE_METERS) {
        badges.push(<Badge key='dist' color='red'>&gt;50 km</Badge>)
      }
      if (stopCount > MAX_STOPS) {
        badges.push(<Badge key='stops' color='severity-medium'>&gt;{MAX_STOPS} Stops</Badge>)
      }
      if (max > 0 && load > 0 && load < max * MIN_LOAD_RATIO) {
        badges.push(<Badge key='underused' color='blue'>Under-utilized</Badge>)
      }

      if (badges.length === 0) {
        return <Badge color='green'>OK</Badge>
      }

      return (
        <SpaceBetween direction='horizontal' size='xxs'>
          {badges}
        </SpaceBetween>
      )
    },
  },
  {
    id: 'createdAt',
    header: 'Created',
    sortingField: 'createdAt',
    width: 200,
    cell: (i) => dayjslocal(i.createdAt).format(appvars.DATETIMEFORMAT),
  },
]

export const columnDefinitionsSegments: TableProps.ColumnDefinition<selectDeliveryJobData>[] = [
  { id: 'deliveryCode', header: 'Customer ID', width: 150, cell: (i) => i.deliveryCode },
  { id: 'deliveryName', header: 'Customer Name', width: 200, cell: (i) => i.deliveryName },
  { id: 'deliveryTimeGroup', header: 'Time Group', width: 120, cell: (i) => i.deliveryTimeGroup },
  { id: 'demands', header: 'Order Weight', width: 150, cell: (i) => i.demands },
]
