import {
  getConversations as getConversationsApi,
  getConversationVariables,

  ConversationsQuerySchema,
  ConversationVariableSchema,
} from '../service-calls'
import { useQuery } from '@tanstack/react-query'
import z from 'zod'
import { useApplication } from './application'


interface UseConversationsProps {
  searchParams: z.infer<typeof ConversationsQuerySchema>
  authKey: (accessToken: string) => [string, string]
}

/**
 * 获取会话历史列表
 * @param accessCode 
 * @param searchParams 
 * @returns 
 */
export const useConversations = ({ authKey, searchParams }: UseConversationsProps) => {
  const { accessToken, isLoadingToken } = useApplication()
  const { data: conversations, isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations', searchParams],
    enabled: () => !!accessToken && !isLoadingToken,
    queryFn: async () => {
      const [key, value] = authKey(accessToken!)
      return getConversationsApi(searchParams, { headers: { [key]: value } })
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