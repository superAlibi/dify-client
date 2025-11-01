import { AccessModeResponse, AppMetaResponse, AppParamsResponse, AppSiteInfoResponse, ConversationHistoryResponse, ConversationMessageResponse } from "../service-calls"

export type AppEvents = {
  'app-access-mode-loaded': AccessModeResponse
  'app-token-loaded': string
  'app-params-loaded': AppParamsResponse
  'app-siteinfo-loaded': AppSiteInfoResponse
  'app-meta-loaded': AppMetaResponse


  'conversations-loaded': ConversationHistoryResponse
  'conversations-refresh': void,

  "send-message": string
  "message": string
  "messages-loaded": ConversationMessageResponse
}
