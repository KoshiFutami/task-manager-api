# pr

素早く PR を作成する。

## 最速パターン

```bash
# 1行で PR 作成
gh pr create --title "feat: 説明" --body "変更内容"
```

## テンプレート付き

```bash
# 最小限
gh pr create --title "feat: タスク削除機能" --body "削除エンドポイント実装"

# 標準テンプレート
gh pr create --title "feat: 機能説明" --body "$(cat <<'EOF'
## 概要
何を実装したか

## テスト確認
- [ ] npm run test 通過
- [ ] npm run format && npm run lint 通過
- [ ] カバレッジ 80% 以上

🤖 Generated with Claude Code
EOF
)"
```

## 実際の例

```bash
# 新機能
gh pr create --title "feat: ユーザー認証追加" --body "JWT 認証実装"

# バグ修正
gh pr create --title "fix: タスク更新のバグ" --body "null チェック追加"

# テスト追加
gh pr create --title "test: update メソッドのテスト" --body "エラーケーステスト追加"
```

## エイリアス設定（.zshrc / .bashrc）

```bash
alias pr="gh pr create --title"
```

使用：
```bash
pr "feat: 機能説明"
```

## ブラウザで確認

PR 作成後：
```bash
gh pr view --web
```
