import { useQuery } from "@tanstack/react-query"
import { ConversationMessagesQuerySchema, getConversationMessages, messageFeedbacks, MessageFeedbacksSchema } from "../service-calls"
import { SendMessageFeedbackSchema } from "../service-calls"
import { sendMessageFeedback } from "../service-calls"
import z from "zod"

/**
 * 获取会话消息
 * @param accessCode 
 * @param searchParams 
 * @returns 
 */
export const useConversationMessages = (accessCode: string, searchParams: z.infer<typeof ConversationMessagesQuerySchema>) => {
  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', accessCode, searchParams],
    queryFn: async () => {
      return getConversationMessages(searchParams, { headers: { Authorization: `Bearer ${accessCode}` } })
    }
  })
  return { messages, isLoadingMessages }
}
/**
 * 发送消息反馈
 * @param accessCode 
 * @param searchParams 
 * @returns 
 */
export const useessageFeedbacks = (accessCode: string, searchParams: z.infer<typeof MessageFeedbacksSchema>) => {
  const { data: feedback, isLoading: isLoadingFeedback } = useQuery({
    queryKey: ['feedback', accessCode, searchParams],
    queryFn: async () => {
      return messageFeedbacks(searchParams, { headers: { Authorization: `Bearer ${accessCode}` } })
    }
  })
  return { feedback, isLoadingFeedback }
}