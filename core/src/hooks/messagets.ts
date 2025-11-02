import { useQuery } from "@tanstack/react-query"
import { ConversationMessagesQuerySchema, getConversationMessages, messageFeedbacks, MessageFeedbacksSchema } from "../service-calls"
import z from "zod"
import { Options } from "ky"

/**
 * 获取会话消息
 * @param accessCode 
 * @param searchParams 
 * @returns 
 */
export const useConversationMessages = (searchParams: z.infer<typeof ConversationMessagesQuerySchema>, optionis: Options) => {
  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', optionis, searchParams],
    queryFn: async () => {
      return getConversationMessages(searchParams, optionis)
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
export const useessageFeedbacks = (searchParams: z.infer<typeof MessageFeedbacksSchema>, optionis: Options) => {
  const { data: feedback, isLoading: isLoadingFeedback } = useQuery({
    queryKey: ['feedback', optionis, searchParams],
    queryFn: async () => {
      return messageFeedbacks(searchParams, optionis)
    }
  })
  return { feedback, isLoadingFeedback }
}