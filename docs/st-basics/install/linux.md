# 🐧 Linux / MacOS 部署

在 Linux 或 MacOS 上安装 SillyTavern 的完整步骤。

## 前置要求

确保系统已安装以下软件：

- **Git** — 大多数 Linux 发行版和 MacOS 已自带
- **Node.js 18+** — 推荐通过 nvm:https://github.com/nvm-sh/nvm 安装  
```bash
# 检查是否已安装
git --version
node --version
```

## 安装步骤

### 1. 克隆仓库

```bash
git clone https://github.com/SillyTavern/SillyTavern -b release  
```

### 2. 进入目录

```bash
cd SillyTavern
```

### 3. 启动

```bash
./start.sh
```

或者：

```bash
bash start.sh
```

脚本会自动安装依赖并启动 SillyTavern，完成后会在终端输出访问地址（默认 `http://localhost:8000`）。  
::: tip MacOS 用户
如果遇到权限问题，先给脚本添加执行权限：
```bash
chmod +x start.sh
```
:::

## 下一步

安装完成后，了解如何 更新和备份迁移:../update-backup.md。
