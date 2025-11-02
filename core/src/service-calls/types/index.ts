
import { UploadType } from './app-params';

export * from './app-params';
export * from './event-source';
export interface AccessModeResponse {
  accessMode: AccessMode;
}

// TODO 暂时不知道其他的访问模式
export enum AccessMode {
  PUB = "public",
}



export interface AccessTokenResponse {
  /**
   * 访问token，除了webapp/access-mode以外的所有接口请求头中均需要此返回值
   */
  access_token: string;
}



export interface AppSiteInfoResponse {
  app_id: string;
  can_replace_logo: boolean;
  custom_config: null;
  enable_site: boolean;
  end_user_id: string;
  model_config: null;
  plan: string;
  site: Site;
}

export interface Site {
  /**
   * 聊天颜色主题，hex 格式
   */
  chat_color_theme: null;
  /**
   * 聊天颜色主题是否反转
   */
  chat_color_theme_inverted: boolean;
  /**
   * 版权信息
   */
  copyright: null;
  /**
   * 自定义免责声明
   */
  custom_disclaimer: string;
  /**
   * 默认语言
   */
  default_language: string;
  /**
   * 描述
   */
  description: null;
  /**
   * 图标，如果是 emoji 类型，则是 emoji 表情符号，如果是 image 类型，则是图片 URL
   */
  icon: string;
  /**
   * hex 格式的背景色
   */
  icon_background: string;
  /**
   * 图标类型
   */
  icon_type: IconType;
  /**
   * 图标 URL
   */
  icon_url: null;
  /**
   * 隐私政策链接
   */
  privacy_policy: null;
  /**
   * 官方未说明
   */
  prompt_public: boolean;
  /**
   * 是否显示工作流详情
   */
  show_workflow_steps: boolean;
  /**
   * WebApp 名称
   */
  title: string;
  /**
   * 是否使用 WebApp 图标替换聊天中的 🤖
   */
  use_icon_as_answer_icon: boolean;
}

/**
 * 图标类型
 */
export enum IconType {
  Emoji = "emoji",
  Image = "image",
}



export interface AppMetaResponse {
  tool_icons: ToolIcons;
}

export interface ToolIcons {
  toolsName: ToolsName;
}

export interface ToolsName {
  "icon ": IconObject | string;
}

export interface IconObject {
  /**
   * hex 格式的背景色
   */
  "background ": string;
  /**
   * emoji
   */
  content: string;
}







export interface AudioToTextResponse {
  text: string;
}



export interface ConversationMessageQuery {
  /**
   * 会话 ID。
   */
  conversation_id: string;
  /**
   * 当前页第一条聊天记录的 ID，默认 null。
   */
  first_id?: string;
  /**
   * 一次请求返回多少条记录，默认 20 条。
   */
  limit?: string;
  /**
   * 用户标识，由开发者定义规则，需保证用户标识在应用内唯一。重要说明: Service API 不共享 WebApp 创建的对话。通过 API 创建的对话与 WebApp
   * 界面中创建的对话是相互隔离的。
   */
  user?: string;
}

export interface ConversationMessageResponse {
  data: ConversationMessageMetaItem[];
  /**
   * 是否存在下一页。
   */
  has_more: boolean;
  /**
   * 返回条数。
   */
  limit: number;
}

export interface ConversationMessageMetaItem {
  /**
   * 回答消息内容。
   */
  answer?: string;
  /**
   * 会话 ID。
   */
  conversation_id?: string;
  /**
   * 创建时间
   */
  created_at?: number;
  /**
   * 消息反馈信息
   * 
   */
  feedback?: Feedback;
  /**
   * 消息 ID。
   */
  id?: string;
  /**
   * 用户询问问题时的输入参数
   */
  inputs?: ServerConversationFormInputs;
  /**
   * 消息发送时附带的文件信息
   * 消息文件
   */
  message_files?: MessageFile[];
  /**
   * 用户输入/提问内容。
   */
  query?: string;
  retriever_resources?: RetrieverResource[];
}

export interface Feedback {
  /**
   * 反馈类型
   */
  rating: Rating;
}

export enum Rating {
  /**
   * 不喜欢
   */
  Dislike = "dislike",
  /**
   * 喜欢
   */
  Like = "like",
}

/**
 * 输入参数
 */
export interface PostConversationFormInputs {
  /**
   * 取自于parameters接口的userInput数组元素下variable的值
   */

  [key: string]: boolean | number | PostFileInfo | PostFileInfo[] | string;
}



/**
 * ```markdown
 * 由于上传时确定了上传方式,所以这里不再需要all,
 * 只需要local_file和remote_url
 * @see {@link UploadType}
 * @alias {@link UploadType}
 */
export enum TransferMethod {
  local_file = 'local_file',
  remote_url = 'remote_url',
}
/**
 * 远程文件信息
 *
 * 上传本地文件信息
 */
export interface PostFileInfo {
  /**
   * 
   *
   * 当值为local_file 时
   */
  transfer_method: TransferMethod;
  type: UploadFileType;
  /**
   * 当transfer_method值为remote_url时
   * 图片地址
   */
  url?: string;
  /**
   * transfer_method为local_file时使用
   * 上传文件后服务器返回的id
   */
  upload_file_id?: string;
}

export enum UploadFileType {
  Audio = "audio",
  Custom = "custom",
  Document = "document",
  Image = "image",
  Video = "video",
}

export interface MessageFile {
  /**
   * 文件归属方。
   */
  belongs_to?: BelongsTo;
  /**
   * ID。
   */
  id?: string;
  /**
   * 文件类型，例如 'image'。
   */
  type?: string;
  /**
   * 预览图片地址。
   */
  url?: string;
}

/**
 * 文件归属方。
 */
export enum BelongsTo {
  /**
   * 助手
   */
  Assistant = "assistant ",
  /**
   * 用户
   */
  User = "user",
}

export interface RetrieverResource {
  content?: string;
  dataset_id?: string;
  dataset_name?: string;
  document_id?: string;
  document_name?: string;
  position?: number;
  score?: number;
  segment_id?: string;
  [property: string]: any;
}




/**
 * 给出会话历史列表的查询参数
 */
export interface ConversationsHistoryQuery {
  /**
   * 当前页最后面一条记录的 ID
   * tip: 不知道干嘛的
   */
  last_id?: string;
  /**
   * 一次请求返回多少条记录，默认 20 条，最大 100 条，最小 1 条
   */
  limit?: string;
  /**
   * 是否查询置顶的会话
   */
  pinned?: boolean;
  /**
   * 排序
   */
  sort_by?: SortBy;
  /**
   * 用户标识，由开发者定义规则，需保证用户标识在应用内唯一。
   */
  user?: string;
}

/**
 * 排序
 */
export enum SortBy {
  CreatedAt = "created_at",
  SortByCreatedAt = "-created_at",
  SortByUpdatedAt = "-updated_at",
  UpdatedAt = "updated_at",
}



/**
 * 会话历史查询结果
 */
export interface ConversationHistoryResponse {
  data: ConversationHistoryItem[];
  /**
   * 是否还有更多
   */
  has_more: boolean;
  /**
   * 返回条数
   */
  limit: number;
}
export interface ServerFileInfo {
  id: string
  name: string
  size: number
  type: string
  progress: number
  transferMethod: TransferMethod
  supportFileType: string
  originalFile?: File
  uploadedId?: string
  base64Url?: string
  url?: string
  isRemote?: boolean
}

/**
 * 从服务端返回的inputs参数类型
 */
export interface ServerConversationFormInputs {
  [key: string]: number | string | boolean | ServerFileInfo | ServerFileInfo[]
}

export interface ConversationHistoryItem {
  /**
   * 创建时间。
   */
  created_at?: number;
  /**
   * 会话 ID。
   */
  id?: string;
  /**
   * 用户输入参数，根据parameters接口返回的userInput输入的参数,再经过后台处理过后的的参数, 所以一定和上传时候的参数不一样
   */
  inputs?: ServerConversationFormInputs;
  /**
   * 开场白。
   */
  introduction?: string;
  /**
   * 会话名称。
   */
  name?: string;
  /**
   * 会话状态
   */
  status?: string;
  /**
   * 更新时间
   */
  updated_at?: number;
}



/**
 * 设置会话标题的参数
 * 
 */
export interface ConversationTileRenameParams {
  /**
   * 是否自动生成
   */
  auto_generate?: boolean;
  /**
   * 新的名称
   */
  name?: string;
  /**
   * 用户id
   */
  user?: string;
}


/**
 * 会话变量查询参数
 */
export interface ConversationVariableQuery {
  /**
   * 会话 ID。
   * 用于path参数
   */
  conversation_id: string;
  /**
   * （选填）当前页最后面一条记录的 ID，默认 null。
   */
  last_id?: string;
  limit?: string;
  user?: string;
  /**
   * 变量名
   */
  variable_name?: string;
}


/**
 * 会话变量响应结果
 */
export interface ConversationVariableResponse {
  data: ConversationVariableItem[];
  /**
   * 是否有更多项目。
   */
  has_more: boolean;
  /**
   * 每页项目数。
   */
  limit: number;
}

/**
 * 获得workflow中的全局变量
 */
export interface ConversationVariableItem {
  /**
   * 创建时间戳。
   */
  created_at?: number;
  /**
   * 变量描述。
   */
  description?: string;
  /**
   * 变量ID。
   */
  id?: string;
  /**
   * 变量名称。
   */
  name?: string;
  /**
   * 最后更新时间戳。
   */
  updated_at?: number;
  /**
   * 变量值。
   */
  value?: string;
  /**
   * 变量类型 (string, number, boolean 等)。
   */
  value_type?: string;
}





/**
 * 消息反馈信息项
 */
export interface MessageFeedBackInfo {
  app_id?: string;
  content?: string;
  conversation_id?: string;
  /**
   * timestrap
   */
  created_at?: string;
  from_account_id?: string;
  /**
   * uuid
   */
  from_end_user_id?: string;
  from_source?: string;
  id?: string;
  message_id?: string;
  rating?: Rating;
  /**
   * timestrap
   */
  updated_at?: string;
}



export interface FileUploadResponse {
  /**
   * 上传时间。
   */
  created_at: number;
  /**
   * 上传人 ID(UUID)
   */
  created_by: string;
  /**
   * 文件后缀。
   */
  extension: string;
  /**
   * ID。
   */
  id: string;
  /**
   * 文件 mime-type。
   */
  mime_type: string;
  /**
   * 文件名。
   */
  name: string;
  /**
   * 文件大小 (byte)。
   */
  size: number;
  [property: string]: any;
}








/**
 * 发送消息参数
 */
export interface SendMessageParams {
  /**
   * 会话 ID，用于继续之前的对话,不填就是创建新的会话
   */
  conversation_id?: string;
  /**
   * 输入框的文件
   */
  files?: PostFileInfo[];
  /**
   * 允许传入 App 定义的各变量值。如果变量是文件类型，请指定一个 InputFileObjectCn 对象。
   */
  inputs: PostConversationFormInputs;
  /**
   * 
   * ```markdown
   * 作用有2:
   * 1. 上次会话中某对话分支的消息id,比如不以最新的消息id为父消息,则表示这条消息的分支消息
   * 2. 如果不传,则表示是新会话的第一条消息,如果后续发送消息时,不传此参数,则表示这条消息是新会话的第一条消息,直接导致第一条消息有很多个分支
   * 
   * ```
   */
  parent_message_id?: string;
  /**
   * 用户输入/提问内容
   */
  query: string;
  /**
   * 响应模式
   */
  response_mode?: ResponseMode;
  /**
   * 用户标识，应用内唯一。，重要说明: Service API 不共享 WebApp 创建的对话。通过 API 创建的对话与 WebApp 界面中创建的对话是相互隔离的。
   */
  user?: string;
}


/**
* 响应模式
*/
export enum ResponseMode {
  Blocking = "blocking",
  Streaming = "streaming",
}



