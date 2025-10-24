import { useContext } from "react"
import { ApplicationContext } from "../providers/application"
import { AppParamsResponse } from "../service-calls"
import z from "zod"





export const useApplication = () => {
  return useContext(ApplicationContext)
}



/**
 * 通过使用应用运行时参数, 生成智能体初始化表单校验对象
 * @returns 
 * 智能体初始化表单校验对象
 * TODO: 等待完善
 */
export const useConversationFormSchema = () => {
  const { appParams, isLoadingAppParams } = useApplication()
  if (isLoadingAppParams) return null

  return z.object({})
}