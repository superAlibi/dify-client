import { EventSourceBase, NodeTracing } from "../base"


export interface LoopStartedResponse extends EventSourceBase {
  event: 'loop_started'
  task_id: string
  workflow_run_id: string
  data: NodeTracing
}
export interface LoopNextResponse extends EventSourceBase {
  event: 'loop_next'
  task_id: string
  workflow_run_id: string
  data: NodeTracing
}
export interface LoopFinishedResponse extends EventSourceBase {
  event: 'loop_completed'
  task_id: string
  workflow_run_id: string
  data: NodeTracing
}