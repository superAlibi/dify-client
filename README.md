# Dify Client

A client utility library for the [Dify](https://dify.ai/) project, providing complete React Provider components and API call functions to help developers quickly integrate Dify chat functionality into their applications.

## ✨ Features

- 🎯 **Complete React Provider Support** - Provides Providers for application configuration, conversation management, and message handling
- 🔌 **Type-Safe API Calls** - Built with TypeScript, providing complete type definitions
- 🎨 **UI Library Agnostic** - Core functionality is decoupled from UI libraries and can be used with any UI library
- 📦 **Ready to Use** - Built-in token management, form validation, SSE stream processing, and more
- 🔄 **Event-Driven** - Message flow processing mechanism based on event bus
- ✅ **Form Validation** - Integrated Zod for runtime parameter validation

## 📦 Installation

```bash
npm install dify-terminal
# or
pnpm add dify-terminal
# or
yarn add dify-terminal
```

### Peer Dependencies

This package requires the following peer dependencies:

- `react` >= 19.2.0
- `@tanstack/react-query` >= 5.90.2
- `@reactuses/core` >= 6.1.0

## 🚀 Quick Start

### 1. Configure API Base URL

First, configure the base URL for the Dify API:

```typescript
import { resetService } from 'dify-terminal'

// Configure API base URL
resetService({
  prefixUrl: 'https://api.dify.ai/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 2. Use Providers

In your application root component, use Providers in the following hierarchical order:

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
            {/* Your application components */}
          </MessageProvider>
        </ConversationProvider>
      </AppParamsProvider>
    </QueryClientProvider>
  )
}
```

### 3. Use Hooks

Use the provided hooks in your components:

```tsx
import { useApplication, useConversation } from 'dify-terminal'

function ChatComponent() {
  const { accessToken, appParams } = useApplication()
  const { conversations } = useConversation()
  
  // Use the data...
}
```

## 📚 Documentation

For detailed API documentation, please refer to the [core package README](./core/README.md).

## 🏗️ Project Structure

This is a monorepo project using pnpm workspace:

```
dify-terminal/
├── core/              # Core library package (dify-terminal)
│   ├── src/          # Source code
│   └── dist/         # Build output
├── examples/         # Example applications
│   └── dify-client-app/  # Example React application
└── package.json      # Root package.json
```

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Build the core package
cd core
pnpm build

# Development mode (watch for file changes)
pnpm dev
```

## 📝 Examples

Check out the example application in the `examples/dify-client-app/` directory to see how to use this library in a real React application.

## 🚀 Publishing

### Creating a Release Tag

To publish a new version to npm, create and push a Git tag:

```bash
# Method 1: Using the provided script (recommended)
./scripts/create-release-tag.sh 1.0.0-alpha.2

# Method 2: Manual Git commands
git tag -a v1.0.0-alpha.2 -m "Release version 1.0.0-alpha.2"
git push origin v1.0.0-alpha.2
```

**Important Notes:**
- Tag format must be `v<version>` (e.g., `v1.0.0-alpha.2`)
- The version in the tag must match `core/package.json` version exactly
- Pushing a tag will automatically trigger the GitHub Actions publish workflow

For detailed tagging instructions, see [TAGGING.md](.github/TAGGING.md).

## 📄 License

[MIT](./LICENSE)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit Issues and Pull Requests.

## 📮 Contact

If you have any questions or suggestions, please contact us through Issues.

## 🔗 Links

- [Dify Official Website](https://dify.ai/)
- [GitHub Repository](https://github.com/superAlibi/dify-terminal)

