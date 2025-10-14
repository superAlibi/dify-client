import mitt from 'mitt'
import { useCallback, useEffect, useMemo } from 'react'

/**
 * 创建一个事件发射器 hook，在组件卸载时自动清理所有监听器
 * @template T 事件类型映射
 * @returns mitt 事件发射器实例
 * 
 * @example
 * ```tsx
 * type Events = {
 *   userLogin: { userId: string }
 *   messageReceived: { content: string }
 * }
 * 
 * const MyComponent = () => {
 *   const emitter = useEmit<Events>()
 *   
 *   useEffect(() => {
 *     emitter.on('userLogin', (data) => console.log(data.userId))
 *   }, [emitter])
 *   
 *   return <button onClick={() => emitter.emit('userLogin', { userId: '123' })}>Login</button>
 * }
 * ```
 */
export const useEmit = <T extends Record<string, any>>() => {
  const emitter = useMemo(() => mitt<T>(), [])

  useEffect(() => {
    return () => {
      emitter.all.clear()
    }
  }, [emitter])
  // 扩展：提供便捷的订阅方法，自动管理清理
  const useListener = useCallback(<K extends keyof T>(
    event: K,
    handler: (data: T[K]) => void
  ) => {
    useEffect(() => {
      emitter.on(event, handler as any)
      return () => emitter.off(event, handler as any)
    }, [event, handler])
  }, [emitter])
  return { emitter, useListener }
}
