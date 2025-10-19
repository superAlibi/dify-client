import { EventSourceBase, NodeTracing } from "../base"


export interface ParallelBranchStartedResponse extends EventSourceBase {
  event: 'parallel_branch_started'
  task_id: string
  workflow_run_id: string
  data: NodeTracing
}
export interface ParallelBranchFinishedResponse extends EventSourceBase {
  event: 'parallel_branch_finished'
  task_id: string
  workflow_run_id: string
  data: NodeTracing
}
