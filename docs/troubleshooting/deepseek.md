# 🐋 DeepSeek 报错对照表

本页面收录使用 DeepSeek 官方 API 时的常见问题及解决方案。

---

## 模型对应问题

**Q**：SillyTavern 中的 `deepseek-chat` 和 `deepseek-reasoner` 分别对应哪个模型？选哪个更好？

**A**：截止 2026 年 1 月 2 日，这两个对应的都是 **DeepSeek V3.2** 模型：
- 选择 `deepseek-chat` 会 **不开启** 模型的思维链
- 选择 `deepseek-reasoner` 会 **启用** 思维链

按照预设作者的要求，选择合适的模型即可。

---

## 敏感词

**现象**：`sensitive words detected` 或类似内容

**原因**：提示词中含有敏感词

**解决**：修改输入内容

---

::: info 📖 相关阅读
- [各 LLM 通用问题](./general.md)
- [报错对照表总览](./)
:::
