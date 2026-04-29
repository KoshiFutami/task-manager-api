# docker

ローカル開発環境を Docker で管理する。

## 基本コマンド

```bash
# 起動
docker compose up -d

# 停止
docker compose down

# ログ確認
docker compose logs app
docker compose logs app -f    # リアルタイム

# 再起動
docker compose restart app
```

## トラブルシューティング

### ポートが使用中の場合

```bash
# プロセス確認
lsof -i :3000
lsof -i :3306

# 強制停止
docker compose down -v
```

### DB データをリセット

```bash
docker compose down -v        # ボリュームごと削除
docker compose up -d          # 再起動（初期化状態）
```

### コンテナに入る

```bash
# app コンテナ
docker exec -it task-manager-api-app-1 sh

# DB コンテナ
docker exec -it task-manager-api-db-1 mysql -u nestuser -p
```

## 環境変数

`docker-compose.yml` の環境変数を確認：

```yaml
DB_HOST: db
DB_PORT: 3306
DB_USER: nestuser
DB_PASSWORD: nestpassword
DB_NAME: task_manager
TZ: 'Asia/Tokyo'
```
