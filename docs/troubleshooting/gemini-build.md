# 🏗️ Gemini — Build2api 报错对照表

本页面收录使用 AI Studio Build2api 反代时的常见报错及解决方案。

---

## 基础信息

AI Studio Build2api 反代（也叫 AI Studio 反代、Build 反代，简称 Build）让免费用户也能使用 Pro 系列模型 API。

::: warning ⚠️ 使用要求
- Build 反代的报错信息可能在 SillyTavern 终端、本地反代服务器终端、AI Studio Build 页面等地方出现
- 使用期间需保持 Build 网页和 Build 后台在 **同一个设备** 上（比如手机部署就都在手机上打开，电脑就都在电脑上打开）
- Build 后台不能被系统限制活动
:::

目前最新最好用的 Build 反代本地部署应用：
- 🔗 [Build 反代应用](https://discord.com/channels/1134557553011998840/1440552338824757280)

以下报错对照仅针对该应用。

---

## 报错对照

### Request Entity Not Found

**现象**：`request entity not found`

**原因**：没有输入正确的模型名字，如大小写或符号错误等

**解决**：检查并修正模型名称

---

### Internal Server Error / Permission Denied / XHR Error / Not Found

**现象**：`internal server error`、`permission denied`、`xhr error`、`not found`

**原因**：网络相关的概率问题

**解决**：刷新 Build 网页

---

### 429 — 每日请求上限

**现象**：`429`，提示已达到此模型的每日请求上限

**原因**：超出每日配额

**解决**：在 Build 页面换一个谷歌账号

---

### 输入秒空回

**现象**：输入后秒空回，但显示回复已完成

**原因**：输入截断

**解决**：查看酒馆终端，如果有关键词 `blockReason:`，则为输入截断，解决方法同 [AI Studio API 渠道的输入截断](./gemini-api.md#非流空回-输入截断)

---

### WebSocket 错误

**现象**：网页不断提示「WebSocket 发生错误」「WebSocket 连接断开」

**原因**：服务器插件没有成功启动

**解决**：重新安装 Build 反代

---

### 400 错误

**现象**：`400` 错误

**原因**：插头（连接设置）里填了不该填的内容

**解决**：在插头里「反向代理 - 代理密码」处，**什么都不要填**

---

### 无法选择 3.0 Pro / 无法发图

**现象**：模型选不了 3.0 Pro，或者用了自定义模型插件能选了，但是不能给 3.0 Pro 发图

**解决**：打开 Build 反代的「请求重定向」功能，然后模型选 2.5 Pro，反代会自动把请求转换成给 3.0 Pro 的

---

::: info 📖 相关阅读
- [Gemini AI Studio API 报错](./gemini-api.md)
- [Gemini CLI2api 报错](./gemini-cli.md)
- [报错对照表总览](./)
:::
