# Git Tag 标记指南

本文档说明如何在 GitHub 发布时创建和推送 Git Tag。

## 📋 前置条件

1. 确保已安装 Git
2. 确保代码已提交并推送到远程仓库
3. 确保 `core/package.json` 中的版本号已更新

## 🏷️ 创建 Tag 的方法

### 方法 1: 使用 Git 命令（推荐）

#### 步骤 1: 更新版本号

在创建 tag 之前，确保 `core/package.json` 中的版本号已更新：

```bash
# 编辑 core/package.json，更新 version 字段
# 例如：从 "1.0.0-alpha.1" 更新到 "1.0.0-alpha.2"
```

#### 步骤 2: 提交版本变更

```bash
git add core/package.json
git commit -m "chore: bump version to 1.0.0-alpha.2"
git push
```

#### 步骤 3: 创建并推送 Tag

```bash
# 创建带注释的 tag（推荐）
git tag -a v1.0.0-alpha.2 -m "Release version 1.0.0-alpha.2"

# 或者创建轻量级 tag
git tag v1.0.0-alpha.2

# 推送 tag 到远程仓库
git push origin v1.0.0-alpha.2

# 或者推送所有 tag
git push origin --tags
```

### 方法 2: 使用 GitHub Web 界面

1. 访问 GitHub 仓库页面
2. 点击右侧的 "Releases" 或直接访问 `https://github.com/your-username/dify-terminal/releases`
3. 点击 "Create a new release"
4. 选择或创建新的 tag（格式：`v1.0.0-alpha.2`）
5. 填写 Release 标题和描述
6. 点击 "Publish release"

### 方法 3: 使用脚本自动化（推荐用于 CI/CD）

创建一个脚本来自动化 tag 创建流程：

```bash
#!/bin/bash
# scripts/create-release-tag.sh

VERSION=$1
if [ -z "$VERSION" ]; then
  echo "Usage: ./scripts/create-release-tag.sh <version>"
  echo "Example: ./scripts/create-release-tag.sh 1.0.0-alpha.2"
  exit 1
fi

TAG="v${VERSION}"

# 检查 tag 是否已存在
if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Error: Tag $TAG already exists"
  exit 1
fi

# 创建 tag
git tag -a "$TAG" -m "Release version $VERSION"

# 推送 tag
git push origin "$TAG"

echo "Tag $TAG created and pushed successfully"
```

## 📝 Tag 命名规范

- **格式**: `v<version>`
- **示例**: 
  - `v1.0.0` - 正式版本（发布到 npm `latest` 标签）
  - `v1.0.0-alpha.1` - Alpha 版本（发布到 npm `alpha` 标签）
  - `v1.0.0-beta.1` - Beta 版本（发布到 npm `beta` 标签）
  - `v1.0.0-rc.1` - 候选版本（发布到 npm `rc` 标签）

### NPM Tag 自动分配

GitHub Actions workflow 会根据 tag 中的版本标识自动分配 npm 标签：

- **包含 `alpha`** → 发布到 `alpha` 标签
  - 安装: `pnpm add dify-terminal@alpha` 或 `pnpm add dify-terminal@1.0.0-alpha.1`
- **包含 `beta`** → 发布到 `beta` 标签
  - 安装: `pnpm add dify-terminal@beta` 或 `pnpm add dify-terminal@1.0.0-beta.1`
- **包含 `rc`** → 发布到 `rc` 标签
  - 安装: `pnpm add dify-terminal@rc` 或 `pnpm add dify-terminal@1.0.0-rc.1`
- **稳定版本** → 发布到 `latest` 标签（默认）
  - 安装: `pnpm add dify-terminal` 或 `pnpm add dify-terminal@latest`

## ⚠️ 重要注意事项

1. **版本号必须匹配**: Tag 中的版本号（去掉 `v` 前缀）必须与 `core/package.json` 中的 `version` 字段完全匹配
2. **Tag 格式**: Tag 必须以 `v` 开头，例如 `v1.0.0-alpha.1`
3. **推送 Tag 会触发发布**: 一旦推送以 `v*` 开头的 tag，GitHub Actions 会自动触发发布流程
4. **不要删除已发布的 Tag**: 删除已发布的 tag 可能会导致问题

## 🔄 发布流程

当您推送 tag 后，GitHub Actions 会自动：

1. ✅ 检出代码
2. ✅ 安装依赖（使用 pnpm）
3. ✅ 构建核心包
4. ✅ 运行测试
5. ✅ 验证版本号匹配
6. ✅ 检测版本类型（alpha/beta/rc/stable）
7. ✅ 发布到 npm（自动使用对应的 npm tag）

### NPM Tag 自动分配逻辑

Workflow 会根据 tag 版本自动选择 npm 发布标签：

- `v1.0.0-alpha.*` → `pnpm publish --tag alpha`
- `v1.0.0-beta.*` → `pnpm publish --tag beta`
- `v1.0.0-rc.*` → `pnpm publish --tag rc`
- `v1.0.0` → `pnpm publish`（默认 latest 标签）

这样可以让用户通过不同的标签安装不同稳定性的版本。

## 🐛 常见问题

### Q: Tag 推送后没有触发发布？

A: 检查以下几点：
- Tag 是否以 `v` 开头
- GitHub Actions 是否已启用
- 工作流文件是否在 `.github/workflows/` 目录下
- 是否有权限推送到仓库

### Q: 如何查看所有 tag？

```bash
git tag -l
git tag -l "v*"  # 查看所有以 v 开头的 tag
```

### Q: 如何删除本地 tag？

```bash
git tag -d v1.0.0-alpha.2
```

### Q: 如何删除远程 tag？

```bash
git push origin --delete v1.0.0-alpha.2
```

⚠️ **警告**: 如果 tag 已经触发发布，删除它不会撤销发布。

### Q: 如何更新已存在的 tag？

```bash
# 删除旧 tag
git tag -d v1.0.0-alpha.2
git push origin --delete v1.0.0-alpha.2

# 创建新 tag
git tag -a v1.0.0-alpha.2 -m "Release version 1.0.0-alpha.2"
git push origin v1.0.0-alpha.2
```

## 📚 相关资源

- [Git Tag 文档](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
- [GitHub Releases 文档](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [Semantic Versioning](https://semver.org/)

