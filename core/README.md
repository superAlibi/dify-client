# Dify Client

一个为 [Dify](https://dify.ai/) 项目创建的客户端工具库，提供了完整的 React Provider 组件和 API 调用函数，帮助开发者快速集成 Dify 聊天功能到自己的应用中。

## ✨ 特性

- 🎯 **完整的 React Provider 支持** - 提供应用配置、会话管理和消息处理等 Provider
- 🔌 **类型安全的 API 调用** - 基于 TypeScript，提供完整的类型定义
- 🎨 **UI 库无关** - 核心功能与 UI 库解耦，可与任何 UI 库结合使用
- 📦 **开箱即用** - 内置 Token 管理、表单验证、SSE 流处理等功能
- 🔄 **事件驱动** - 基于事件总线的消息流处理机制
- ✅ **表单验证** - 集成 Zod 进行运行时参数验证

## 📦 安装

```bash
npm install dify-terminal
# 或
pnpm add dify-terminal
# 或
yarn add dify-terminal
```

###  peerDependencies

本包需要以下 peer dependencies：

- `react` >= 19.2.0
- `@tanstack/react-query` >= 5.90.2
- `@reactuses/core` >= 6.1.0

## 🚀 快速开始

### 1. 配置 API 基础 URL

首先，需要配置 Dify API 的基础 URL：

```typescript
import { resetService } from 'dify-terminal'

// 配置 API 基础 URL
resetService({
  prefixUrl: 'https://api.dify.ai/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 2. 使用 Provider

在你的应用根组件中，按照层级顺序使用 Provider：

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { 
  AppParamsProvider, 
  ConversationProvider, 
  MessageProvider 
} from 'dify-terminal'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppParamsProvider appCode="your-app-code">
        <ConversationProvider>
          <MessageProvider>
            {/* 你的应用组件 */}
          </MessageProvider>
        </ConversationProvider>
      </AppParamsProvider>
    </QueryClientProvider>
  )
}
```

### 3. 使用 Hooks

在组件中使用提供的 hooks：

```tsx
import { useApplication, useConversation } from 'dify-terminal'

function ChatComponent() {
  const { accessToken, appParams } = useApplication()
  const { conversations } = useConversation()
  
  // 使用数据...
}
```

## 📚 API 文档

### React Providers

#### AppParamsProvider (ParamsProvider)

提供应用的全局配置，包括：

- ✅ 自动请求和缓存 Token
- ✅ 表单配置（运行时参数）
- ✅ 应用文件信息限制
- ✅ 自动请求 passport (token/auth)
- ✅ Meta 信息
- ✅ Site 信息

**Props:**

```typescript
interface AppParamsProviderProps {
  appCode: string  // Dify 应用代码
  children: React.ReactNode
}
```

**使用示例:**

```tsx
<AppParamsProvider appCode="your-app-code">
  {children}
</AppParamsProvider>
```

#### ConversationProvider

在 `AppParamsProvider` 完成 token 获取后，自动发起会话相关信息：

- ✅ 会话历史列表
- ✅ 上一次智能体的会话 ID
- ✅ 表单功能（开发中）

**使用示例:**

```tsx
<ConversationProvider>
  {children}
</ConversationProvider>
```

#### MessageProvider

最复杂的组件，提供消息相关处理逻辑和信息：

- ✅ 监听消息发送事件，获取表单 schema (Zod)，验证表单完整性
- ✅ 发送消息并监听 SSE 流，解析文本并存储文本信息
- ✅ 触发 SSE 对应的事件类型到事件总线
- ✅ 监听中断 SSE 事件，立即中断 SSE 流

**使用示例:**

```tsx
<MessageProvider>
  {children}
</MessageProvider>
```

### Provider 层级关系

```
AppParamsProvider (提供 token 和应用配置)
  └── ConversationProvider (提供会话管理)
      └── MessageProvider (提供消息处理)
```

信息流传递：

```
AppParamsProvider 
  └─> token & 会话上下文 & 表单配置 & 智能体配置
      └─> ConversationProvider 
          └─> 会话历史列表 & 表单输入管理
              └─> MessageProvider
                  └─> 消息列表 & 消息发送 & 消息展示
```

> 💡 提示：以上信息流传递中可以替换任意一个提供环节，以提供自定义的功能。

### Hooks

#### useApplication

获取应用配置相关的上下文信息：

```typescript
const {
  appCode,
  accessMode,
  isLoadingAccessMode,
  accessToken,
  isLoadingToken,
  appParams,
  isLoadingAppParams,
  siteInfo,
  isLoadingSiteInfo,
  metaInfo,
  isLoadingMetaInfo,
  emitter,  // 事件总线
} = useApplication()
```

#### useConversation

获取会话相关的上下文信息：

```typescript
const {
  conversations,
  refresh,
  isLoadingConversations,
} = useConversation()
```

#### useConversations

获取会话历史列表：

```typescript
import { useConversations } from 'dify-terminal'

const { 
  conversations, 
  refreshConversations, 
  isLoadingConversations 
} = useConversations({
  searchParams: {
    limit: 20,
    sort_by: 'updated_at',
  },
  reqOptions: (accessToken) => ({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }),
})
```

#### useConversationVariables

获取会话变量：

```typescript
import { useConversationVariables } from 'dify-terminal'

const { 
  variables, 
  refreshConversationVariables, 
  isLoadingVariables 
} = useConversationVariables({
  searchParams: {
    conversation_id: 'xxx',
  },
  reqOptions: (accessToken) => ({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }),
})
```

### API 函数

#### 应用相关

##### resetService

重置 HTTP 服务配置（基于 ky）：

```typescript
import { resetService } from 'dify-terminal'

resetService({
  prefixUrl: 'https://api.dify.ai/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})
```

##### getAppAccessMode

获取应用的访问模式：

```typescript
import { getAppAccessMode } from 'dify-terminal'

const accessMode = await getAppAccessMode('your-app-code')
```

##### getAppAccessToken

获取访问令牌：

```typescript
import { getAppAccessToken } from 'dify-terminal'

const tokenResponse = await getAppAccessToken('your-app-code', {
  headers: {
    'x-app-code': 'your-app-code',
  },
})
```

##### getAppRuntimeParameters

获取运行时参数（包括表单配置、文件上传限制等）：

```typescript
import { getAppRuntimeParameters } from 'dify-terminal'

const params = await getAppRuntimeParameters({
  headers: {
    Authorization: 'Bearer your-token',
  },
})
```

##### getAppSiteinfo

获取站点信息（应用的 UI 配置）：

```typescript
import { getAppSiteinfo } from 'dify-terminal'

const siteInfo = await getAppSiteinfo({
  headers: {
    Authorization: 'Bearer your-token',
  },
})
```

##### getAppMeta

获取应用的 Meta 信息：

```typescript
import { getAppMeta } from 'dify-terminal'

const meta = await getAppMeta({
  headers: {
    Authorization: 'Bearer your-token',
  },
})
```

#### 会话相关

##### getConversations

获取会话历史列表：

```typescript
import { getConversations } from 'dify-terminal'

const conversations = await getConversations(
  {
    limit: 20,
    sort_by: 'updated_at',
  },
  {
    headers: {
      Authorization: 'Bearer your-token',
    },
  }
)
```

##### getConversationMessages

通过会话 ID 获取会话的所有消息：

```typescript
import { getConversationMessages } from 'dify-terminal'

const messages = await getConversationMessages(
  {
    conversation_id: 'xxx',
    limit: 20,
  },
  {
    headers: {
      Authorization: 'Bearer your-token',
    },
  }
)
```

##### deleteConversation

删除指定会话：

```typescript
import { deleteConversation } from 'dify-terminal'

await deleteConversation(
  {
    conversation_id: 'xxx',
  },
  {
    headers: {
      Authorization: 'Bearer your-token',
    },
  }
)
```

##### setConversationTitle

设置或生成会话标题：

```typescript
import { setConversationTitle } from 'dify-terminal'

// 手动设置标题
await setConversationTitle(
  {
    conversation_id: 'xxx',
    name: '新标题',
  },
  {
    headers: {
      Authorization: 'Bearer your-token',
    },
  }
)

// 自动生成标题
await setConversationTitle(
  {
    conversation_id: 'xxx',
    auto_generate: true,
  },
  {
    headers: {
      Authorization: 'Bearer your-token',
    },
  }
)
```

##### getConversationVariables

获取会话变量信息：

```typescript
import { getConversationVariables } from 'dify-terminal'

const variables = await getConversationVariables(
  {
    conversation_id: 'xxx',
  },
  {
    headers: {
      Authorization: 'Bearer your-token',
    },
  }
)
```

#### 消息相关

##### sendMessage

发送消息（支持 SSE 流）：

```typescript
import { sendMessage } from 'dify-terminal'

const response = await sendMessage({
  json: {
    inputs: {},
    query: '你好',
    conversation_id: 'xxx',
    user: 'default',
  },
  headers: {
    Authorization: 'Bearer your-token',
  },
})

// 处理 SSE 流
const reader = response.body?.getReader()
// ... 处理流数据
```

##### sendMessageFeedback

发送消息反馈（点赞/点踩）：

```typescript
import { sendMessageFeedback } from 'dify-terminal'

await sendMessageFeedback(
  {
    message_id: 'xxx',
    rating: 'like',  // 或 'dislike'
  },
  {
    headers: {
      Authorization: 'Bearer your-token',
    },
  }
)
```

##### messageFeedbacks

获取所有消息的反馈信息：

```typescript
import { messageFeedbacks } from 'dify-terminal'

const feedbacks = await messageFeedbacks(
  {
    page: 1,
    limit: 20,
  },
  {
    headers: {
      Authorization: 'Bearer your-token',
    },
  }
)
```

#### 文件相关

##### uploadFile

上传文件：

```typescript
import { uploadFile } from 'dify-terminal'

const fileResponse = await uploadFile(
  {
    file: fileObject,  // File 对象
    user: 'default',
  },
  {
    headers: {
      Authorization: 'Bearer your-token',
    },
  }
)
```

##### previewFile

预览文件：

```typescript
import { previewFile } from 'dify-terminal'

const fileBuffer = await previewFile(
  {
    file_id: 'xxx',
    as_attachment: false,
  },
  {
    headers: {
      Authorization: 'Bearer your-token',
    },
  }
)
```

#### 语音相关

##### audioToText

语音转文字：

```typescript
import { audioToText } from 'dify-terminal'

const textResponse = await audioToText(
  {
    file: audioFile,  // File 对象，最大 15MB
    user: 'default',
  },
  {
    headers: {
      Authorization: 'Bearer your-token',
    },
  }
)
```

##### textToAudio

文字转语音：

```typescript
import { textToAudio } from 'dify-terminal'

const audioResponse = await textToAudio(
  {
    text: '要转换的文字',
    user: 'default',
  },
  {
    headers: {
      Authorization: 'Bearer your-token',
    },
  }
)
```

## 🎯 事件系统

本包使用事件总线（mitt）来处理各种事件。可以通过 `useApplication` hook 获取 `emitter` 来监听或触发事件。

### 监听事件

```typescript
import { useApplication } from 'dify-terminal'
import { useEffect } from 'react'

function MyComponent() {
  const { emitter } = useApplication()
  
  useEffect(() => {
    const handler = (data) => {
      console.log('收到消息:', data)
    }
    
    emitter?.on('message', handler)
    
    return () => {
      emitter?.off('message', handler)
    }
  }, [emitter])
}
```

### 触发事件

```typescript
import { useApplication } from 'dify-terminal'

function MyComponent() {
  const { emitter } = useApplication()
  
  const handleClick = () => {
    emitter?.emit('conversations-refresh')
  }
}
```

## 📝 类型定义

所有类型定义都通过 TypeScript 导出，你可以直接导入使用：

```typescript
import type {
  AppParamsResponse,
  ConversationHistoryResponse,
  MessageResponse,
  // ... 更多类型
} from 'dify-terminal'
```

## 🔧 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 开发模式（监听文件变化）
pnpm dev
```

## 📄 许可证

[MIT](./LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

如有问题或建议，请通过 Issue 联系我们。
