import { QueryInput } from '@/components/query-input'
import ReactMarkdown from 'react-markdown'
import { createFileRoute } from '@tanstack/react-router'
import { ConversationMessageContext, MessageProvider, useApplication } from 'dify-client'
import { useContext } from 'react'
import { Loader2 } from 'lucide-react'
export const Route = createFileRoute('/(chat)/chat/$conversationId')({
  component: RouteComponent

})

function ChatPage() {
  const { emitter } = useApplication()
  const { messages, messageInitialLoading } = useContext(ConversationMessageContext)
  return <div className='@container  h-screen w-full p-4'>
    {messageInitialLoading ? <Loader2 className='w-4 h-4 animate-spin text-gray-500' /> : null}
    <form
      className='relative h-full overflow-hidden'
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
  const { conversationId } = Route.useParams()
  const { appCode, } = useApplication()

  return <MessageProvider
    conversationId={conversationId}
    onError={error => {
      console.error('发送消息错误', error)
    }}
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
