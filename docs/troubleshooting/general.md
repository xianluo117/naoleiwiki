# 🌐 各 LLM 通用问题

本页面收录适用于所有模型和渠道的通用报错及解决方案。

---

## 参数超限

**现象**：终端报错信息中有此类内容：
- `(参数名): Must be less than or equal to XXXX`，例如 `max_tokens: Must be less than or equal to 8192`
- `Invalid (参数名) value, the valid range of (参数名) is [范围]`，例如 `Invalid max_tokens value, the valid range of max_tokens is [1, 8192]`
- `Unable to submit request because it has a (参数名) value of (当前值) but the supported range is (范围)`

**原因**：API 不接受超出范围的参数

**解决**：按照提示，将 SillyTavern「预设」中的此项参数调整到 API 可接受的范围内即可

::: tip 💡 注意
特别注意提示中 `exclusive`（不包含端点值）和 `inclusive`（包含端点值）之类的词。
:::

---

## AI 不听话

**现象**：AI 不遵守指令（如不按要求的格式输出内容），情节前后矛盾或其他明显不合理等

**原因**：
- 用户输入的上下文长度超过了模型的承受范围（Gemini 2.5 Pro 约 80k，Gemini 3.0 Pro Preview 约 32k~40k）
- 插件导致预设提示词结构被破坏

**解决**：
- 总结并隐藏前文（参见 [总结方法](/faq/st-usage#如何正确地总结之前的聊天记录-总结方法)）
- 检查是否使用了会在预设体系之外插入提示词的插件（如各类「记忆表格」「知识库」等），将其关闭

---

::: info 📖 相关阅读
- [Gemini AI Studio API 报错](./gemini-api.md)
- [Gemini CLI2api 报错](./gemini-cli.md)
- [Gemini Build2api 报错](./gemini-build.md)
- [Claude 报错](./claude.md)
- [DeepSeek 报错](./deepseek.md)
- [报错对照表总览](./)
:::
