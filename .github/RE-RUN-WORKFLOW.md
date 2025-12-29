# 重新运行 GitHub Actions Workflow 指南

## 方法 1: 删除并重新推送现有 Tag（推荐）

如果之前已经推送过 tag，可以删除并重新推送：

```bash
# 1. 删除远程 tag
git push origin --delete v1.0.0-alpha.2

# 2. 删除本地 tag（可选）
git tag -d v1.0.0-alpha.2

# 3. 重新创建并推送 tag
git tag -a v1.0.0-alpha.2 -m "Release version 1.0.0-alpha.2"
git push origin v1.0.0-alpha.2
```

## 方法 2: 创建新的 Tag

创建一个新的版本 tag：

```bash
# 使用脚本（推荐）
./scripts/create-release-tag.sh 1.0.0-alpha.3

# 或手动创建
git tag -a v1.0.0-alpha.3 -m "Release version 1.0.0-alpha.3"
git push origin v1.0.0-alpha.3
```

⚠️ **注意**: 创建新 tag 前，记得先更新 `core/package.json` 中的版本号！

## 方法 3: 在 GitHub UI 上重新运行

1. 访问 GitHub 仓库页面
2. 点击 "Actions" 标签
3. 找到之前失败的 workflow 运行
4. 点击右上角的 "Re-run jobs" 或 "Re-run failed jobs" 按钮

⚠️ **注意**: 这个方法可能不适用于 tag 触发的 workflow，因为 GitHub 可能不允许重新运行 tag 触发的 workflow。

## 方法 4: 使用 GitHub CLI（如果已安装）

```bash
# 重新运行失败的 workflow
gh run rerun <run-id>

# 查看 workflow 运行列表
gh run list --workflow=publish.yml
```

## 推荐流程

对于修复 workflow 配置后的情况，推荐使用方法 1：

```bash
# 1. 确保 workflow 文件已提交
git add .github/workflows/publish.yml
git commit -m "fix: update pnpm setup in workflow"
git push

# 2. 删除并重新推送 tag
git push origin --delete v1.0.0-alpha.2
git tag -d v1.0.0-alpha.2
git tag -a v1.0.0-alpha.2 -m "Release version 1.0.0-alpha.2"
git push origin v1.0.0-alpha.2
```

