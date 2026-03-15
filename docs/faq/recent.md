# 🆕 近期常见

## Gemini 报错区分

- `gemini 429 Resource has been exhausted:` 为 Google 算力不足。需要重 roll，和别人抢算力。
- `Rate limit reached:` 为速率限制。需要等待 CD。

## 正文出现很多“极其”八股解决方案

- 可使用 反极其正则:https://discord.com/channels/1134557553011998840/1460270173549232251/1478046698231038033 优化处理。

## MT 无法找到 Termux 文件夹

**现象**：在 MT 管理器中选择本地存储时，会被系统自动跳转到文件管理器，导致无法直接挂载 Termux 内部文件夹，SFTP/强制映射也无效。

**解决方案（按图操作）**：

1. 在 MT 管理器打开 **本地存储** 的选择界面，让系统跳转到文件管理器的 **存储访问框架** 页面。
2. 在该页面点击左上角的 **三条横线（侧边栏）**，展开存储列表。
3. 在列表中找到并点选 **Termux**（或显示为 *com.termux* 的存储入口）。
4. 返回 MT 管理器后再次选择本地存储，即可看到 Termux 文件夹并完成挂载。

> 如果侧边栏没有 Termux 入口，请先确认 Termux 已安装并授予存储权限，然后回到此页面刷新列表。

## Google 反重力 403 报错

**报错内容**：`This service has been disabled in this account for violation of Terms of Service. Please submit an appeal to continue using this product.`

**处理方式**：按照提示提交申诉表单。

- 申诉链接：<https://forms.gle/hGzM9MEUv2azZsrb9>

## 403 报错：permission denied on resource project userful-spark

**报错内容**：`permission denied on resource project userful-spark` / `status: permission_denied`

**解决方案**：完成 Google 年龄认证后再重试。

- 认证入口：<https://myaccount.google.com/age-verification>
