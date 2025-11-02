# dify 客户端工具


## 客户端react providers

### AppParamsProvider|ParamsProviderProps

提供应用的全局配置
1. 表单配置
2. 应用文件信息限制
3. 自动请求passport(token|auth)
4. meta信息
5. site信息

### ConversationProvider

提供会话相关信息


### MessageProvider

最复杂的组件, 提供消息相关处理逻辑和信息



## 请求小工具

包含客户端请求需要的接口

### resetService

在包内部,请求工具使用的的是 ky , 该方法允许重写 ky的请求逻辑

### getAppAccessMode

获得dify那边的访问模式

### getAppAccessToken

获得访问令牌

### getAppRuntimeParameters

获得运行时参数

### getAppSiteinfo

获得站点(应用的配置在ui上的展现)信息


### getAppMeta

meta信息,好像没什么用


### getConversationMessages

通过conversation id 获得会话的所有消息


### getConversations

获得某个应用的所有会话


### deleteConversation

删除某个会话的call

### setConversationTitle

设置或生成会话的标题


### getConversationVariables
获得会话的变量信息



### sendMessageFeedback
发送对某个消息的反馈信息


### messageFeedbacks

获得所有信息的反馈信息


### audioToText

语音转文字信息


### textToAudio

文字转语音


### uploadFile
上传文件


### previewFile

预览文件


### sendMessage

发送消息




