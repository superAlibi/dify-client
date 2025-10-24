import { EventSourceBase, NodeTracing } from "../base"


export interface IterationStartedResponse extends EventSourceBase {
  event: 'iteration_started'
  task_id: string
  workflow_run_id: string
  data: NodeTracing
}
export interface IterationNextResponse extends EventSourceBase {
  event: 'iteration_next'
  task_id: string
  workflow_run_id: string
  data: NodeTracing
}
export interface IterationFinishedResponse extends EventSourceBase {
  event: 'iteration_completed'
  task_id: string
  workflow_run_id: string
  data: NodeTracing
}
