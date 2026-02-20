# 📁 SillyTavern 文件结构

了解 SillyTavern 的目录结构有助于你快速定位配置文件、聊天记录和备份数据。

::: tip 💡 备份提示
备份时只需复制 `data` 文件夹即可保存所有个人数据。
:::

---

## 目录树

```
SillyTavern/
├── data/                          # 主要数据存储处（备份此文件夹即可）
│   ├── default-user/              # 默认用户目录（多用户模式下为其他用户名）
│   │   ├── backgrounds/           # 酒馆背景图片
│   │   ├── backups/               # 备份文件（仅包括设置和聊天记录）
│   │   ├── characters/            # 角色卡文件
│   │   ├── chats/                 # 聊天记录文件
│   │   ├── extensions/            # 第三方扩展
│   │   ├── OpenAI Settings/       # 预设文件
│   │   ├── reasoning/             # 推理自动解析设置
│   │   ├── user/                  # 用户角色信息
│   │   ├── worlds/                # 世界书
│   │   ├── settings.json          # 用户设置和正则文件
│   │   └── secrets.json          # 保存的 API 密钥等
│   └── 其他文件                    # 系统相关，一般无需关注
│
├── public/                        # 公共文件
│   └── scripts/
│       └── extensions/
│           └── third-party/       # 第三方扩展（旧版路径）
│
├── config.yaml                    # 常用配置（代理、端口等）
├── Start.bat                      # 启动 SillyTavern（Windows）
└── UpdateAndStart.bat             # 更新并启动 SillyTavern（Windows）
```

---

## 关键文件说明

### `data/default-user/`

这是你的所有个人数据所在位置。如果启用了多用户模式，文件夹名会变为对应的用户名。

| 子目录/文件        | 说明                                                   |
| ------------------ | ------------------------------------------------------ |
| `characters/`      | 存放所有导入的角色卡（`.png` 文件）                    |
| `chats/`           | 每个角色卡有独立子文件夹，内含 `.jsonl` 格式的聊天记录 |
| `worlds/`          | 世界书文件                                             |
| `OpenAI Settings/` | 预设文件（`.json` 格式）                               |
| `extensions/`      | 通过扩展管理器安装的第三方扩展                         |
| `backups/`         | 自动备份的设置和聊天记录                               |
| `settings.json`    | 所有用户设置、正则表达式配置                           |
| `secrets.json`     | 存储的 API Key 等敏感信息                              |

### `config.yaml`

全局配置文件，常见修改项：

- **代理设置**：`requestProxy` — 设置 `enabled: true` 并填写代理地址
- **端口号**：默认 `8000`
- **懒加载**：`lazyLoadCharacters` — 设为 `true` 可加速启动

### `public/scripts/extensions/third-party/`

旧版酒馆中第三方扩展的安装路径。新版酒馆已迁移至 `data/default-user/extensions/`。

---

::: info 📖 相关阅读

- [更新与备份迁移](./update-backup.md) — 如何备份和迁移数据
- [聊天记录丢失找回](/faq/st-usage#聊天记录丢失了-怎么找回) — 通过 `backups/` 文件夹恢复
:::
