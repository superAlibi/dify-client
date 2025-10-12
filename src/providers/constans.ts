/**
 * client apis endpoints
 */
export const APIS = {
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


/**
 * 请求 dify 服务器的基础地址
 */
export let apibase = 'https://api.dify.ai/v1'
export const setApiBase = (base: string) => {
  apibase = base
}



/**
 * 格式化 APIS 的回调函数, 返回的字符串会替换原来的api
 * @param call 
 * @returns 
 */
export const formatApis = (call?: (key: string, url: string) => string): typeof APIS => {
  const entries = Object.entries(APIS).map(([key, value]) => {
    const formated = call ? call(key, value) : `${apibase.replace(/\/+$/, '')}/${value.replace(/^\/+/, '')}`
    return [key, formated]
  })
  return Object.fromEntries(entries)
}

export const getApis = formatApis