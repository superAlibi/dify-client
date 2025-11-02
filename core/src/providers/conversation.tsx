import z from "zod"
import { ConversationHistoryResponse, ConversationsQuerySchema } from "../service-calls"
import { Options } from "ky"
import React, { createContext, FC, PropsWithChildren, useCallback } from "react"
import { ConversationContext, useConversations } from "../hooks"
import { QueryClient, QueryClientProvider, QueryObserverResult, RefetchOptions } from "@tanstack/react-query"

export interface ConversationProviderProps {
  searchParams: z.infer<typeof ConversationsQuerySchema>
  reqOptions: Options | ((accessToken: string) => Options)
}

const ConversationProviderContent: FC<PropsWithChildren<ConversationProviderProps>> = ({ children, ...ops }) => {
  const { searchParams, reqOptions } = ops
  const { conversations, refreshConversations, isLoadingConversations } = useConversations({ searchParams, reqOptions })
  const refresh = useCallback(async (options?: RefetchOptions) => {
    await refreshConversations(options)
  }, [refreshConversations])
  return <ConversationContext.Provider value={{ conversations, refresh, isLoadingConversations }}>
    {children}
  </ConversationContext.Provider>
}

const qc = new QueryClient()
export const ConversationProvider: FC<PropsWithChildren<ConversationProviderProps>> = ({ children, ...ops }) => {
  return <QueryClientProvider client={qc}>
    <ConversationProviderContent {...ops}>
      {children}
    </ConversationProviderContent>
  </QueryClientProvider>
}