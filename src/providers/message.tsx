import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import { createContext, FC, PropsWithChildren } from "react"
import { ConversationMessageMetaItem, getConversationMessages } from "../service-calls"
import { useApplication, useConversationFormSchema } from "../hooks/application"
import { useListener } from "../hooks/emit"

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
  accessToken: string
  conversationId?: string
  user?: string
}


/**
 * 消息管理上下文
 * 
 * @param props 
 * @returns 
 */
const MessageProviderContent: FC<PropsWithChildren<MessageProviderProps>> = (props) => {
  const formSchema = useConversationFormSchema()
  /**
   * 监听发送消息事件
   * 当用户发送消息时, 会触发发送消息事件
   * 会话消息会自动加载
   * TODO: 等待完善
   */
  useListener('send-message', (message) => {
    debugger
    console.log('send-message', message)
    const result = formSchema?.safeParse({})
    if (!result?.success) {
      console.error('send-message-error', result?.error)
      return
    }
  })

  const { children, accessToken, conversationId, user = 'default' } = props
  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', user, accessToken, conversationId],
    enabled: () => !!accessToken && !!conversationId,
    queryFn: async () => {
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

