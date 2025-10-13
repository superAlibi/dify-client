import { createContext, FC, PropsWithChildren, useEffect } from 'react'
import {
  type AppParamsResponse,
  getAppRuntimeParameters,
  getAppAccessToken,
  getAppAccessMode,
  AccessModeResponse,
  AccessMode,
  getAppSiteinfo,
  AppSiteInfoResponse,
  AppMetaResponse,
  getAppMeta
} from './service-calls'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useLocalStorage } from '@reactuses/core'
import { produce } from 'immer'

export interface ApplicationConfig {
  accessMode?: AccessMode
  isLoadingAccessMode: boolean

  accessToken?: string
  isLoadingToken: boolean

  appParams?: AppParamsResponse
  isLoading: boolean

  siteInfo?: AppSiteInfoResponse
  isLoadingSiteInfo: boolean


  metaInfo?: AppMetaResponse
  isLoadingMetaInfo: boolean

}

export interface AppTokenMap {
  [key: string]: string
}

const ApplicationContext = createContext<ApplicationConfig>({
  isLoadingToken: false,
  isLoading: true,
  isLoadingAccessMode: true,
  isLoadingSiteInfo: true,
  isLoadingMetaInfo: true,
})





export interface AppCodeApplication {
  appCode: string
  getAccessMode?: (appCode: string) => Promise<AccessModeResponse>
  getAppConfig?: (appCode: string) => Promise<AppParamsResponse>
  getSiteInfo?: (appCode: string) => Promise<AppSiteInfoResponse>
  getMetaInfo?: (appCode: string) => Promise<AppMetaResponse>
}
export const ParamsProvider: FC<PropsWithChildren<AppCodeApplication>> = ({ children, ...ops }) => {
  const { appCode, getAccessMode, getAppConfig, getSiteInfo, getMetaInfo } = ops

  /**
   * 假设没有传入getAccessMode函数
   * 则需要自行获取访问模式
   * 否则认为getAccessMode已经自己获得了访问模式
   * 访问模式主要有两种:
   * 1. public 公开模式, 任何人都可以访问
   */
  const { data: accessModeData, isLoading: isLoadingAccessMode } = useQuery({
    queryKey: ['app-access-mode', appCode],
    enabled: () => !!getAccessMode || !!appCode,
    queryFn: async () => {
      return getAccessMode ? getAccessMode(appCode) : getAppAccessMode(appCode)
    }
  })





  const [tokens, setTokens] = useLocalStorage<AppTokenMap>('accessToken', {})
  /**
   * 假设没有传入getAppConfig函数
   * 则需要自行获取token
   * 否则认为getAppConfig已经自己获得了token
   */
  const { data: token, isLoading: isLoadingToken } = useQuery({
    queryKey: ['app-token', appCode],
    enabled: () => !getAppConfig && !!appCode && !tokens?.[appCode],
    queryFn: async () => {
      const token = await getAppAccessToken(appCode)
      return token?.access_token
    }
  })
  useEffect(() => {
    if (!appCode || getAppConfig) { return }
    if (!token) {
      const newTokens = Object.fromEntries(Object.entries(tokens || {}).filter(([k]) => k !== appCode))
      setTokens(newTokens)
    } else {
      setTokens(produce((prev) => ({ ...prev, [appCode]: token })))
    }
  }, [token, appCode, setTokens, tokens])
  /**
   * 获取应用的运行时参数
   * 包括聊天初始化表单
   * 文件上传参数等
   * 需要传入token
   * token的优先级为:
   * 1. tokens[appCode] 本地存储的token
   * 2. token 查询到的token
   * 如果没有token, 则认为应用是公开的, 可以直接访问
   * 如果有token, 则需要在请求头中加入 Authorization: Bearer {token}
   * 如果传入了getAppConfig函数, 则认为已经自己获取了应用的运行时参数
   * 否则自行获取应用的运行时参数
   * 注意: 只有在accessMode是public的时候才需要token
   * 否则认为应用是公开的, 可以直接访问
   */
  const { data: appParams, isLoading } = useQuery<AppParamsResponse>({
    queryKey: ['app-params', appCode, tokens?.[appCode] ?? token],
    enabled: () => !!getAppConfig || !!appCode && !!(tokens?.[appCode] || token),
    queryFn: async () => {
      return getAppConfig ? getAppConfig(appCode) : getAppRuntimeParameters({ headers: { Authorization: `Bearer ${tokens?.[appCode] ?? token}` } })
    }
  })



  /**
   * 获取应用的站点信息
   * 包括聊天界面的配色等
   * 需要传入token
   * token的优先级为:
   * 1. tokens[appCode] 本地存储的token
   * 2. token 查询到的token
   * 如果没有token, 则认为应用是公开的, 可以直接访问
   * 如果有token, 则需要在请求头中加入 Authorization: Bearer {token}
   * 
   * 没什么屌用
   */
  const { data: siteInfo, isLoading: isLoadingSiteInfo } = useQuery({
    queryKey: ['app-siteinfo', appCode, tokens?.[appCode] ?? token],
    enabled: () => !!getSiteInfo || !!appCode && !!(tokens?.[appCode] || token),
    queryFn: async () => {
      return getSiteInfo ? getSiteInfo(appCode) : getAppSiteinfo({ headers: { Authorization: `Bearer ${tokens?.[appCode] ?? token}` } })
    }
  })


  /**
   * 获取应用的元信息
   * 似乎没什么卵用
   * 也需要token
   * token的优先级为:
   * 1. tokens[appCode] 本地存储的token
   * 2. token 查询到的token
   */
  const { data: metaInfo, isLoading: isLoadingMetaInfo } = useQuery({
    queryKey: ['app-meta', appCode, tokens?.[appCode] ?? token],
    enabled: () => !!getMetaInfo || !!appCode && !!(tokens?.[appCode] || token),
    queryFn: async () => {
      return getMetaInfo ? getMetaInfo(appCode) : getAppMeta({ headers: { Authorization: `Bearer ${tokens?.[appCode] ?? token}` } })
    }
  })

  return (
    <ApplicationContext.Provider
      value={{
        accessMode: accessModeData?.accessMode,
        isLoadingAccessMode,

        accessToken: tokens?.[appCode] ?? token,
        isLoadingToken,

        appParams,
        isLoading,

        siteInfo,
        isLoadingSiteInfo,

        metaInfo,
        isLoadingMetaInfo
      }}>
      {children}
    </ApplicationContext.Provider>
  )
}









const qc = new QueryClient()
export const AppParamsProvider: FC<PropsWithChildren<AppCodeApplication>> = ({ children, ...ops }) => {
  if (!ops.appCode && !ops.getAppConfig) {
    throw new Error('AppParamsProvider requires appCode or getAppConfig')
  }
  return (
    <QueryClientProvider client={qc}>
      <ParamsProvider {...ops}>
        {children}
      </ParamsProvider>
    </QueryClientProvider>
  )

}
