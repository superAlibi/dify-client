import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import React, { createContext, FC, PropsWithChildren, useCallback, useEffect, useRef, useState } from "react"
import { ConversationMessageMetaItem, getConversationMessages, ResponseMode, sendMessage } from "../service-calls"
import { useApplication, useConversationFormSchema } from "../hooks/application"

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

const MessageContext = createContext<MessageContextType>({
  messages: [],
  hasMoreHistoryMessages: false,
  isLoadingMessages: false,
  messagesBranchTree: []

})


interface MessageProviderProps {
  conversationId?: string
  user?: string
  reqHeaders: (accessToken: string) => Record<string, string>
}


/**
 * 消息管理上下文
 * 
 * @param props 
 * @returns 
 */
const MessageProviderContent: FC<PropsWithChildren<MessageProviderProps>> = (props) => {
  const { reqHeaders, children, conversationId: originalConversationId, user = 'default' } = props
  const formSchema = useConversationFormSchema()
  const [conversationId, setConversationId] = useState(originalConversationId)
  const signal = useRef<AbortController>(void 0)
  const { emitter, accessToken } = useApplication()
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
        response_mode: ResponseMode.Streaming
      },
      headers: reqHeaders(accessToken!),
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


  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', user, accessToken, conversationId],
    enabled: () => !!accessToken && !!conversationId,
    queryFn: async () => {
      // TODO: 参考useConversations的实现, 实现reqOptions
      return getConversationMessages({ conversation_id: conversationId!, user }, { headers: { Authorization: `Bearer ${accessToken}` } })
    }
  })
  return <MessageContext.Provider value={{
    messages: messages?.data || [],
    hasMoreHistoryMessages: messages?.has_more || false,
    isLoadingMessages: isLoadingMessages,
    messagesBranchTree: []
  }}>
    {children}
  </MessageContext.Provider>
}

const queryClient = new QueryClient()
export const MessageProvider: FC<PropsWithChildren<MessageProviderProps>> = ({ children, ...ops }) => {
  return <QueryClientProvider client={queryClient}>
    <MessageProviderContent {...ops}>
      {children}
    </MessageProviderContent>
  </QueryClientProvider>
}

