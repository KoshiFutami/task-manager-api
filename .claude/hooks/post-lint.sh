#!/bin/bash

# ESLint を実行して修正
if [[ "$CLAUDE_MODIFIED_FILES" == *".ts"* ]]; then
  cd "$CLAUDE_PROJECT_DIR"
  npm run lint 2>/dev/null || true
fi
