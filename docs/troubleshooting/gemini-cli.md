# 🔧 Gemini — CLI2api 报错对照表

本页面收录使用 Gemini CLI2api 反代时的常见报错及解决方案。

---

## 基本知识

Gemini CLI2api（简称 CLI 反代或 CLI）是通过转发请求至 Gemini CLI 工具来使用 Gemini 模型的方式。

目前类脑有一个 CLI 公益站，让用户方便地获取并上传凭证，免去了本地或服务器部署的步骤：
- 🔗 [CLI 公益站](https://discord.com/channels/1134557553011998840/1410747429359325214)

---

## 报错对照

### Precondition Check Failed

**现象**：`precondition check failed`

**原因**：凭证文件无效，可能是未在 Google Cloud 启用必需的 API，或者启用后没有成功同步

**解决**：
1. 再次检查是否正确启用报错信息中提示的 API
2. 通过本地部署谷歌的 CLI 服务来验证账号
3. 都不行的话需要更换谷歌账号

---

### 500 Internal Server Error

**现象**：`500 Internal Server Error`

**原因**：网络问题

**解决**：更换代理软件的节点设置，开启 TUN 模式

---

### 403 Forbidden / 401 Unauthorized

**现象**：
- `403 Forbidden` / `you must be named after...` / `your account is not eligible...`
- `401 unauthorized`

**原因**：账号验证失败，可能是已被封禁或者未在 Google Cloud 启用必需的 API。很可能是账号被谷歌风控导致

**解决**：
1. 登录账号查看是否被要求启用两步验证
2. 若无法启用，则只能更换账号
3. 对于 `you must be named after...` 的情况，已找到复活方法，详见 CLI 公益站帖子

---

## 其他常见问题

### Q：怎么在本地或服务器部署 CLI 反代？

**A**：
- **PC 本地部署**：参考 [CLI 部署教程](https://discord.com/channels/1134557553011998840/1405524233823457300)
- **手机部署**：参考 [手机 CLI 教程](https://discord.com/channels/1134557553011998840/1407111716713660426)
- 若觉得本地部署麻烦，可直接使用 [CLI 公益站](https://discord.com/channels/1134557553011998840/1410747429359325214)

---

::: info 📖 相关阅读
- [Gemini AI Studio API 报错](./gemini-api.md)
- [Gemini Build2api 报错](./gemini-build.md)
- [报错对照表总览](./)
:::
