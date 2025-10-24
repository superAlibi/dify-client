import { FileResponse } from "../base"

export type WorkflowFinishedResponse = {
  task_id: string
  workflow_run_id: string
  event: 'workflow_finished',
  data: {
    id: string
    workflow_id: string
    status: string
    outputs: any
    error: string
    elapsed_time: number
    total_tokens: number
    total_steps: number
    created_at: number
    created_by: {
      id: string
      name: string
      email: string
    }
    finished_at: number
    files?: FileResponse[]
  }
}




export type WorkflowStartedResponse = {
  event: 'workflow_started',
  task_id: string
  workflow_run_id: string
  data: {
    id: string
    workflow_id: string
    created_at: number
  }
}
