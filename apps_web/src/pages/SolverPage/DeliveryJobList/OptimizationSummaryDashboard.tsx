import { type FC } from 'react'
import { Container, Header, KeyValuePairs } from '@cloudscape-design/components'
import type { DeliveryJobData, SolverJobData } from '../../../models'

export interface OptimizationSummaryDashboardProps {
  deliveryJobs: DeliveryJobData[] | any[]
  solverJob?: SolverJobData | any | null
  loading?: boolean
}

/**
 * Formats duration in seconds to a human-readable "X hrs Y mins" or "Y mins" string.
 */
const formatTravelTime = (totalSeconds: number): string => {
  if (!totalSeconds || isNaN(totalSeconds) || totalSeconds <= 0) {
    return '0 min'
  }
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.round((totalSeconds % 3600) / 60)

  if (hours === 0) {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`
  }
  if (minutes === 0) {
    return `${hours} hr${hours !== 1 ? 's' : ''}`
  }
  return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`
}

/**
 * Formats milliseconds duration into seconds or ms.
 */
const formatSolverRuntime = (durationMs: number | undefined | null): string => {
  if (durationMs == null || isNaN(durationMs)) {
    return '-'
  }
  if (durationMs < 1000) {
    return `${durationMs} ms`
  }
  return `${(durationMs / 1000).toFixed(2)} s`
}

export const OptimizationSummaryDashboard: FC<OptimizationSummaryDashboardProps> = ({
  deliveryJobs,
  solverJob,
  loading = false,
}) => {
  // 1. Total Orders (derive unique orders from segments, excluding warehouse return legs)
  const uniqueOrderIds = new Set<string>()
  let segmentStopCount = 0

  let totalDistanceMeters = 0
  let totalTimeSeconds = 0
  let totalLoadCapacity = 0
  let totalMaxCapacity = 0

  if (Array.isArray(deliveryJobs)) {
    for (const job of deliveryJobs) {
      if (!job) continue

      // Accumulate capacities safely
      totalLoadCapacity += Number(job.loadCapacity) || 0
      totalMaxCapacity += Number(job.maxCapacity) || 0

      // Accumulate route distance and time
      if (job.route?.distance?.value != null) {
        totalDistanceMeters += Number(job.route.distance.value) || 0
      } else if (Array.isArray(job.segments)) {
        for (const seg of job.segments) {
          if (seg?.route?.distance?.value != null) {
            totalDistanceMeters += Number(seg.route.distance.value) || 0
          }
        }
      }

      if (job.route?.time?.value != null) {
        totalTimeSeconds += Number(job.route.time.value) || 0
      } else if (Array.isArray(job.segments)) {
        for (const seg of job.segments) {
          if (seg?.route?.time?.value != null) {
            totalTimeSeconds += Number(seg.route.time.value) || 0
          }
        }
      }

      // Track order stops
      if (Array.isArray(job.segments)) {
        for (const seg of job.segments) {
          if (!seg) continue
          if (seg.segmentType === 'TO_WAREHOUSE') {
            continue
          }
          if (seg.orderId) {
            uniqueOrderIds.add(String(seg.orderId))
          }
          segmentStopCount++
        }
      }
    }
  }

  // Derive total orders: unique IDs preferred, then solver metadata, then stop count
  let totalOrders = 0
  if (uniqueOrderIds.size > 0) {
    totalOrders = uniqueOrderIds.size
  } else if (solverJob?.orderCount != null && Number(solverJob.orderCount) > 0) {
    totalOrders = Number(solverJob.orderCount)
  } else {
    totalOrders = segmentStopCount
  }

  // 2. Vehicles Used
  const vehiclesUsed = Array.isArray(deliveryJobs) ? deliveryJobs.length : 0

  // 3. Total Distance in km
  const totalDistanceKm = totalDistanceMeters / 1000
  const formattedDistance = loading
    ? '-'
    : `${totalDistanceKm.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`

  // 4. Total Travel Time
  const formattedTravelTime = loading ? '-' : formatTravelTime(totalTimeSeconds)

  // 5. Fleet Capacity Utilization
  const utilizationPct = totalMaxCapacity > 0 ? (totalLoadCapacity / totalMaxCapacity) * 100 : 0
  const formattedUtilization = loading
    ? '-'
    : totalMaxCapacity > 0
      ? `${utilizationPct.toFixed(1)}% (${totalLoadCapacity.toLocaleString()} / ${totalMaxCapacity.toLocaleString()})`
      : '0.0%'

  // 6. Solver Runtime
  const solverDuration = solverJob?.solverDurationInMs != null ? Number(solverJob.solverDurationInMs) : null
  const formattedRuntime = loading ? '-' : formatSolverRuntime(solverDuration)

  // 7. Solver Score
  const formattedScore = loading
    ? '-'
    : solverJob?.score != null && String(solverJob.score).trim() !== ''
      ? String(solverJob.score)
      : '-'

  return (
    <Container
      header={
        <Header
          variant='h2'
          description='Aggregated fleet metrics, route distance, travel duration, and solver efficiency'
        >
          Optimization Summary
        </Header>
      }
    >
      <KeyValuePairs
        columns={4}
        items={[
          {
            label: 'Total Orders',
            value: loading ? '-' : totalOrders.toLocaleString(),
          },
          {
            label: 'Vehicles Used',
            value: loading ? '-' : vehiclesUsed.toLocaleString(),
          },
          {
            label: 'Total Distance',
            value: formattedDistance,
          },
          {
            label: 'Total Travel Time',
            value: formattedTravelTime,
          },
          {
            label: 'Fleet Capacity Utilization',
            value: formattedUtilization,
          },
          {
            label: 'Solver Runtime',
            value: formattedRuntime,
          },
          {
            label: 'Solver Score',
            value: formattedScore,
          },
        ]}
      />
    </Container>
  )
}

export default OptimizationSummaryDashboard
