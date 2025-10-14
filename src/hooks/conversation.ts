import {
  getConversationMessages,
  getConversations as getConversationsApi,
  setConversationTitle,
  getConversationVariables,
  sendMessageFeedback,
  type ConversationMessageMetaItem,
  type ConversationHistoryItem,
  type ConversationVariableItem,
  type MessageFeedBackInfo,
  AppParamsResponse,
  ConversationsQuerySchema,
  ConversationHistoryResponse,
  SortBy,
  ConversationMessagesQuerySchema,
  ConversationVariableSchema,
  SendMessageFeedbackSchema,
} from '../service-calls'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { createContext, FC, PropsWithChildren, ReactNode, useState } from 'react'
import z from 'zod'


/**
 * 获取会话历史列表
 * @param accessCode 
 * @param searchParams 
 * @returns 
 */
export const useConversations = (accessCode: string, searchParams: z.infer<typeof ConversationsQuerySchema>) => {
  const { data: conversations, isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations', accessCode, searchParams],
    queryFn: async () => {
      return getConversationsApi(searchParams, { headers: { Authorization: `Bearer ${accessCode}` } })
    }
  })
  return { conversations, isLoadingConversations }
}



/**
 * 获取会话变量
 * @param accessCode 
 * @param searchParams 
 * @returns 
 */
export const useConversationVariables = (accessCode: string, searchParams: z.infer<typeof ConversationVariableSchema>) => {
  const { data: variables, isLoading: isLoadingVariables } = useQuery({
    queryKey: ['variables', accessCode, searchParams],
    queryFn: async () => {
      return getConversationVariables(searchParams, { headers: { Authorization: `Bearer ${accessCode}` } })
    }
  })
  return { variables, isLoadingVariables }
}