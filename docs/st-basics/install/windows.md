# 💻 Windows 部署

在 Windows 上安装 SillyTavern 的完整步骤。

## 前置要求

在开始之前，请先安装以下软件：

| 软件                | 下载地址                                        | 说明                          |
| ------------------- | ----------------------------------------------- | ----------------------------- |
| **Node.js**         | [nodejs.org](https://nodejs.org/)               | 选择 **LTS（长期支持）** 版本 |
| **Git for Windows** | [git-scm.com](https://git-scm.com/download/win) | 用于下载和更新 ST             |

::: warning 系统要求
Windows 7 及更早版本**无法安装**所需的 Node.js 版本，请使用 Windows 10 或更新系统。
:::

## 安装步骤

### 1. 打开命令行

在一个**没有权限问题**的文件夹中打开 `cmd` 或 `PowerShell`。

::: tip 建议
避免在 `C:\Program Files` 等受保护目录下操作。推荐使用类似 `D:\SillyTavern` 的自定义目录。

你可以在文件管理器中导航到目标文件夹，然后在地址栏输入 `cmd` 并回车，即可在该目录打开命令行。
:::

### 2. 克隆仓库

```bash
git clone https://github.com/SillyTavern/SillyTavern -b release
```

这将下载最新**稳定版**的 SillyTavern。

### 3. 启动

git clone 完成后，进入 `SillyTavern` 文件夹，双击 **`start.bat`**。

Node.js 将自动安装所需依赖，稍等片刻后，ST 会在浏览器中自动打开。

::: info 首次启动
首次启动可能需要较长时间来下载依赖，请耐心等待。如果浏览器没有自动打开，可以手动访问 `http://localhost:8000`。
:::

## 下一步

安装完成后，了解如何 [更新和备份迁移](../update-backup.md)。
