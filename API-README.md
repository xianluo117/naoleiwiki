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
