import React, { createContext, FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import {
  type AppParamsResponse,
  AccessModeResponse,
  AccessMode,
  AppSiteInfoResponse,
  AppMetaResponse,
  getAppRuntimeParameters,
  getAppAccessToken,
  resetService,
  getAppAccessMode,
  getAppSiteinfo,
  getAppMeta,
} from '../service-calls'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useLocalStorage } from '@reactuses/core'
import { produce } from 'immer'
import mitt, { Emitter, EventType } from 'mitt'
import { Options } from 'ky'

export interface AppEvents extends Record<EventType, any> {
  'app-access-mode-loaded': AccessModeResponse
  'app-token-loaded': string
  'app-params-loaded': AppParamsResponse
  'app-siteinfo-loaded': AppSiteInfoResponse
  'app-meta-loaded': AppMetaResponse
  "send-message": string
  "send-message-success": string
  "send-message-error": string
  "send-message-loading": boolean
  "send-message-complete": boolean
  "send-message-cancel": boolean
  "send-message-pause": boolean
  "send-message-resume": boolean
  "send-message-stop": boolean
}


export interface ApplicationConfig {
  accessMode?: AccessMode
  isLoadingAccessMode: boolean

  accessToken?: string
  isLoadingToken: boolean

  appParams?: AppParamsResponse
  isLoadingAppParams: boolean

  siteInfo?: AppSiteInfoResponse
  isLoadingSiteInfo: boolean


  metaInfo?: AppMetaResponse
  isLoadingMetaInfo: boolean

  emitter?: Emitter<AppEvents>
}

export interface AppTokenMap {
  [key: string]: string
}

export const ApplicationContext = createContext<ApplicationConfig>({
  isLoadingToken: false,
  isLoadingAppParams: true,
  isLoadingAccessMode: true,
  isLoadingSiteInfo: true,
  isLoadingMetaInfo: true,

})




export interface ParamsProviderProps {
  appCode: string
  authKey: (accessToken: string) => [string, string]
  getAccessMode: () => Promise<AccessModeResponse>
  getPassport: () => Promise<string>
  getAppConfig: (accessToken: string) => Promise<AppParamsResponse>
  getSiteInfo: (accessToken: string) => Promise<AppSiteInfoResponse>
  getMetaInfo: (accessToken: string) => Promise<AppMetaResponse>
}
export const ParamsProvider: FC<PropsWithChildren<ParamsProviderProps>> = ({ children, ...ops }) => {
  const { appCode, getPassport, getAccessMode, getAppConfig, getSiteInfo, getMetaInfo } = ops

  const emitter = mitt<AppEvents>()
  useEffect(() => {
    return () => {
      emitter.all.clear()
    }
  }, [emitter])
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
    queryFn: getAccessMode
  })





  /**
   * TODO: 找机会改掉这个代码, 太长了, 且无法适应ssr
   */
  const [tokens, setTokens] = useLocalStorage<AppTokenMap>('accessToken', localStorage.getItem('accessToken') ? JSON.parse(localStorage.getItem('accessToken')!) : {})
  /**
   * 假设没有传入getAppConfig函数
   * 则需要自行获取token
   * 否则认为getAppConfig已经自己获得了token
   */
  const { data: token = tokens?.[appCode], isLoading: isLoadingToken } = useQuery({
    queryKey: ['app-token', appCode],
    enabled: () => !!appCode && !tokens?.[appCode],
    queryFn: async () => {
      if (tokens?.[appCode]) {
        return tokens?.[appCode]
      }
      debugger
      // debugger
      // const token = await getPassport()
      // setTokens(produce((prev) => ({ ...prev, [appCode]: token })))
      // return token
    }
  })

  /**
   * 监听token变化
   * 如果token变化, 则更新tokens到本地存储
   */
  useEffect(() => {

    if (!token) {
      const newTokens = Object.fromEntries(Object.entries(tokens || {}).filter(([k]) => k !== appCode))
      // setTokens(newTokens)
    } else {
      setTokens(produce((prev) => ({ ...prev, [appCode]: token })))
    }
  }, [token, appCode])
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
  const { data: appParams, isLoading: isLoadingAppParams } = useQuery<AppParamsResponse>({
    queryKey: ['app-params', appCode, tokens?.[appCode] ?? token],
    enabled: () => !!appCode && (!!(tokens?.[appCode] || token)),
    queryFn: () => getAppConfig(tokens?.[appCode] ?? token!)
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
    enabled: () => !!appCode && !!(tokens?.[appCode] || token),
    queryFn: () => getSiteInfo(tokens?.[appCode] ?? token!)
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
    enabled: () => !!appCode && !!(tokens?.[appCode] || token),
    queryFn: () => getMetaInfo(tokens?.[appCode] ?? token!)
  })

  return (
    <ApplicationContext.Provider
      value={{
        accessMode: accessModeData?.accessMode,
        isLoadingAccessMode,

        accessToken: tokens?.[appCode] ?? token,
        isLoadingToken,

        appParams,
        isLoadingAppParams,

        siteInfo,
        isLoadingSiteInfo,

        metaInfo,
        isLoadingMetaInfo,

        emitter
      }}>
      {children}
    </ApplicationContext.Provider>
  )
}







type IgnoreParamsProviderProps = Omit<ParamsProviderProps, 'getPassport' | 'getAccessMode' | 'getAppConfig' | 'getSiteInfo' | 'getMetaInfo' | 'authKey'>

interface AppParamsProviderProps extends IgnoreParamsProviderProps {
  /**
   * 给出访问应用的访问模式
   * 不需要token
   * @returns 
   */
  getAccessMode?: () => Promise<AccessModeResponse>
  /**
   * 给出访问应用的token
   * 需要appCode
   * @returns 
   */
  getPassport?: () => Promise<string>
  /**
   * 给出应用的运行时参数
   * 需要token
   * @returns 
   */
  getAppConfig?: () => Promise<AppParamsResponse>
  /**
   * 给出应用的站点信息
   * 需要token
   * @returns 
   */
  getSiteInfo?: () => Promise<AppSiteInfoResponse>
  /**
   * 给出应用的元信息
   * 需要token
   * @returns 
   */
  getMetaInfo?: () => Promise<AppMetaResponse>
  /**
   * 给出请求头中的认证key
   * 需要accessToken
   * @returns 
   */
  authKey?: (accessToken: string) => [string, string]

  serverOptions?: Options | (() => Options)
}
const qc = new QueryClient()
export const AppParamsProvider: FC<PropsWithChildren<AppParamsProviderProps>> = (props) => {
  const {
    children,
    appCode,
    getPassport: defaultGetPassport,
    getAccessMode: defaultGetAccessMode,
    getAppConfig: defaultGetAppConfig,
    getSiteInfo: defaultGetSiteInfo,
    getMetaInfo: defaultGetMetaInfo,
    serverOptions,
    authKey = (accessToken: string) => ['Authorization', 'Bearer ' + accessToken],
  } = props
  useEffect(() => {
    if (!serverOptions) return void 0
    if (typeof serverOptions === 'function') {
      resetService(serverOptions())
    } else {
      resetService(serverOptions)
    }
  }, [serverOptions])
  const getAccessMode = useCallback(() => {
    return defaultGetAccessMode?.() ?? getAppAccessMode(appCode)
  }, [defaultGetAccessMode])
  const getPassport = useCallback(async () => {
    if (defaultGetPassport) return defaultGetPassport()
    return getAppAccessToken(appCode).then(res => res.access_token)
  }, [defaultGetPassport])

  const getAppConfig = useCallback((accessToken: string) => {
    if (defaultGetAppConfig) return defaultGetAppConfig()
    const [key, value] = authKey(accessToken)
    return getAppRuntimeParameters({ headers: { [key]: value } })
  }, [defaultGetAppConfig])
  const getSiteInfo = useCallback((accessToken: string) => {
    if (defaultGetSiteInfo) return defaultGetSiteInfo()
    const [key, value] = authKey(accessToken)

    return getAppSiteinfo({ headers: { [key]: value } })
  }, [defaultGetSiteInfo])
  const getMetaInfo = useCallback((accessToken: string) => {
    if (defaultGetMetaInfo) return defaultGetMetaInfo()
    const [key, value] = authKey(accessToken)
    return getAppMeta({ headers: { [key]: value } })
  }, [defaultGetMetaInfo])

  return (
    <QueryClientProvider client={qc}>
      <ParamsProvider
        appCode={appCode}
        getAccessMode={getAccessMode}
        getPassport={getPassport}
        authKey={authKey}
        getAppConfig={getAppConfig}
        getSiteInfo={getSiteInfo}
        getMetaInfo={getMetaInfo}
      >
        {children}
      </ParamsProvider>
    </QueryClientProvider>
  )

}
