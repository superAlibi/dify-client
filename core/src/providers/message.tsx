import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react"
import { ConversationMessageMetaItem, getConversationMessages, ResponseMode, sendMessage } from "../service-calls"
import { useApplication, useConversationFormSchema } from "../hooks/application"
import { Options } from "ky"

interface MessageContextType {
  /**
   * 原始消息列表
   */
  messages: ConversationMessageMetaItem[]
  /**
   * 消息树
   * 消息可能会重新生成, 重新生成后会产生消息分支,
   * 消息树则是原始消息列表重新格式化后生成的消息分支树
   * 方便用户渲染消息列表
   */
  messagesBranchTree: any[]
  /**
   * 目标消息节点ID
   * 当用户点击消息时, 会设置目标消息节点ID, 用于消息树的分支切换显示
   */
  targetMessageNodeId?: string

  /**
   * 历史会话消息是否正在加载中
   */
  isLoadingMessages: boolean
  /**
   * 是否还有更多历史会话消息
   */
  hasMoreHistoryMessages: boolean
}

export const ConversationMessageContext = createContext<MessageContextType>({
  messages: [],
  hasMoreHistoryMessages: false,
  isLoadingMessages: false,
  messagesBranchTree: []

})




interface MessageProviderProps {
  conversationId?: string
  user?: string
  reqOptions: Options | ((accessToken: string) => Options)
}


/**
 * 消息管理上下文
 * 
 * @param props 
 * @returns 
 */
const MessageProviderContent: FC<PropsWithChildren<MessageProviderProps>> = (props) => {
  // 
  const { reqOptions, children, conversationId: originalConversationId, user = 'default' } = props
  // 表单验证schema(zod)
  const formSchema = useConversationFormSchema()
  // 发送消息时的请求终止信号种子
  const signal = useRef<AbortController>(void 0)

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
   * 发送消息事件处理函数
   * 当用户发送消息时, 会触发发送消息事件, 并最终调用本函数
   * 
   * 
   * 内部会验证表单, 如果表单验证不通过, 则不会发送消息
   * 内部会引用实际的会话id, 而不是原始的会话id(originalConversationId)
   * 
   */
  const sendMessageHandler = useCallback((message: string) => {
    if (!message) return
    const result = formSchema?.safeParse({})

    if (result && !result.success) {
      console.error('send-message-error', result?.error.issues.map(item => item.message).join(', '))
      return
    }

    if (signal.current) {
      signal.current.abort()
    }
    const newSignal = new AbortController()
    signal.current = newSignal
    sendMessage({

      signal: newSignal.signal,
      json: {
        inputs: {},
        query: message,
        response_mode: ResponseMode.Streaming,
        conversation_id: currentConversationId.current,
        parent_message_id: ''

      },
      headers: options.headers as Record<string, string>,
      onmessage(ev) {
        if (ev.event) {
          console.log(ev.event);

        } else {

          console.log(ev.data);
        }

      },
      async onopen(response) {

      },
      onerror(err) {
        console.error('send-message-error', err)
      },
      onclose() {
        console.log('send-message-close')

      },
    })
  }, [formSchema])
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
  }, [emitter])



  return <ConversationMessageContext.Provider value={{
    messages: messages || [],
    hasMoreHistoryMessages: InitialMessages?.has_more || false,
    isLoadingMessages: isLoadingInitialMessages,
    messagesBranchTree: []
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

