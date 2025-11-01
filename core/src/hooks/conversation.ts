import {
  getConversations as getConversationsApi,
  getConversationVariables,

  ConversationsQuerySchema,
  ConversationVariableSchema,
  ConversationHistoryResponse,
} from '../service-calls'
import { RefetchOptions, useQuery } from '@tanstack/react-query'
import z from 'zod'
import { useApplication } from './application'
import { Options } from 'ky'
import { createContext, useContext, useEffect } from 'react'


export interface UseConversationsProps {
  searchParams: z.infer<typeof ConversationsQuerySchema>
  reqOptions: Options | ((accessToken: string) => Options)
}

/**
 * 获取会话历史列表
 * @param accessCode 
 * @param searchParams 
 * @returns 
 */
export const useConversations = ({ reqOptions, searchParams }: UseConversationsProps) => {
  const { accessToken, isLoadingToken, emitter } = useApplication()
  const { data: conversations, refetch, isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations', searchParams],
    enabled: () => !!accessToken && !isLoadingToken,
    queryFn: async () => {
      const options = typeof reqOptions === 'function' ? reqOptions(accessToken!) : reqOptions
      return getConversationsApi(searchParams, options ?? {})
    }
  })
  useEffect(() => {
    if (emitter) {
      emitter.on('conversations-refresh', () => refetch())
    }
    return () => {
      emitter?.off('conversations-refresh')
    }
  }, [emitter])


  useEffect(() => {
    if (emitter && conversations) {
      emitter.emit('conversations-loaded', conversations)
    }
  }, [conversations, emitter])
  return { conversations, refreshConversations: refetch, isLoadingConversations }
}



interface UseConversationVariablesProps {
  searchParams: z.infer<typeof ConversationVariableSchema>
  reqOptions: Options | ((accessToken: string) => Options)
}

/**
 * 获取会话变量
 * @param accessCode 
 * @param searchParams 
 * @returns 
 */
export const useConversationVariables = ({ reqOptions, searchParams }: UseConversationVariablesProps) => {
  const { accessToken, isLoadingToken } = useApplication()
  const { data: variables, refetch, isLoading: isLoadingVariables } = useQuery({
    queryKey: ['variables', searchParams],
    enabled: () => !!accessToken && !isLoadingToken,
    queryFn: async () => {
      const options = typeof reqOptions === 'function' ? reqOptions(accessToken!) : reqOptions
      return getConversationVariables(searchParams, options)
    }
  })
  return { variables, refreshConversationVariables: refetch, isLoadingVariables }
}




export interface ConversationContextType {
  conversations?: ConversationHistoryResponse
  refresh: (params: RefetchOptions) => Promise<void>
  isLoadingConversations: boolean
}
export const ConversationContext = createContext<ConversationContextType>({
  isLoadingConversations: false,
  refresh: () => Promise.resolve()

})


export const useConversation = () => {
  return useContext(ConversationContext)
}