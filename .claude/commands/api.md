# api

API エンドポイントを curl でテストする。

## エンドポイント一覧

### タスク一覧取得

```bash
curl http://localhost:3000/api/tasks
```

### タスク作成

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新規タスク",
    "description": "タスク説明"
  }'
```

### タスク更新

```bash
curl -X PATCH http://localhost:3000/api/tasks/uuid-1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新後タイトル"
  }'
```

### タスク削除

```bash
curl -X DELETE http://localhost:3000/api/tasks/uuid-1
```

## バリデーション テスト

### 不正なタイプ（エラー期待）

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": 123,
    "description": "テスト"
  }'
```

**期待結果:** 400 Bad Request

```json
{
  "message": ["title must be a string"],
  "error": "Bad Request",
  "statusCode": 400
}
```

## 開発時の確認事項

- [ ] レスポンスのステータスコードが正しい
- [ ] 返り値が TaskResponseDto の形式か
- [ ] タイムスタンプが日本時間（JST）か
- [ ] バリデーション エラーが返される
