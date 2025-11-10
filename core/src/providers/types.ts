import {
  AccessModeResponse,
  AppMetaResponse,
  AppParamsResponse,
  AppSiteInfoResponse,
  ConversationHistoryResponse,
  ConversationMessageResponse,
  DataEventType,
} from "../service-calls"

import type {
  AgentThought,
  AgentLogResponse
} from '../service-calls/types/event-source/agent'

import type {
  DataSourceNodeProcessingResponse,
  DataSourceNodeCompletedResponse,
  DataSourceNodeErrorResponse
} from '../service-calls/types/event-source/datasource'
import type {
  MessageEnd,
  MessageReplace,
  Message,
  VisionFile,
} from '../service-calls/types/event-source/message'
import type {
  TTSMessageResponse,
  TTSMessageEndResponse
} from '../service-calls/types/event-source/tts'
import type {
  IterationStartedResponse,
  IterationNextResponse,
  IterationFinishedResponse,
} from '../service-calls/types/event-source/workflow/iteration'
import type {
  LoopStartedResponse,
  LoopNextResponse,
  LoopFinishedResponse,
} from '../service-calls/types/event-source/workflow/loop'

import type {
  NodeStartedResponse,
  NodeFinishedResponse,
} from '../service-calls/types/event-source/workflow/node'

import type {
  ParallelBranchStartedResponse,
  ParallelBranchFinishedResponse,
} from '../service-calls/types/event-source/workflow/parallel'

import type {
  TextChunkResponse,
  TextReplaceResponse,
} from '../service-calls/types/event-source/workflow/text_chunk'


import type {
  WorkflowStartedResponse,
  WorkflowFinishedResponse
} from '../service-calls/types/event-source/workflow/workflow'

export type EventSourceDataTypes = AgentThought
  | AgentLogResponse
  | DataSourceNodeProcessingResponse
  | DataSourceNodeCompletedResponse
  | DataSourceNodeErrorResponse
  | MessageEnd
  | MessageReplace
  | Message
  | VisionFile
  | TTSMessageResponse
  | TTSMessageEndResponse
  | IterationStartedResponse
  | IterationNextResponse
  | IterationFinishedResponse
  | LoopStartedResponse
  | LoopNextResponse
  | LoopFinishedResponse
  | NodeStartedResponse
  | NodeFinishedResponse
  | ParallelBranchStartedResponse
  | ParallelBranchFinishedResponse
  | TextChunkResponse
  | TextReplaceResponse
  | WorkflowStartedResponse
  | WorkflowFinishedResponse

/**
 * 事件流类型, 用于事件流监听
 */
export type EventSourceMap = {
  [key in DataEventType]: EventSourceDataTypes
}

/**
 * 提供者事件类型, 用于提供者事件监听
 */
export type ProviderEventMap = {
  'app-access-mode-loaded': AccessModeResponse
  'app-token-loaded': string
  'app-params-loaded': AppParamsResponse
  'app-siteinfo-loaded': AppSiteInfoResponse
  'app-meta-loaded': AppMetaResponse


  'conversations-loaded': ConversationHistoryResponse
  'conversations-refresh': void,

  "send-message": string
  "message": Message
  "messages-loaded": ConversationMessageResponse
  "message-end": MessageEnd


}
