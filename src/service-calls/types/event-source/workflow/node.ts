import { EventSourceBase, NodeTracing } from "../base"


export interface NodeStartedResponse extends EventSourceBase {
  task_id: string
  workflow_run_id: string
  event: 'node_started'
  data: NodeTracing
}

export interface NodeFinishedResponse extends EventSourceBase {
  event: 'node_finished' | 'node_retry'
  task_id: string
  workflow_run_id: string
  data: NodeTracing
}

