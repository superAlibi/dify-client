import { EventSourceBase, NodeTracing } from "../base"


export interface TextChunkResponse extends EventSourceBase {
  event: 'text_chunk'
  task_id: string
  workflow_run_id: string
  data: {
    text: string
  }
}
export interface TextReplaceResponse extends EventSourceBase {
  event: 'text_replace'
  task_id: string
  workflow_run_id: string
  data: NodeTracing
}
