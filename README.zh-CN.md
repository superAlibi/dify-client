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

### Peer Dependencies

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

## 📚 文档

详细的 API 文档请参考 [核心包 README](./core/README.md)。

## 🏗️ 项目结构

这是一个使用 pnpm workspace 的 monorepo 项目：

```
dify-client/
├── core/              # 核心库包 (dify-terminal)
│   ├── src/          # 源代码
│   └── dist/         # 构建输出
├── examples/         # 示例应用
│   └── dify-client-app/  # React 示例应用
└── package.json      # 根 package.json
```

## 🔧 开发

```bash
# 安装依赖
pnpm install

# 构建核心包
cd core
pnpm build

# 开发模式（监听文件变化）
pnpm dev
```

## 📝 示例

查看 `examples/dify-client-app/` 目录中的示例应用，了解如何在实际的 React 应用中使用本库。

## 🚀 发布

### 创建发布 Tag

要发布新版本到 npm，需要创建并推送 Git tag：

```bash
# 方法 1: 使用提供的脚本（推荐）
./scripts/create-release-tag.sh 1.0.0-alpha.2

# 方法 2: 手动使用 Git 命令
git tag -a v1.0.0-alpha.2 -m "Release version 1.0.0-alpha.2"
git push origin v1.0.0-alpha.2
```

**重要提示：**
- Tag 格式必须为 `v<version>`（例如：`v1.0.0-alpha.2`）
- Tag 中的版本号必须与 `core/package.json` 中的版本号完全匹配
- 推送 tag 会自动触发 GitHub Actions 发布工作流

详细的 tag 标记说明请参考 [TAGGING.md](.github/TAGGING.md)。

## 📄 许可证

[MIT](./LICENSE)

## 🤝 贡献

欢迎贡献代码！请随时提交 Issue 和 Pull Request。

## 📮 联系方式

如有问题或建议，请通过 Issue 联系我们。

## 🔗 相关链接

- [Dify 官方网站](https://dify.ai/)
- [GitHub 仓库](https://github.com/superAlibi/dify-client)

