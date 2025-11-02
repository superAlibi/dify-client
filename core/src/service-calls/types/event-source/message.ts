import { TransferMethod } from ".."
import { EventSourceBase, FileResponse, Metadata } from "./base"

export interface VisionFile extends EventSourceBase {
  event: 'message_file',
  id?: string
  type: string
  transfer_method: TransferMethod
  url: string
  upload_file_id: string
  belongs_to?: string
}

export interface MessageEnd extends EventSourceBase {
  event: 'message_end',
  id: string
  metadata: Metadata
  files?: FileResponse[]
  conversation_id: string
  message_id: string
  created_at: number
  task_id: string
}
export type MessageReplace = {
  event: 'message_replace',
  id: string
  task_id: string
  answer: string
  conversation_id: string
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
   * ```typescript
   * const text = answer.replace(/\\u([0-9a-f]{4})/g, (_match, p1) => {
   *   // 将十六进制字符转换为 Unicode 字符
   *   return String.fromCharCode(Number.parseInt(p1, 16))
   * })
   * ```
   * ````
   */
  answer: string
  /**
   * 会话id，本次会话的id
   */
  conversation_id: string;

  /**
   * 消息类型
   */
  event: "message" | 'agent_message';
  /**
   * 消息唯一 ID，本条消息的id
   * 实际为 message_id
   */
  id: string;

  /**
   * 任务 ID。，响应任务id,改id可以被/chat-messages/{task_id}/stop接口使用
   */
  task_id: string;

  /**
   * 于 id 的值相同
   */
  message_id: string;
  created_at: number,
  from_variable_selector: string[]
}