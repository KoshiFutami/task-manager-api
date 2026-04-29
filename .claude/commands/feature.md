# feature

新機能開発のための feature ブランチを作成・管理する。

## ワークフロー

```bash
# 1. 作業ブランチを作成
git checkout -b feature/機能名

# 2. 実装・テスト
npm run test
npm run format && npm run lint

# 3. コミット（日本語）
git add -A
git commit -m "feat: 新機能の説明（日本語）"

# 4. プッシュ
git push origin feature/機能名

# 5. GitHub で PR 作成
# → レビュー → マージ
```

## ブランチ命名規則

- `feature/タスク名` — 新機能・拡張
- `fix/バグ名` — バグ修正
- `chore/作業内容` — ドキュメント・設定変更

## コミットメッセージ形式

```
<type>: <description>

<optional body>
```

**type の例:**
- `feat:` — 新機能
- `fix:` — バグ修正
- `test:` — テスト追加
- `docs:` — ドキュメント
- `chore:` — 設定・ツール変更
- `style:` — フォーマット・コメント

**例:**
```
feat: タスク削除エンドポイントを実装
test: update メソッドのテストを追加
docs: README を更新
```

## PR 作成

```bash
gh pr create --title "feat: 説明" --body "詳細"
```

## マージ前の確認

- [ ] テストがパスしている
- [ ] カバレッジ 80% 以上
- [ ] コード品質チェック OK
- [ ] ドキュメント更新
