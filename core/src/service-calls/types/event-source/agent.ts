import { ServerFileInfo } from ".."
import { AgentLogItemWithChildren, EventSourceBase } from "./base"



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



export interface AgentLogResponse extends EventSourceBase {
  event: 'agent_log',
  task_id: string
  data: AgentLogItemWithChildren
}

