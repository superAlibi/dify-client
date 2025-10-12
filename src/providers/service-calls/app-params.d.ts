export interface AppParamsResponse {
  /**
   * 标记回复
   */
  annotation_reply: Enable;
  /**
   * 文件上传配置，根据操作ui获得的信息是:文档 < 15.00 MB, 图片 < 10.00 MB, 音频 < 50.00 MB, 视频 < 100.00 MB
   */
  file_upload: FileUpload;
  /**
   * 未知参数
   */
  more_like_this: Enable;
  /**
   * 开场白，会话开始时会有一个初始会话气泡,由此参数决定
   */
  opening_statement: string;
  /**
   * 引用和归属
   */
  retriever_resource: Enable;
  /**
   * 未知参数
   */
  sensitive_word_avoidance: Enable;
  /**
   * 语音转文字功能,输入框旁边有个麦克风,就是该功能
   */
  speech_to_text: Enable;
  /**
   * 开场白快捷操作项，开场白下方快捷消息项
   */
  suggested_questions: string[];
  /**
   * 每次回答后给出推荐问题
   */
  suggested_questions_after_answer: Enable;
  /**
   * 系统参数
   */
  system_parameters: SystemParameters;
  /**
   * 文字转语音功能,在每一条回答下面都存在一个小喇叭,表示该功能
   */
  text_to_speech: TextToSpeech;
  /**
   * 会话上下文表单配置
   */
  user_input_form: UserInputForm[];
}

/**
 * 标记回复
 *
 * 是否启用
 *
 * 是否启用图片上传
 *
 * 未知参数
 *
 * 引用和归属
 *
 * 语音转文字功能,输入框旁边有个麦克风,就是该功能
 *
 * 每次回答后给出推荐问题
 */
export interface Enable {
  /**
   * 是否启用
   */
  enabled: boolean;
}

/**
 * 文件上传配置，根据操作ui获得的信息是:文档 < 15.00 MB, 图片 < 10.00 MB, 音频 < 50.00 MB, 视频 < 100.00 MB
 */
export interface FileUpload {
  /**
   * 官方未说明，允许的图片后缀
   */
  allowed_file_extensions: AllowedFileExtension[];
  /**
   * 官方未说明，允许上传的文件类型
   */
  allowed_file_types: AllowedFileType[];
  /**
   * 官方未说明，允许文件上传方式
   */
  allowed_file_upload_methods: UploadType[];
  /**
   * 官方未说明，是否启用文件上传
   */
  enabled: boolean;
  /**
   * 官方未说明，猜测是文件上传配置全局配置,等待查看代码后完善
   */
  fileUploadConfig: FileUploadConfig;
  /**
   * 图片上传设置
   */
  image: Image;
  /**
   * 官方未说明，根据ui操作后,实际接口返回, 此参数为文件上传设置的上传数量限制,默认为3,最大为10
   */
  number_limits: number;
}

export enum AllowedFileExtension {
  GIF = ".GIF",
  JPEG = ".JPEG",
  Jpg = ".JPG",
  PNG = ".PNG",
  SVG = ".SVG",
  Webp = ".WEBP",
}

/**
 * 文档/语音/视频/图片的集合
 */
export enum AllowedFileType {
  Audio = "audio",
  Custom = "custom",
  Document = "document",
  Image = "image",
  Video = "video",
}

/**
 * 上传文件的方式
 *
 * 上传方式
 */
export enum UploadType {
  LocalFile = "local_file",
  Remoteurl = "remote_url",
}

/**
 * 官方未说明，猜测是文件上传配置全局配置,等待查看代码后完善
 */
export interface FileUploadConfig {
  audio_file_size_limit: number;
  batch_count_limit: number;
  file_size_limit: number;
  image_file_size_limit: number;
  video_file_size_limit: number;
  workflow_file_upload_limit: number;
  [property: string]: any;
}

/**
 * 图片上传设置
 *
 * 标记回复
 *
 * 是否启用
 *
 * 是否启用图片上传
 *
 * 未知参数
 *
 * 引用和归属
 *
 * 语音转文字功能,输入框旁边有个麦克风,就是该功能
 *
 * 每次回答后给出推荐问题
 */
export interface Image {
  /**
   * 是否启用
   */
  enabled: boolean;
  /**
   * 图片数量限制
   */
  number_limits: string;
  /**
   * 上传方式
   */
  transfer_methods: UploadType;
}

/**
 * 系统参数
 */
export interface SystemParameters {
  /**
   * 音频文件上传大小限制(MB)
   */
  audio_file_size_limit: number;
  /**
   * 文档文件上传大小限制(MB)
   */
  file_size_limit: number;
  /**
   * 图片上传大小限制(mb)
   */
  image_file_size_limit: number;
  /**
   * 视频上传大小限制(MB)
   */
  video_file_size_limit: number;
  /**
   * 官方未说明，未知,等待查看源码
   */
  workflow_file_upload_limit: number;
}

/**
 * 文字转语音功能,在每一条回答下面都存在一个小喇叭,表示该功能
 *
 * 标记回复
 *
 * 是否启用
 *
 * 是否启用图片上传
 *
 * 未知参数
 *
 * 引用和归属
 *
 * 语音转文字功能,输入框旁边有个麦克风,就是该功能
 *
 * 每次回答后给出推荐问题
 */
export interface TextToSpeech {
  /**
   * 是否启用
   */
  enabled: boolean;
  /**
   * 是否自动播放
   */
  autoPlay: AutoPlay;
  /**
   * 语言
   */
  language: string;
  /**
   * 语音类型
   */
  voice: string;
}

/**
 * 是否自动播放
 */
export enum AutoPlay {
  Disabled = "disabled",
  Enabled = "enabled",
}

export interface UserInputForm {
  /**
   * 文本输入框控件
   */
  "text-input"?: BaseFormItem;
  /**
   * 段落输入控件
   */
  paragraph?: BaseFormItem;
  select?: Select;
  [property: string]: any;
}

/**
 * 文本输入框控件
 *
 * 会话表单项的基本类型
 *
 * 段落输入控件
 */
export interface BaseFormItem {

  /**
   * 默认值
   */
  default: string;
  /**
   * 控件展示标签名
   */
  label: string;
  /**
   * 是否必填
   */
  required: boolean;
  /**
   * 控件id
   */
  variable: string;

}

/**
 * 文本输入框控件
 *
 * 会话表单项的基本类型
 *
 * 段落输入控件
 */
export interface Select extends BaseFormItem {

  /**
   * 下拉选项
   */
  options: string[];
}