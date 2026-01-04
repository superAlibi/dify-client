#!/bin/bash
# Script to create and push a release tag
# Usage: ./scripts/create-release-tag.sh <version>
# Example: ./scripts/create-release-tag.sh 1.0.0-alpha.2

set -e

VERSION=$1
if [ -z "$VERSION" ]; then
  echo "❌ Error: Version is required"
  echo ""
  echo "Usage: ./scripts/create-release-tag.sh <version>"
  echo "Example: ./scripts/create-release-tag.sh 1.0.0-alpha.2"
  exit 1
fi

# Validate version format (basic check)
if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.-]+)?$ ]]; then
  echo "❌ Error: Invalid version format: $VERSION"
  echo "Expected format: X.Y.Z or X.Y.Z-prerelease"
  echo "Example: 1.0.0 or 1.0.0-alpha.1"
  exit 1
fi

TAG="v${VERSION}"

# Check if package.json version matches
PACKAGE_VERSION=$(node -p "require('./core/package.json').version")
if [ "$PACKAGE_VERSION" != "$VERSION" ]; then
  echo "❌ Error: Version mismatch!"
  echo "  Tag version: $VERSION"
  echo "  Package version: $PACKAGE_VERSION"
  echo ""
  echo "Please update core/package.json version to match the tag version."
  exit 1
fi

# Check if tag already exists locally
if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "⚠️  Warning: Tag $TAG already exists locally"
  read -p "Do you want to delete and recreate it? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git tag -d "$TAG" || true
  else
    echo "Aborted."
    exit 1
  fi
fi

# Check if tag exists on remote
if git ls-remote --tags origin "$TAG" | grep -q "$TAG"; then
  echo "❌ Error: Tag $TAG already exists on remote"
  echo "If you want to update it, delete it first:"
  echo "  git push origin --delete $TAG"
  exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "⚠️  Warning: You have uncommitted changes"
  read -p "Do you want to continue? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
fi

# Create tag
echo "📝 Creating tag: $TAG"
git tag -a "$TAG" -m "Release version $VERSION"

# Push tag
echo "🚀 Pushing tag to remote..."
git push origin "$TAG"

echo ""
echo "✅ Success! Tag $TAG has been created and pushed."
echo "📦 GitHub Actions will automatically publish the package to npm."
echo ""
echo "You can view the release at:"
echo "  https://github.com/superAlibi/dify-terminal/releases/tag/$TAG"

