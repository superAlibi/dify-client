import { TransferMethod } from "..";


/**
 * 当EventSource返回错误时的数据结构
 */
export interface EventSourceError {
  status?: number
  message?: string
  code?: string | number


}

/**
 * 当EventSource返回非json时的数据结构
 * 
 */
export interface EventSourceNotJson {
  conversation_id?: string;
  message_id?: string;
}

/**
 * eventSouce 所返回的data所表示的event所有可能的类型
 */
export type DataEventType = 'message'
  | 'agent_message'
  | 'agent_thought'
  | 'message_file'
  | 'message_end'
  | 'message_replace'
  | 'workflow_started'
  | 'workflow_finished'
  | 'node_started'
  | 'node_finished'
  | 'iteration_started'
  | 'iteration_next'
  | 'iteration_completed'
  | 'loop_started'
  | 'loop_next'
  | 'loop_completed'
  | 'node_retry'
  | 'parallel_branch_started'
  | 'parallel_branch_finished'
  | 'text_chunk'
  | 'text_replace'
  | 'agent_log'
  | 'tts_message'
  | 'tts_message_end'
  | 'datasource_processing'
  | 'datasource_completed'
  | 'datasource_error'


export interface EventSourceBase {
  event: DataEventType
}


export interface FileResponse {
  related_id: string
  extension: string
  filename: string
  size: number
  mime_type: string
  transfer_method: TransferMethod
  type: string
  url: string
  upload_file_id: string
  remote_url: string
}


export interface Metadata {
  /**
   * 引用和归属分段列表。
   */
  retriever_resources: string;
  usage: { [key: string]: any };
  [property: string]: any;
}


export enum BlockEnum {
  Start = 'start',
  End = 'end',
  Answer = 'answer',
  LLM = 'llm',
  KnowledgeRetrieval = 'knowledge-retrieval',
  QuestionClassifier = 'question-classifier',
  IfElse = 'if-else',
  Code = 'code',
  TemplateTransform = 'template-transform',
  HttpRequest = 'http-request',
  VariableAssigner = 'variable-assigner',
  VariableAggregator = 'variable-aggregator',
  Tool = 'tool',
  ParameterExtractor = 'parameter-extractor',
  Iteration = 'iteration',
  DocExtractor = 'document-extractor',
  ListFilter = 'list-operator',
  IterationStart = 'iteration-start',
  Assigner = 'assigner', // is now named as VariableAssigner
  Agent = 'agent',
  Loop = 'loop',
  LoopStart = 'loop-start',
  LoopEnd = 'loop-end',
  DataSource = 'datasource',
  DataSourceEmpty = 'datasource-empty',
  KnowledgeBase = 'knowledge-index',
}
export enum ErrorHandleTypeEnum {
  none = 'none',
  failBranch = 'fail-branch',
  defaultValue = 'default-value',
}

export type AgentLogItem = {
  node_execution_id: string,
  message_id: string,
  node_id: string,
  parent_id?: string,
  label: string,
  data: object, // debug data
  error?: string,
  status: string,
  metadata?: {
    elapsed_time?: number
    provider?: string
    icon?: string
  },
}
export type AgentLogItemWithChildren = AgentLogItem & {
  hasCircle?: boolean
  children: AgentLogItemWithChildren[]
}
export type NodeTracing = {
  id: string
  index: number
  predecessor_node_id: string
  node_id: string
  iteration_id?: string
  loop_id?: string
  node_type: BlockEnum
  title: string
  inputs: any
  inputs_truncated: boolean
  process_data: any
  process_data_truncated: boolean
  outputs?: Record<string, any>
  outputs_truncated: boolean
  outputs_full_content?: {
    download_url: string
  }
  status: string
  parallel_run_id?: string
  error?: string
  elapsed_time: number
  execution_metadata?: {
    total_tokens: number
    total_price: number
    currency: string
    iteration_id?: string
    iteration_index?: number
    loop_id?: string
    loop_index?: number
    parallel_id?: string
    parallel_start_node_id?: string
    parent_parallel_id?: string
    parent_parallel_start_node_id?: string
    parallel_mode_run_id?: string
    iteration_duration_map?: Record<string, number>
    loop_duration_map?: Record<string, number>
    error_strategy?: ErrorHandleTypeEnum
    agent_log?: AgentLogItem[]
    tool_info?: {
      agent_strategy?: string
      icon?: string
    }
    loop_variable_map?: Record<string, any>
  }
  metadata: {
    iterator_length: number
    iterator_index: number
    loop_length: number
    loop_index: number
  }
  created_at: number
  created_by: {
    id: string
    name: string
    email: string
  }
  iterDurationMap?: Record<string, number>
  loopDurationMap?: Record<string, number>
  finished_at: number
  extras?: any
  expand?: boolean // for UI
  details?: NodeTracing[][] // iteration or loop detail
  retryDetail?: NodeTracing[] // retry detail
  retry_index?: number
  parallelDetail?: { // parallel detail. if is in parallel, this field will be set
    isParallelStartNode?: boolean
    parallelTitle?: string
    branchTitle?: string
    children?: NodeTracing[]
  }
  parallel_id?: string
  parallel_start_node_id?: string
  parent_parallel_id?: string
  parent_parallel_start_node_id?: string
  agentLog?: AgentLogItemWithChildren[] // agent log
}



export enum CredentialTypeEnum {
  OAUTH2 = 'oauth2',
  API_KEY = 'api-key',
}
