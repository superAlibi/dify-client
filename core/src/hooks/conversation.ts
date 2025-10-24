import {
  getConversations as getConversationsApi,
  getConversationVariables,

  ConversationsQuerySchema,
  ConversationVariableSchema,
} from '../service-calls'
import { useQuery } from '@tanstack/react-query'
import z from 'zod'
import { useApplication } from './application'
import { Options } from 'ky'


interface UseConversationsProps {
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
  const { accessToken, isLoadingToken } = useApplication()
  const { data: conversations, isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations', searchParams],
    enabled: () => !!accessToken && !isLoadingToken,
    queryFn: async () => {
      const options = typeof reqOptions === 'function' ? reqOptions(accessToken!) : reqOptions
      return getConversationsApi(searchParams, options ?? {})
    }
  })
  return { conversations, isLoadingConversations }
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
  const { data: variables, isLoading: isLoadingVariables } = useQuery({
    queryKey: ['variables', searchParams],
    enabled: () => !!accessToken && !isLoadingToken,
    queryFn: async () => {
      const options = typeof reqOptions === 'function' ? reqOptions(accessToken!) : reqOptions
      return getConversationVariables(searchParams, options)
    }
  })
  return { variables, isLoadingVariables }
}