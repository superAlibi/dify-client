import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'

import { Link } from '@tanstack/react-router'
import { AppParamsProvider, ConversationProvider, useApplication, useConversation, useConversations } from 'dify-client'

import { ClipboardType, Loader, MessagesSquare, Plus, } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'









export const Route = createFileRoute('/(chat)')({
  component: RouteComponent,
})
function Asider() {

  const navigate = useNavigate()

  const { conversations, isLoadingConversations, refresh } = useConversation()
  /**
   * 到新建会话页面
   */
  const handleToNewConversation = useCallback(() => {
    navigate({
      to: '/chat'
    })
  }, [])

  return (
    <aside
      className={cn(
        'h-screen w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col  ',
        // 如果正在加载会话历史，则隐藏侧边栏
        !isLoadingConversations && !!conversations?.data.length ? 'translate-x-0' : 'absolute -translate-x-full'
      )}
    >

      <nav className="flex-1 p-4 overflow-y-auto">
        {
          !conversations?.data.length &&
          <div className="flex  h-full  flex-col items-center justify-center flex-1">
            <span className="text-sm text-gray-400">暂无会话历史</span>
            {/* <Button onClick={() => refreshConversations()} variant="outline">
                刷新
              </Button> */}
          </div>
        }
        <Button className="w-full mb-2" onClick={handleToNewConversation}>
          <Plus size={20} />
          <span className="font-medium">新建会话</span>
        </Button>
        {conversations?.data.map((conversation) => (
          <Link
            to="/chat/$conversationId"
            params={{
              conversationId: conversation.id ?? '',
            }}
            key={conversation.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
            }}
          >
            <MessagesSquare size={20} />
            <span className="font-medium">{conversation.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}


function Main() {
  // const { isLoadingConversations, conversations } = useConversation()
  return <div className="flex min-h-screen">
    <Asider />
    <main className={cn(
      "flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 text-white",
      /* !isLoadingConversations && !!conversations?.data.length && "ml-80" */)}>
      <Outlet />
    </main>
  </div>
}

function RouteComponent() {
  const appCode = 'ooxElfBsYDL8COih'
  const reqOptions = useCallback((accessToken: string) => ({
    headers: {
      'x-app-code': appCode,
      'x-app-passport': accessToken
    }
  }), [appCode])
  return <AppParamsProvider
    appCode={appCode}
    reqOptions={reqOptions}
  >
    <ConversationProvider
      searchParams={{
        limit: 100,
      }}
      reqOptions={reqOptions}
    >
      <Main />
    </ConversationProvider>
  </AppParamsProvider>
}
