# 📱 Android 部署

在 Android 设备上通过 Termux 安装 SillyTavern。

## 安装方式

Android 上安装 SillyTavern 的流程与 Linux 基本相同，通过 **Termux** 终端模拟器来运行。

### 方式一：一键安装脚本（推荐）

社区提供了一键安装脚本，可以自动完成所有配置工作：

::: tip 一键脚本地址
脚本可以在这里找到：[https://wiki.类脑.org](https://wiki.类脑.org)
:::

使用一键脚本可以省去手动安装 Git、Node.js 等前置软件的步骤，适合不熟悉命令行的用户。

### 方式二：手动安装

如果你更喜欢手动操作：

#### 1. 安装 Termux

从 [F-Droid](https://f-droid.org/packages/com.termux/) 下载安装 Termux。

::: warning 注意
**不要**从 Google Play 安装 Termux，Play 商店版本已过时且不再维护。
:::

#### 2. 安装依赖

在 Termux 中执行：

```bash
pkg update && pkg upgrade
pkg install git nodejs
```

#### 3. 克隆仓库

```bash
git clone https://github.com/SillyTavern/SillyTavern -b release
```

#### 4. 启动

```bash
cd SillyTavern
bash start.sh
```

## iOS 用户

::: info
iOS 系统**不支持**本地安装 SillyTavern。

你可以通过网络连接到其他设备（如云服务器、局域网内的电脑）上运行的 ST 来使用。例如在电脑上启动 ST 后，将 `config.yaml` 中的监听地址改为 `0.0.0.0`，然后在 iOS 设备的浏览器中访问电脑的局域网 IP 地址。
:::

## 下一步

安装完成后，了解如何 [更新和备份迁移](./update-backup.md)。
