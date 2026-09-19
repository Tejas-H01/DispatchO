import type { SolverJobData } from '../models'
import { appvars } from '../config'
import { QueryService } from './base/queryService'

const SolverJobService = new QueryService<SolverJobData>('solver-job', appvars.ENDPOINT.SOLVER_JOB, {})

export default SolverJobService
