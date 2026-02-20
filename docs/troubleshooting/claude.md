# 🟠 Claude — Cookie 反代报错对照表

本页面收录使用 Claude Cookie 反代渠道时的常见报错及解决方案。

---

## 403 Forbidden

**现象**：`403 Forbidden` / `unable to serve your request` / `unexpected end of JSON input`

**原因**：Anthropic 加大网络环境审查力度，梯子节点质量不达标

**解决**：
- 更换梯子节点或梯子（以美国为佳，可通过各种 IP 检测网站自查 IP 纯净度）
- 更换预设
- 等待

---

## 413 — Prompt Too Long

**现象**：使用 Claude，终端有关键词 `413 Prompt is too long` / `Payload too large`

**原因**：输入提示词的长度超过上限

**解决**：总结并隐藏前文（参见 [总结方法](/faq/st-usage#如何正确地总结之前的聊天记录-总结方法)）

---

## 429 — Too Many Requests

**现象**：`429 Too many requests`

**原因**：Cookie 额度已耗尽

**解决**：更换一个 Cookie，或者等待配额刷新

---

::: info 📖 相关阅读
- [各 LLM 通用问题](./general.md)
- [报错对照表总览](./)
:::
