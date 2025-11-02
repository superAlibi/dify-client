import { useEffect, useRef, type FC } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Send } from "lucide-react"
import { useApplication } from "dify-client"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const buttonVariants = cva(
  ' flex items-center max-h-50'

)

interface QueryInputProps extends VariantProps<typeof buttonVariants> {
  className?: string
}

export const QueryInput: FC<QueryInputProps> = (props) => {
  const { className, ...rest } = props
  const { emitter } = useApplication()
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    emitter.on('send-message', () => {
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    })
  }, [emitter])
  return <div className={cn(buttonVariants({ className }))}>
    <Input ref={inputRef} name='message' placeholder='想和我聊些什么...' />
    <Button type='submit'><Send />发送</Button>
  </div>
}