import { EventSourceBase } from "./base"


export interface DataSourceNodeProcessingResponse extends EventSourceBase {
  event: 'datasource_processing'
  total: number
  completed: number
}

export type DataSourceNodeCompletedResponse = {
  event: 'datasource_completed'
  data: any
  time_consuming: number
}

export type DataSourceNodeErrorResponse = {
  event: 'datasource_error'
  error: string
}
