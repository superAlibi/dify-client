import { QueryInput } from '@/components/query-input'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ConversationMessageContext, MessageProvider, useApplication } from 'dify-client'
import { Loader2 } from 'lucide-react'
import { useContext, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'


export const Route = createFileRoute('/(chat)/chat/')({
  component: RouteComponent,
})

function ChatPage() {
  const { messages } = useContext(ConversationMessageContext)
  const { isLoadingToken, appCode, emitter } = useApplication()
  useEffect(() => {

    emitter.on('conversations-loaded', (conversations) => {
      console.log(conversations)
    })
    emitter.on('app-token-loaded', (token) => {
      console.log(token)
    })
    emitter.on('app-params-loaded', (params) => {
      console.log(params)
    })
    emitter.on('app-siteinfo-loaded', (siteInfo) => {
      console.log(siteInfo)
    })
    emitter.on('app-meta-loaded', (meta) => {
      console.log(meta)
    })

    return () => {
      emitter.off('conversations-loaded')
      emitter.off('app-token-loaded')
      emitter.off('app-params-loaded')
      emitter.off('app-siteinfo-loaded')
      emitter.off('app-meta-loaded')
    }
  }, [emitter])


  return <div className='@container relative h-screen w-full overflow-y-auto'>
    <form
      className='h-full'
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()

        const formData = new FormData(e.target as HTMLFormElement)
        const message = formData.get('message') as string
        emitter.emit('send-message', message)
      }}>
      <div className='h-full overflow-y-auto pb-20'>
        {
          messages.map((item) => {
            return <ul key={item.id}>
              <div className="chat chat-end">
                <div className="chat-bubble">
                  {item.query}
                </div>
              </div>
              {item.answer
                ?
                <div className="chat chat-start">
                  <div className="chat-bubble">
                    <ReactMarkdown>{item.answer}</ReactMarkdown>
                  </div>
                </div>
                :
                <Loader2 className='w-4 h-4 animate-spin text-gray-500' />
              }
            </ul>
          })
        }
      </div>
      <QueryInput className='absolute bottom-5 left-10 right-10' />
    </form>
  </div>
}




function RouteComponent() {
  const { appCode, emitter } = useApplication()
  const navigate = useNavigate()
  useEffect(() => {
    emitter.on('message-end', (message) => {
      console.log(message)
      navigate({
        to: '/chat/$conversationId',
        params: {
          conversationId: message.conversation_id
        },
      })
    })
    return () => {
      emitter.off('message-end')
    }
  }, [emitter, navigate])
  return <MessageProvider


    reqOptions={(access_token) => ({
      headers: {
        'x-app-code': appCode!,
        'x-app-passport': access_token!
      }
    })}
  >
    <ChatPage />
  </MessageProvider>
}