
import { APIS, defaultApiPrefixUrl, setApiBase } from '../constans'
import {
  AccessModeResponse, AccessTokenResponse,
  AppMetaResponse,
  AppSiteInfoResponse, AudioToTextResponse,
  ConversationHistoryResponse,
  ConversationMessageResponse,
  ConversationHistoryItem,
  ConversationVariableResponse,
  SortBy,
  MessageFeedBackInfo,
  FileUploadResponse,
  SendMessageParams
} from './types'
import z from 'zod'
import { AppParamsResponse } from './types/app-params'

import ky, { type Options } from "ky";



export let service = ky.create({
  retry: 0,
  timeout: 60000,
})

export const resetService = (options: Options) => {
  setApiBase(options.prefixUrl as string, false)
  return service = ky.create({ ...options, retry: 0, })
}

/**
 * 给出应用的访问模式
 * @returns 
 */
export const getAppAccessMode = async (appCode: string, reqOptions?: Options) => {
  return service.get(APIS.ACCESS_MODE, { searchParams: { appCode }, ...reqOptions }).json<AccessModeResponse>()
}


/**
 * 给出访问应用的 token
 * 后续的所有接口请求头中均需要此返回值
 * 该返回值的access_token放于请求头的 Authorization 字段中, 格式为 Bearer {access_token}
 * @param appCode 
 * @param reqOptions 
 * @returns 
 */
export const getAppAccessToken = (appCode: string, reqOptions?: Options) => {
  const { headers, ...ops } = reqOptions || {};
  if (headers instanceof Headers) {
    headers.set('x-app-code', appCode)
  } else if (typeof headers === 'object') {
    reqOptions = { ...ops, headers: { ...headers, 'x-app-code': appCode } }
  } else {
    reqOptions = { ...ops, headers: { 'x-app-code': appCode } }
  }
  return service.get(APIS.ACCESS_TOKEN, reqOptions).json<AccessTokenResponse>()
}

/**
 * 给出app的运行时参数
 * 主要是聊天初始化表单
 * 聊天时文件上传参数
 * 
 * @param reqOptions 
 * @returns 
 */
export const getAppRuntimeParameters = async (reqOptions?: Options) => {
  return service.get(APIS.APP_PARAMETERS, { ...reqOptions }).json<AppParamsResponse>()
}

/**
 * app 的站点信息
 * @returns 
 */
export const getAppSiteinfo = async (options: Options) => {
  return service.get(APIS.APP_INFO, options).json<AppSiteInfoResponse>()
}


/**
 * 不知道有什么用
 * 似乎用来替换智能体的图标用的
 */
export const getAppMeta = (options: Options) => {
  return service.get(APIS.APP_META, options).json<AppMetaResponse>()
}





export const ConversationMessagesQuerySchema = z.object({
  conversation_id: z.string("会话 ID 不能为空").min(1, "会话 ID 不能为空"),
  user: z.string('可选参数').default('default').optional(),
  first_id: z.string().optional(),
  limit: z.number().default(20).optional(),
})


/**
 * 获得指定会话的历史消息
 * @param newBase 
 */
export const getConversationMessages = (query: z.infer<typeof ConversationMessagesQuerySchema>, options: Options) => {
  return service.get(APIS.CONVERSATION_MESSAGES, { searchParams: query, ...options }).json<ConversationMessageResponse>()
}


/**
 * 给出会话历史列表的查询参数
 */
export const ConversationsQuerySchema = z.object({
  user: z.string('可选参数').default('default').optional(),
  limit: z.int().optional().default(20),
  pinned: z.boolean().optional(),
  sort_by: z.enum(['created_at', 'updated_at', '-created_at', '-updated_at'] as SortBy[]).optional(),
  last_id: z.string().optional(),
})

/**
 * 获取会话历史列表
 */
export const getConversations = async (searchParams: z.infer<typeof ConversationsQuerySchema>, options: Options) => {
  return service.get(APIS.CONVERSATION_HISTORIES, { ...options, searchParams, }).json<ConversationHistoryResponse>()
}


/**
 * 删除历史会话的参数
 */
export const ConversationDeleteSchema = z.object({
  conversation_id: z.string("会话 ID 不能为空").min(1, "会话 ID 不能为空"),
  user: z.string('可选参数').optional().default('default'),
})

/**
 * 删除历史会话
 * @param params 
 * @returns 
 */
export const deleteConversation = (params: z.infer<typeof ConversationDeleteSchema>, options: Options) => {
  const { conversation_id, user } = params
  return service.delete<void>(APIS.CONVERSATION_DELETE.replace('{conversation_id}', conversation_id), { ...options, json: { user } })
}


/**
 * 设置会话标题的参数
 */
export const ConversationTitleSchema = z.object({
  conversation_id: z.string("会话 ID 不能为空").min(1, "会话 ID 不能为空"),
  name: z.string("标题不能为空").max(100, "标题不能超过100字").optional(),
  user: z.string('可选参数').optional().default('default'),
  auto_generate: z.boolean().optional().default(false),
})


/**
 * 设置会话标题
 * 当传入name时按照name重命名会话
 * 当传入auto_generate时，按照会话内的消息自动生成标题
 * @param params 
 * @param options 
 * @returns 
 */
export const setConversationTitle = (params: z.infer<typeof ConversationTitleSchema>, options: Options) => {
  const { conversation_id, name, user, auto_generate } = params
  return service.post(APIS.CONVERSATION_TITLE.replace('{conversation_id}', conversation_id),
    {
      ...options, json: { auto_generate, name, user }
    }
  ).json<ConversationHistoryItem>()
}



/**
 * 会话变量查询参数
 */
export const ConversationVariableSchema = z.object({
  conversation_id: z.string("会话 ID 不能为空").min(1, "会话 ID 不能为空"),
  /**
   * （选填）当前页最后面一条记录的 ID，默认 null。
   */
  last_id: z.string().optional(),
  limit: z.string().optional(),
  /**
   * 变量名
   */
  variable_name: z.string().optional(),
  user: z.string('可选参数').optional().default('default'),
})


/**
 * 获取会话变量
 * @param query 
 * @param options 
 * @returns 
 */
export const getConversationVariables = (query: z.infer<typeof ConversationVariableSchema>, options: Options) => {
  const { conversation_id, ...searchParams } = query
  return service.get(
    APIS.CONVERSATION_VARIABLE.replace('{conversation_id}', conversation_id),
    { searchParams, ...options }).json<ConversationVariableResponse>()
}


/**
 * 消息反馈schema
 */
export const SendMessageFeedbackSchema = z.object({
  message_id: z.string("消息 ID 不能为空").min(1, "消息 ID 不能为空"),
  rating: z.enum(['like', 'dislike'] as const, "反馈类型不能为空"),
  user: z.string('可选参数').optional().default('default'),
})

/**
 * 发送对指定消息的反馈
 * @param data 
 * @param options 
 * @returns 
 */
export const sendMessageFeedback = (data: z.infer<typeof SendMessageFeedbackSchema>, options: Options) => {
  const { message_id, rating, user } = data
  return service.post(
    APIS.MESSAGE_FEEDBACK.replace('{message_id}', message_id),
    { ...options, json: { rating, user } }
  ).json<{ result: 'success' }>()
}



/**
 * 消息反馈查询参数
 */
export const MessageFeedbacksSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20),
})

/**
 * 给出所有的消息反馈
 * @param params 
 * @param options 
 * @returns 
 */
export const messageFeedbacks = (params: z.infer<typeof MessageFeedbacksSchema>, options: Options) => {
  return service.get(APIS.MESSAGE_FEEDBACKS,
    { searchParams: { ...params }, ...options }
  ).json<{ data: MessageFeedBackInfo[] }>()
}



/**
 * 语音转文字的参数
 */
export const AudioToTextSchema = z.object({
  file: z.file("请传入文件").max(15 * 1024 * 1024, "文件大小不能超过15MB"),
  user: z.string('用户uuid不能为空').optional(),
})

/**
 * 将语音文件转为文字
 * @param data 
 * @param options 
 * @returns 
 */
export const audioToText = async (data: z.infer<typeof AudioToTextSchema>, options?: Options) => {
  const body = new FormData()
  Object.entries(data).forEach(([k, v]) => {
    body.append(k, v)
  })
  return service.post(APIS.AUDIO_TO_TEXT, { body, ...options }).json<AudioToTextResponse>()
}




export const textToAudioSchema = z.object({
  text: z.string().min(1, "文本不能为空").max(5000, "文本不能超过5000字"),
  user: z.string().optional(),
  message_id: z.string().optional(),
})

/**
 * 文字转语音
 * @param json 
 * @param other 
 * @returns 
 */
export const textToAudio = async (json: z.infer<typeof textToAudioSchema>, other: Options) => {
  return service.post(APIS.TEXT_TO_AUDIO, { ...other, json }).json<{ audio_url: string }>()
}


/**
 * 文件上传的参数
 */
export const fileUploadSchema = z.object({
  file: z.file("请传入文件"),
  user: z.string('用户uuid不能为空').optional().default('default'),
})


/**
 * 文件上传操作
 * @param data 
 * @param options 
 * @returns 
 */
export const uploadFile = (data: z.infer<typeof fileUploadSchema>, options?: Options) => {
  const body = new FormData()
  Object.entries(data).forEach(([k, v]) => {
    body.append(k, v)
  })
  return service.post(APIS.FILE_UPLOAD, { body, ...options }).json<FileUploadResponse>()
}


/**
 * 预览文件的参数
 */
export const filePreviewSchema = z.object({
  file_id: z.string("请传入文件ID"),
  as_attachment: z.boolean('是否作为附件').optional().default(false),
})

/**
 * 获取文件
 * @param params 
 * @param options 
 * @returns 
 */
export const previewFile = (params: z.infer<typeof filePreviewSchema>, options?: Options) => {
  const { file_id, as_attachment } = params
  return service.get<ArrayBuffer>(APIS.FILE_PREVIEW.replace('{file_id}', file_id), { searchParams: { as_attachment }, ...options })
}


interface SendMessageOptions extends Omit<Options, 'fetch' | 'method' | 'body' | 'retry' | 'timeout'> {
  json: SendMessageParams
  searchParams?: Record<string, string>
}


/**
 * 发送消息
 * 能接收到的 sse data 部分的 event 消息格式请参考types/event-source/index.ts
 * @see  {@link EventSourceTypes} EventSourceTypes
 * @param options 
 * @returns 
 */
export const sendMessage = async (options: SendMessageOptions) => {
  const { ...ops } = options || {}



  return service.post(APIS.MESSAGE_POST, {
    ...ops,
    retry: 0,
    timeout: false,
  })
}


