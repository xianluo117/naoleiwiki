# 💎 Gemini — AI Studio API 报错对照表

本页面收录使用 Google AI Studio API Key 直连 Gemini 模型时的常见报错及解决方案。

---

## ETIMEDOUT

**现象**：终端出现 `ETIMEDOUT` 报错

**原因**：网络问题（常见情况是 ST 流量默认不走代理）

**解决**：

**方法一（仅 PC 用户）：开启 TUN 模式**

在代理软件设置中，找到并开启 TUN 模式（虚拟网卡模式）：

- **Clash for Windows 用户**：需同时开启「TUN 模式」和「服务模式」，并确保服务模式旁的小地球图标为绿色
- 关闭其他可能冲突的 VPN 或游戏加速器

**方法二：配置 SillyTavern 代理**

如果 TUN 模式无法成功开启：

1. 打开 SillyTavern 文件夹下的 `config.yaml` 文件
2. 找到 `requestProxy:` 条目
3. 将 `enabled: false` 修改为 `enabled: true`
4. 在 `url:` 处填写代理地址，格式为 `socks5://127.0.0.1:端口号`
   - Clash Verge 默认端口：`7897`
   - V2RayN 默认端口：`10808`
5. 保存，重启 ST

**方法三：使用反代中转**

如果本地代理方式仍不稳定，可以改用反向代理中转（例如 CLI2api / Build2api 一类方案），由中转服务代替本地直连 Google 端点。

---

## 403

**现象**：终端日志包含 `has been suspended` 等

**原因**：请求使用的 API Key 已被封禁

**解决**：更换一个来自正常项目的 API Key

---

## Not Found / Unexpected model name format

**现象**：终端日志包含 `Not Found` 或 `unexpected model name format` 关键词

**原因**：请求的模型名称填写错误，或者该模型已下架

**解决**：检查 API 设置中选择的模型名称是否完全正确（包括大小写和分隔符）

---

## Too Many Requests（类型 1）

**现象**：终端有 `Resource has been exhausted (e.g. check quota)`

**原因**：使用的代理节点或预设被谷歌标记

**解决**：

- 更换一个不同的代理节点，或者更换代理服务商
- 如果预设中有「防 429」之类的条目，启用它

---

## Too Many Requests（类型 2）

**现象**：终端提示超出了 `GenerateContentInputTokensPerModelPerMinute` 的限制

**原因**：短时间内输入的 token 太多。可能是短时间内多次请求总计输入超出；也可能是单次请求中的输入内容太长

**解决**：检查预设或提示词查看器（位于输入框左侧的魔法棒按钮里）中的总词符数，若太长，需要总结并隐藏前文

---

## Too Many Requests（类型 3）

**现象**：终端提示超出了 `GenerateRequestsPerDayPerProjectPerModel` 或 `GenerateContentInputTokensPerModelPerDay`

**原因**：当天发送的请求次数或输入的总 token 数已达到免费额度的上限

**解决**：

1. **Pro 系列模型**：更换为 Flash 模型，或使用其他渠道（如 [Gemini CLI2api](./gemini-cli.md)、[AI Studio Build2api](./gemini-build.md) 等）
2. **Flash 系列模型**：免费额度会在北京时间每日下午 4 点左右重置（冬令时）

---

## Too Many Requests（类型 4）

**现象**：终端日志提示超出的某项限额为 0

**原因**：选择了对免费用户不开放的模型（额度为 0），或者 Key 被谷歌限制（额度被降至 0）

**解决**：

- 更换模型（免费用户可用 Flash 模型）
- 更换 Key

---

## Too Many Requests（类型 5）

**现象**：终端信息中看不见超出哪项配额，也没有 `(e.g. check quota)`；在 Google Cloud 中查看 API 所属的项目，项目消失或显示 unavailable

**原因**：谷歌限制部分免费层级项目

**解决**：换号 / 等待 / 使用 CLI 或 Build 渠道的 Gemini

**相关资源**：

- 反代部署教程：[CLI 部署](https://discord.com/channels/1134557553011998840/1405524233823457300) / [Build 部署](https://discord.com/channels/1134557553011998840/1380129283430940712)
- 公益站点：[CLI 公益站](https://discord.com/channels/1134557553011998840/1410747429359325214) / [Build 公益站](https://discord.com/channels/1134557553011998840/1413552700070694953)

---

## 流式输出截断

**现象**：流式生成到一半时突然停止，没有任何报错信息，终端只有 `stream request finished`

**原因**：AI Studio API 渠道在流式输出时会实时审查内容。一旦最新生成的文字被审查认为违规，生成就会立刻中止

**解决**：

- **关闭流式输出**（推荐）
- 如果一定要使用流式输出，需要使用为此特制的预设

---

## 非流空回（输出截断）

**现象**：

- ST 网页中有 `candidate empty`、`returned no candidate` 等报错
- 终端日志关键词 `finish reason: PROHIBITED_CONTENT`

**原因**：模型输出的内容触发了安全审核机制，导致回复被拦截

**解决**：

- 在预设中开启反截断相关条目（一次只开一个）
- 直接更换一个预设
- 修改提示词：检查并修改角色卡、世界书、聊天记录等设定中的敏感内容（例如直接描述年龄小于 18 岁等）。若找不到，可以试着删除并重新生成前几条 AI 回复

---

## 非流空回（输入截断）

**现象**：发消息后很快报错 `prompt was blocked`、`blockReason:PROHIBITED_CONTENT` 等

**解决**：

- **检查插件**：一些预设会用到 NoAss 或 jsrunner 脚本等会修改预设结构的插件。如果在使用这种预设时没有正确启用插件，或者在使用不需要这种插件的预设时错误地开启了插件，会导致预设结构错误而无法破限
- 修改提示词
- 更换预设

---

## Unexpected Token

**现象**：`SyntaxError: Unexpected token`

**原因**：

- `unexpected token 'd'` 等：`d` 其实是 `data`，是流式输出块的前缀。这可能是中转服务的问题，未正确处理 API 返回内容
- `unexpected token '<'` 或 `<!DOCTYPE>` 等：使用的反向代理服务本身可能已被封禁或出现故障，返回了 HTML 错误页面

**解决**：

- 对于 `unexpected token 'd'`：如果是 Build 反代，可以尝试反代的「假流式」模式，或者使用流式传输
- 对于 `unexpected token '<'`：反代服务本身出问题，重新部署反向代理服务

---

## 503

**现象**：`503 service unavailable` 或 `overloaded`

**原因**：模型用量过大

**解决**：稍等后再试

---

## Socket Hang Up

**现象**：`reason: socket hang up`

**原因**：网络问题。若网络没有问题，就是 AI 生成回复的时间过长，超过了 ST（NodeJS）的时限

**解决**：

- 先检查网络问题
- 若确认为 AI 生成回复的时间过长，则使用支持「假流式」的反向代理（可以在类脑教程区或工具区寻找），它持续向 SillyTavern 发送空的流式包，保持连接不中断

---

## User Location Not Supported

**现象**：`user location is not supported for the api use`

**解决**：将代理节点切换到日本、新加坡、美国等地区。避免使用香港、澳门、俄罗斯及部分欧洲国家的节点。如果确认节点地区受支持但依然报错，说明该 IP 地址可能已被谷歌单独限制，换为其他节点再试

---

## 无法选择某些模型

**现象**：在 ST 内置模型列表中找不到最新模型（如 Gemini 3.0 系列等）

**原因**：ST 版本过低

**解决**：将 SillyTavern 更新到最新版本。若无法更新，可使用 SillyTavern-CustomModels 插件

---

## 回复内容重复

**现象**：多次重新生成时内容重复或高度相似；即使继续对话，AI 生成内容也有很大一部分是重复之前聊天记录的内容

**原因**：API 错误地缓存并使用了回复内容；或者上下文过长，超出了当前模型能处理的范围

**解决**：

- **针对 API 缓存**：在预设中开启「防卡缓存」或「防 429」
- **针对上下文过长**：更换模型，或对上文内容进行总结，隐藏已总结的对话楼层，以降低上下文长度（参见 [总结方法](/faq/st-usage#如何正确地总结之前的聊天记录-总结方法)）

---

## API Key Not Valid

**现象**：`API key not valid`

**解决**：仔细检查复制的 API Key 是否完整正确。如果确认 Key 没有复制错，说明该 Key 已被禁用，重新生成一个 Key 来替换

::: warning ⚠️ 备注
更换 Key 之后，需要重新点击连接按钮。
:::

---

## API Key Expired

**现象**：`API key expired. Please renew the API key`

**解决**：前往 Google AI Studio 重新创建一个新的 API Key 来替换已过期的 Key

---

## 回复中出现大量非正常内容

**现象**：回复中充满重复的标点符号、外文、或某个特定词语，而且越来越多

::: tip 💡 注意区分
需要和单纯的「回复质量差」区分。此现象的特征是异常内容会随着对话进行越来越严重。
:::

**原因**：模型因上下文超出能力范围，或者输入内容混乱（比如之前的聊天记录已经充满不正常的标点或外语）而出现「脱靶」现象，也称「增殖」

**解决**：

1. 回退到首次出现此问题的对话楼层
2. 删除该楼层及其之后的所有内容
3. 然后进行一次大总结（参见 [总结方法](/faq/st-usage#如何正确地总结之前的聊天记录-总结方法)）

::: warning ⚠️ 备注
需检查总结本身是否也被不正常内容污染，必要时手动修改。
:::
