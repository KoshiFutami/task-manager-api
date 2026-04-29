# Task Manager API — Claude Code ガイド

## プロジェクト概要

NestJS + TypeORM + MySQL のタスク管理 API。ローカル開発は Docker で実行。

| 項目 | 技術 |
|------|------|
| フレームワーク | NestJS |
| 言語 | TypeScript |
| ORM | TypeORM |
| DB | MySQL 8.0 |
| テスト | Jest |

## 開発ワークフロー

### 1. 新機能実装時

```bash
git checkout -b feature/機能名
# 実装作業
npm run test -- 対象ファイル
git commit -m "feat: 説明（日本語）"
git push origin feature/機能名
```

### 2. テスト実行

```bash
npm run test              # 全テスト
npm run test:watch       # Watch モード
npm run test:cov         # カバレッジ
```

### 3. コード品質

```bash
npm run format           # Prettier 自動フォーマット
npm run lint             # ESLint 実行・修正
```

## 重要なルール

1. **コミットメッセージは日本語** — 機能実装・テスト・設定変更など
2. **テスト作成 → 実装 → コミット** — テストが通っていない実装は完了とみなさない
3. **feature ブランチを使う** — main には直接コミットしない
4. **PR 作成 → レビュー → マージ** — GitHub Actions で CI/CD 実行

## Docker

```bash
# 起動
docker compose up -d

# コンテナ確認
docker compose logs app

# DB アクセス
docker exec -it task-manager-api-db-1 mysql -u nestuser -p
```

## CI/CD

GitHub Actions で以下を自動実行：

- `format.yml` — Prettier 自動フォーマット
- `test.yml` — Jest テスト実行・カバレッジ

## ファイル構成

```
src/
├── main.ts              # エントリーポイント
├── app.module.ts        # ルート Module
└── tasks/
    ├── dto/             # Data Transfer Objects
    ├── entities/        # TypeORM entities
    ├── tasks.controller.ts
    ├── tasks.service.ts
    └── *.spec.ts        # テストファイル
```
