# API 使用说明

本文档描述当前可用的公开 API 接口与使用方式。

## 搜索接口

- 路径：`GET /api/search`
- 说明：对全站内容进行搜索，默认隐藏 `/works/` 下的结果。

### 查询参数

| 参数           | 类型     | 默认值 | 说明                         |
| -------------- | -------- | ------ | ---------------------------- |
| `q`            | string   | 必填   | 搜索关键词                   |
| `limit`        | number   | `20`   | 返回条数上限，最大 `50`      |
| `includeWorks` | `"1"`/空 | 空     | 传 `1` 时包含 `/works/` 结果 |

### 返回结果

返回 JSON：

```json
{
  "results": [
    {
      "title": "标题",
      "url": "完整 URL",
      "snippet": "标题路径摘要"
    }
  ]
}
```

### 示例

```
GET /api/search?q=酒馆&limit=10
```

```
GET /api/search?q=墨墨&includeWorks=1
```

## 注意事项

- 搜索索引由构建阶段生成，文件为 `/local-search-index.json`。
- 若未执行构建流程，接口可能无法返回结果。

## Discord 机器人接口（构建者文档）

用于注册 Slash 命令与接收交互回调，建议在 Cloudflare Workers/Pages Functions 内部署。详细配置步骤请参考仓库根目录 [DISCORD-BOT.md](./DISCORD-BOT.md)。

### 注册命令

- 路径：`POST /api/discord/commands`
- 说明：注册全局 Slash 命令 `/wenti-sousuo`（中文显示名：问题搜索）。
- 需要环境变量：
  - `DISCORD_BOT_TOKEN`
  - `DISCORD_APP_ID`

### 交互回调

- 路径：`POST /api/discord/interactions`
- 说明：Discord 交互回调入口，校验签名并执行搜索。
- 需要环境变量：
  - `DISCORD_PUBLIC_KEY`

### 命令说明

- 命令名：`/wenti-sousuo`
- 中文显示名：`问题搜索`
- 参数：`关键词`（字符串，必填）
- 返回：标题 + 链接 + 摘要（最多 5 条），结果默认隐藏 `/works/` 内容。
