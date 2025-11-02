import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true,
    },
  ],
  tools: {
    // 配置 SWC 使用新的 JSX transform
    swc: {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
        },
        transform: {
          react: {
            runtime: 'automatic', // 使用新的 JSX runtime (React 17+)
            // 不需要显式导入 React
          },
        },
      },
    },
  },
});
