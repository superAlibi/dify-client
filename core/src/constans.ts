/**
 * client apis endpoints
 */
const api_meta = {
  /* 
    APP APIS
  */
  ACCESS_MODE: 'webapp/access-mode',
  ACCESS_TOKEN: 'passport',
  APP_PARAMETERS: 'parameters',
  APP_INFO: 'site',
  APP_META: 'meta',

  /* 
  TEXT & AUDIO APIS
  */
  AUDIO_TO_TEXT: 'audio-to-text',
  TEXT_TO_AUDIO: 'text-to-audio',


  /* 
  CONVERSATION APIS
  */
  CONVERSATION_MESSAGES: 'messages',
  CONVERSATION_HISTORIES: 'conversations',
  CONVERSATION_DELETE: 'conversations/{conversation_id}',
  CONVERSATION_TITLE: 'conversations/{conversation_id}/name',
  CONVERSATION_VARIABLE: 'conversations/{conversation_id}/variables',

  /* 
    MESSAGE APIS
  */
  MESSAGE_POST: 'chat-messages',
  MESSAGE_STOP: 'chat-messages/{task_id}/stop',
  MESSAGE_SUGGESTIONS: 'messages/{message_id}/suggested',

  /*
    MESSAGE FEEDBACK APIS
   */
  MESSAGE_FEEDBACK: 'messages/{message_id}/feedbacks',
  MESSAGE_FEEDBACKS: 'app/feedbacks',


  /* 
    CONVERSATION FILE APIS
  */
  FILE_UPLOAD: 'files/upload',
  FILE_PREVIEW: 'files/{file_id}/preview',




} as const


export let defaultApiPrefixUrl = ''

/**
 * 默认的 API 对象
 */
export const APIS = formatApis(defaultApiPrefixUrl)

export const setApiBase = (baseURL: string, resetAPIS: boolean = false) => {
  defaultApiPrefixUrl = baseURL
  if (resetAPIS) {
    return Object.assign(APIS, formatApis(defaultApiPrefixUrl))
  }
  return APIS
}

type FormatCall = (key: string, url: string) => string


/**
 * 格式化 APIS 的回调函数, 返回的字符串会替换原来的api
 * @param formatCall 格式化回调函数, 返回的字符串会替换原来的api
 * @returns 
 */
export function formatApis(formatCall: FormatCall): typeof api_meta
export function formatApis(baseURL: string): typeof api_meta
export function formatApis(formatCall: FormatCall | string): typeof api_meta {
  const entries = Object.entries(api_meta).map(([key, value]) => {
    if (typeof formatCall === 'string') {
      if (!formatCall) {
        return [key, value]
      }
      if (!formatCall.startsWith('/') || !value.endsWith('/')) {
        const base = formatCall.replace(/\/+$/, '').replace(/^\//, '')
        if (base) {
          return [key, `${base}/${value}`]
        }
        return [key, value]
      }
      return [key, `${formatCall}/${value}`]
    }
    return [key, formatCall(key, value)]
  })
  return Object.fromEntries(entries) as typeof api_meta
}

export const getApis = formatApis