import { ServerFileInfo, TransferMethod } from "../types";
/**
 * 
 * @file 
 * 本文件实际上是./types.ts的补充,主要用于EventSource消息的类型定义
 * 因为太长,所以单独分出来
 * @fileoverview
 * 
 * @see {@link ./types.ts}
 */








/**
 * eventSouce 所返回的data所表示的event所有可能的类型
 */
type DataEventType = 'message'
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


interface EventSourceBase {
  event: DataEventType
}

/**
 * EventSource消息
 */
export interface Message extends EventSourceBase {
  /**
   * ```markdown
   * markdown内容, 但是是\u[0-9a-f]{4}这种形式,需要解码,解码方式就是取用\u后面的4位16进制数,然后转换为字符
   * 
   * 根据 dify web 端的源码, 解码方式为:
   * 
   * ```
   * 
   * ```typescript
   * const text = answer.replace(/\\u([0-9a-f]{4})/g, (_match, p1) => {
   *   // 将十六进制字符转换为 Unicode 字符
   *   return String.fromCharCode(Number.parseInt(p1, 16))
   * })
   * ```
   */
  answer: string
  /**
   * 会话id，本次会话的id
   */
  conversation_id: string;
  /**
   * 消息创建时间戳
   */
  // created_at: string;
  /**
   * 事件类型，固定为 message
   */
  event: "message" | 'agent_message';
  /**
   * 消息唯一 ID。，本条消息的id
   * 实际为 message_id
   */
  id: string;
  // metadata: Metadata;
  /**
   * 固定为chat
   */
  // mode: string;
  /**
   * 任务 ID。，响应任务id,改id可以被/chat-messages/{task_id}/stop接口使用
   */
  task_id: string;
}

export type TypeWithI18N<T = string> = {
  en_US: T
  zh_Hans: T
  [key: string]: T
}

export interface AgentThought extends EventSourceBase {
  event: 'agent_thought',
  id: string
  tool: string // plugin or dataset. May has multi.
  thought: string
  tool_input: string
  tool_labels?: { [key: string]: TypeWithI18N }
  message_id: string
  conversation_id: string
  observation: string
  position: number
  files?: string[]
  message_files?: ServerFileInfo[]
}

export interface VisionFile extends EventSourceBase {
  event: 'message_file',
  id?: string
  type: string
  transfer_method: TransferMethod
  url: string
  upload_file_id: string
  belongs_to?: string
}

export type FileResponse = {
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
export interface MessageEnd extends EventSourceBase {
  event: 'message_end',
  id: string
  metadata: Metadata
  files?: FileResponse[]
}
export type MessageReplace = {
  event: 'message_replace',
  id: string
  task_id: string
  answer: string
  conversation_id: string
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

export interface Metadata {
  /**
   * 引用和归属分段列表。
   */
  retriever_resources: string;
  usage: { [key: string]: any };
  [property: string]: any;
}


