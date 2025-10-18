import mitt, { Emitter } from 'mitt'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useApplication } from './application'
import { AppEvents } from '../providers/application'


// 扩展：提供便捷的订阅方法，自动管理清理
export const useListener = <EK extends keyof AppEvents>(event: EK, handler: (data: AppEvents[EK]) => void,) => {
  const callBack = useRef(handler)
  const { emitter } = useApplication()
  useEffect(() => {
    callBack.current = handler
    if (!emitter) {
      return
    }
    emitter.on(event, callBack.current)
    return () => emitter.off(event, callBack.current)

  }, [event, handler, emitter])
}