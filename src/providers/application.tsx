import { createContext, FC } from 'react'
import { AppParamsResponse } from './service-calls/app-params'

interface BaseApplicationConfig {

}

/**
 * 基于 API Key 的应用配置
 */
interface ApiKeyApplication extends BaseApplicationConfig {
  apiKey?: string
  getAppConfig?: (apiKey: string) => Promise<AppParamsResponse>
}

/**
 * 基于 App Code 的应用配置
 */
interface AppCodeApplication extends BaseApplicationConfig {
  appCode?: string
  getAppConfig?: (appCode: string) => Promise<AppParamsResponse>
}

export type Application = ApiKeyApplication | AppCodeApplication



const ApplicationContext = createContext<Application>({})

export const AppParamsProvider: FC<Application> = () => {


  return <ApplicationContext.Provider value={{}}>
    {/* Your application components go here */}
  </ApplicationContext.Provider>

}
