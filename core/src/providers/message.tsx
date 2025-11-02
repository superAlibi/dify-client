import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import { createContext, FC, PropsWithChildren, useCallback, useEffect, useRef, useState } from "react"
import { ConversationMessageMetaItem, EventSourceBase, getConversationMessages, Message, MessageEnd, ResponseMode, sendMessage, SendMessageParams } from "../service-calls"
import { useApplication, useConversationFormSchema } from "../hooks/application"
import { HTTPError, Options } from "ky"
import { EventSourceParserStream } from 'eventsource-parser/stream'
import { EventSourceMessage } from "eventsource-parser"
import { produce } from "immer"
// import { useFetchEventSource } from '@reactuses/core'
interface MessageContextType {
  /**
   * 原始消息列表
   */
  messages: ConversationMessageMetaItem[]

  /**
   * 目标消息节点ID
   * 当用户点击消息时, 会设置目标消息节点ID, 用于消息树的分支切换显示
   */
  targetMessageNodeId?: string

  /**
   * 历史会话消息是否正在加载中
   */
  messageInitialLoading: boolean
  /**
   * 是否还有更多历史会话消息
   */
  hasMoreHistoryMessages: boolean

  /**
   * 消息流是否正在加载中(是否正在回应中)
   */
  get messageResponding(): boolean

  /**
   * 获取消息流的中止控制器,为子孙组件提供支持
   * 
   * @returns 
   */
  get abortController(): AbortController | void

}

export const ConversationMessageContext = createContext<MessageContextType>({
  messages: [],
  hasMoreHistoryMessages: false,
  messageInitialLoading: false,
  get messageResponding() { return false },
  get abortController() { return void 0 },

})




interface MessageProviderProps {
  /**
   * 会话id, 不提供则表示一个新的会话
   */
  conversationId?: string
  user?: string
  reqOptions: Options | ((accessToken: string) => Options)
  /**
   * ```markdown
   * # 注意
   * 如果传入了此参数,将不会提供默认的事件处理,需要自行处理所有的服务器事件
   * 
   * ```
   * @param message 
   * @returns 
   */
  onEventSouce?: (message: EventSourceMessage) => void | Promise<void>
  /**
   * 当检测到服务器存在连接时, 会调用此函数,即数据流到达前触发此函数
   * @returns 
   */
  onOpen?: () => void | Promise<void>
  /**
   * 当检测到服务器的消息完毕后,会调用此函数
   * @returns 
   */
  onClose?: () => void | Promise<void>
  /**
   * 因为调用abortController.abort()时, 会触发此函数
   * 通常因为子组件调用而终止, 本组件内部不会调用 abortController.abort()
   * @param reason 
   * @returns 
   */
  onAbort?: (reason: string) => void | Promise<void>
  /**
   * 当发送消息时, dify 服务器出现了错误, 会调用此函数,
   * 通常是业务参数不正确,
   * 或者dify服务器那边出现了异常,比如传入了错误的文件id一类的
   * @param error 
   * @returns 
   */
  onError?: (error: HTTPError) => void | Promise<void>

}

const textDecoderStream = new TextDecoderStream('utf-8')
const parser = new EventSourceParserStream({
  onComment(comment) {
    console.log('事件源解析器事件', comment)
  },
  onError(error) {
    console.error('事件源解析器错误', error)
  },
  onRetry(retry) {
    console.log('事件源解析器重试', retry)
  },
})


/**
 * 消息管理上下文
 * 
 * @param props 
 * @returns 
 */
const MessageProviderContent: FC<PropsWithChildren<MessageProviderProps>> = (props) => {
  // 
  const {
    onEventSouce,
    onOpen,
    onClose,
    onError,
    onAbort,
    reqOptions,
    children,
    conversationId: originalConversationId,
    user = 'default'
  } = props
  /**
   * 临时消息id
   * 只作用于 已发起消息 , 但dify服务器还未正式返回消息 id 之前, 用于前端的渲染key使用
   * 当一轮问答结束后,该临时消息会被重置, 用于新一轮消息对的临时消息id
   */
  const tempMessageId = useRef<string>(crypto.randomUUID())
  // 表单验证schema(zod)
  const formSchema = useConversationFormSchema()
  // 发送消息时的请求终止信号种子
  const signal = useRef<AbortController>(void 0)
  // 消息流是否正在加载中(是否正在回应中)
  const messageResponding = useRef(false)
  const { emitter, accessToken } = useApplication()

  // 所有基于ky的请求设置项,现在只用了headers,
  const options = typeof reqOptions === 'function' ? reqOptions(accessToken!) : reqOptions

  /** 
   * 会话ID, 当会话ID发生变化时, 会重新加载会话消息
   * 作用有3
   * 1. 用于选中的会话的初始历史消息加载
   * 2. 当新会话开启时, 会用来临时储存新生成的会话id, 避免导致不必要的历史消息重新加载
   * 3. 在消息完成后, 会更新 currentConversationId 为新的会话id, 用于下次发送消息时, 继续当前会话
   */
  const currentConversationId = useRef(originalConversationId)
  useEffect(() => {
    currentConversationId.current = originalConversationId
  }, [originalConversationId])
  /**
   * 选中的会话的初始历史消息信息,用于初始化消息列表
   */
  const { data: InitialMessages, isLoading: isLoadingInitialMessages } = useQuery({
    queryKey: ['messages', user, accessToken, originalConversationId],
    enabled: () => !!accessToken && !!originalConversationId,
    queryFn: async () => {
      return getConversationMessages({ limit: 20, conversation_id: originalConversationId!, user }, options)
    }
  })



  /**
   * 内部的消息列表, 用于存储当前会话的消息
   * 用于渲染消息列表, 当消息列表发生变化时, 会触发消息列表的重新渲染
   * 作用点有2个:
   * 1. post-message后, 因为服务器是sse消息返回, 所以需要一个内部的消息列表来存储消息, 当消息片段返回时, 更新消息列表
   * 2. 用于生成消息分支树, 同一个会话,可能存在重新生成, 并产生新的消息分支, 消息分支树用于渲染消息列表
   */
  const [messages, setMessages] = useState<ConversationMessageMetaItem[]>(InitialMessages?.data || [])
  useEffect(() => {
    setMessages(InitialMessages?.data || [])
  }, [InitialMessages])

  /**
   * 本函数只用于处理事件源数据, 并处理消息列表, 不处理其他任何函数
   * 
   * 使用函数式更新避免闭包陷阱问题:
   * - 不依赖外部的 messages 状态
   * - 使用 setMessages(prev => ...) 获取最新状态
   * - 确保在流处理中始终访问到最新数据
   * 
   * @param postInfo 发送消息时的参数对象, 用于后续的对话分支生成
   * @param data 事件源数据, 用于更新消息列表
   * 
   * @returns void
   */
  const eventSourceDataHandler = useCallback((postInfo: SendMessageParams, eventSourceData?: EventSourceBase) => {
    if (!eventSourceData) {
      // 更新消息列表,并且预存一个空消息,用于后期消息流结束时, 更新消息列表
      setMessages(prev => [...prev, {
        id: tempMessageId.current,
        query: postInfo.query,
      }])
      return
    }


    /**
     * 重复部分代码,用于更新消息列表
     * @param messageItem 
     */
    function updateMessages(messageItem: Message) {
      // 使用函数式更新,确保访问到最新的 messages 状态
      emitter.emit('message', messageItem)
      setMessages(prev => {
        // 优先找到于 messageItem.id 的节点, 因为找到了,那么多半就已经是在react中更新过消息信息了, 否则就是第一次更新

        const voidMessageIndex = prev.findIndex(item => item.id === messageItem.id || item.id === tempMessageId.current)
        console.assert(voidMessageIndex !== -1, '未找到预存空消息节点')

        return produce(prev, draft => {
          const currentMessage = draft[voidMessageIndex]
          draft.splice(voidMessageIndex, 1, {
            query: postInfo.query,
            id: messageItem.id,
            answer: [currentMessage.answer, messageItem.answer].filter(Boolean).join(''),
          })
        })
      })
    }
    switch (eventSourceData?.event) {
      case 'message': {
        const messageItem = eventSourceData as Message
        updateMessages(messageItem)
        break
      }
      case 'agent_message': {
        const agentMessage = eventSourceData as Message
        updateMessages(agentMessage)
        break
      }
      case 'message_end': {
        emitter.emit('message-end', eventSourceData as MessageEnd)
        // const messageEnd = eventSourceData as MessageEnd
        // 更新临时消息id,为下一次新的消息做准备
        tempMessageId.current = crypto.randomUUID()
        break
      }
      default:
        // TODO: 需要其他本组件不关注的sse,并通过emitter触发
        // console.debug('未知事件', eventSourceData)
        break
    }
  }, [emitter])

  /**
   * 发送消息事件处理函数
   * 当用户发送消息时, 会触发发送消息事件, 并最终调用本函数
   * 
   * 
   * 内部会验证表单, 如果表单验证不通过, 则不会发送消息
   * 内部会引用实际的会话id, 而不是原始的会话id(originalConversationId)
   * 
   */
  const sendMessageHandler = useCallback((query: string) => {
    if (!query) return
    const result = formSchema?.safeParse({})

    // 如果表单验证不通过, 则不发送消息
    if (result && !result.success) {
      console.error('send-message-error', result?.error.issues.map(item => item.message).join(', '))
      return
    }

    // 如果存在中止控制器, 则中止
    if (signal.current) {
      signal.current.abort()
    }
    // 创建新的中止控制器
    const newSignal = new AbortController()
    signal.current = newSignal
    // 设置消息流正在加载中
    messageResponding.current = true
    // 构建发送消息的参数对象
    const postInfo: SendMessageParams = {
      inputs: result?.data ?? {},
      query,
      response_mode: ResponseMode.Streaming,
      conversation_id: currentConversationId.current,
      parent_message_id: messages.at(-1)?.id
    }
    /**
     * 更新一下消息列表, 预存一个空消息,用于后期消息流结束时, 更新消息列表
     */
    eventSourceDataHandler(postInfo)

    // 发送消息
    sendMessage({
      signal: newSignal.signal,
      json: postInfo,
      headers: options.headers as Record<string, string>,
    }).then(async (res: Response) => {

      // tip: 此部分其实也可以使用@reactuses的useFetchEventSource hook来处理, 
      // 但实际上, @reactuses的useFetchEventSource内部使用的是@microsoft/fetch-event-source, 所以还是自己处理了
      res.body?.pipeThrough(textDecoderStream)
        .pipeThrough(parser)
        .pipeTo(new WritableStream({
          start(controller) {
            console.log('开始接收数据');
            onOpen?.()
          },
          write(e) {
            // 如果onEventSouce存在, 则调用onEventSouce,不自行处理,提供的方法需要处理所有的事件
            if (onEventSouce) {
              return onEventSouce(e)
            }
            switch (e.event) {
              // 此处是服务器返回的心跳包事件,没有任何事件数据和消息id
              case 'ping':
                console.log('心跳包事件');
                break
              // 此处是服务器返回的消息事件
              default: {
                // 解析消息, 消息一般为json,但是返回的json信息需要参考/src/service-calls/types/event-source/index.ts中的接口定义, 进行解析
                const eventSourceData = JSON.parse(e.data)
                eventSourceDataHandler(postInfo, eventSourceData)
              }
            }
          },
          close() {
            console.log('消息流结束')
            onClose?.()
            messageResponding.current = false
          },
          abort(reason) {
            onAbort?.(reason || '未知原因')
            messageResponding.current = false
          }
        }))
    }, (e: HTTPError) => {
      // 此处是发送消息错误时, 服务器返回的错误信息, 一般为json格式
      e.response.json().then(data => {
        console.error('发送消息错误', data)
        onError?.(e)
      }).catch(error => {
        console.error('服务器返回的错误信息解析错误', error)
        onError?.(error)
      }).finally(() => {
        messageResponding.current = false
      })
    })
  }, [formSchema, messages, eventSourceDataHandler, onOpen, onClose, onError, onAbort, options])
  /**
   * 监听发送消息事件
   * 当用户发送消息时, 会触发发送消息事件
   * 会话消息会自动加载
   * 
   */
  useEffect(() => {
    if (!emitter) return
    emitter?.on('send-message', sendMessageHandler)
    return () => {
      emitter?.off('send-message', sendMessageHandler)
    }
  }, [emitter, sendMessageHandler])



  return <ConversationMessageContext.Provider
    value={{
      messages: messages || [],
      hasMoreHistoryMessages: InitialMessages?.has_more || false,
      messageInitialLoading: isLoadingInitialMessages,
      get messageResponding() { return messageResponding.current },
      get abortController() { return signal.current },
    }}>
    {children}
  </ConversationMessageContext.Provider>
}

const queryClient = new QueryClient()
export const MessageProvider: FC<PropsWithChildren<MessageProviderProps>> = ({ children, ...ops }) => {
  return <QueryClientProvider client={queryClient}>
    <MessageProviderContent {...ops}>
      {children}
    </MessageProviderContent>
  </QueryClientProvider>
}

