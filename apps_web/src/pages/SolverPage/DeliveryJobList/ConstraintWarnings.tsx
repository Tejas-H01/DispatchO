import { type FC } from 'react'
import { Alert, Box, SpaceBetween } from '@cloudscape-design/components'
import type { SolverJobData } from '../../../models'

export interface ConstraintWarningsProps {
  solverJob?: SolverJobData | any | null
  loading?: boolean
}

/**
 * Parses an OptaPlanner HardMediumSoftLongScore string into its numeric components.
 *
 * Example input: "0hard/-12medium/-4500soft"
 * Returns: { hard: 0, medium: -12, soft: -4500 }
 *
 * Returns null if the score string is absent or unparseable.
 */
function parseScore(scoreStr: string | undefined | null): { hard: number; medium: number; soft: number } | null {
  if (!scoreStr || typeof scoreStr !== 'string') return null
  const hardMatch = scoreStr.match(/([-\d]+)hard/)
  const mediumMatch = scoreStr.match(/([-\d]+)medium/)
  const softMatch = scoreStr.match(/([-\d]+)soft/)
  if (!hardMatch || !mediumMatch || !softMatch) return null
  return {
    hard: parseInt(hardMatch[1], 10),
    medium: parseInt(mediumMatch[1], 10),
    soft: parseInt(softMatch[1], 10),
  }
}

/**
 * Fleet-level constraint violation alert banner.
 *
 * This component inspects the OptaPlanner solver score from the existing API
 * response and surfaces real, solver-confirmed constraint violations.
 *
 * It does NOT invent warnings - every alert shown is backed by the optimizer's
 * own hard/medium constraint scoring.
 *
 * Hard violations = constraints that must be satisfied (e.g. over-capacity, route > 50 km,
 * company vehicle preference, same-customer split).
 * Medium violations = soft-ish constraints the optimizer tries to minimize
 * (e.g. under-utilized vehicles, stop-count excess, multi-vehicle customer assignments).
 */
export const ConstraintWarnings: FC<ConstraintWarningsProps> = ({ solverJob, loading = false }) => {
  if (loading || !solverJob?.score) return null

  const parsed = parseScore(solverJob.score)
  if (!parsed) return null

  const hasHardViolations = parsed.hard < 0
  const hasMediumViolations = parsed.medium < 0

  if (!hasHardViolations && !hasMediumViolations) {
    return (
      <Alert type='success' header='All constraints satisfied'>
        The optimizer found a solution with no hard or medium constraint violations. Score:{' '}
        <Box variant='code' display='inline'>
          {solverJob.score}
        </Box>
      </Alert>
    )
  }

  return (
    <SpaceBetween size='s'>
      {hasHardViolations && (
        <Alert
          type='error'
          header='Hard constraint violations detected'
        >
          The optimizer could not fully satisfy one or more hard constraints. This may indicate over-capacity
          vehicles, routes exceeding the 50 km distance limit, disallowed customer delivery splits, or vehicle
          time-group mismatches. Review the per-vehicle Warnings column below for details. Solver score:{' '}
          <Box variant='code' display='inline'>
            {solverJob.score}
          </Box>
        </Alert>
      )}
      {!hasHardViolations && hasMediumViolations && (
        <Alert
          type='warning'
          header='Medium constraint violations detected'
        >
          The solution satisfies all hard constraints but has medium-priority violations. This may include
          under-utilized vehicles (load below 70% capacity), vehicles with more than 5 stops, or the same
          customer being served by multiple vehicles. Solver score:{' '}
          <Box variant='code' display='inline'>
            {solverJob.score}
          </Box>
        </Alert>
      )}
    </SpaceBetween>
  )
}

export default ConstraintWarnings
