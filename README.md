# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# Stock App

基于 Tauri 和 Svelte 构建的股票应用程序。

## 开发

安装依赖：

```bash
bun install
```

启动开发服务器：

```bash
bun run dev
```

## 构建

创建生产版本：

```bash
bun run build
```

## GitHub Actions 工作流

本项目配置了以下 GitHub Actions 工作流：

### 持续集成 (CI)

每次推送到 `master` 分支或提交 Pull Request 时，CI 工作流会在不同平台（Windows、macOS 和 Linux）上构建应用程序，以确保代码可以正常构建。

### 发布工作流

当你推送一个标签（格式为 `v*`，例如 `v0.1.0`）时，发布工作流会自动构建应用程序并创建一个 GitHub Release。

发布步骤：

1. 更新 `src-tauri/tauri.conf.json` 中的版本号
2. 提交更改并推送到 GitHub
3. 创建并推送一个新标签：

```bash
git tag v0.1.0
git push origin v0.1.0
```

## 权限设置

确保在 GitHub 仓库设置中为 GitHub Actions 提供了足够的权限：

1. 进入仓库设置 -> Actions -> General
2. 在 "Workflow permissions" 部分，选择 "Read and write permissions"

## 启动 .NET 插件时避免本地化资源 DLL 报错

如果遇到类似如下报错：

```
System.IO.FileNotFoundException: Could not load file or assembly 'Microsoft.Extensions.DependencyInjection.resources, Version=8.0.0.0, Culture=zh-CN, ...
```

请在启动命令前设置环境变量，强制 .NET 使用英文环境：

**Windows PowerShell/命令行：**

```
$env:DOTNET_CLI_UI_LANGUAGE="en-US"
$env:DOTNET_CLI_LOCALE="en-US"
bun run dev
```

**Windows CMD：**

```
set DOTNET_CLI_UI_LANGUAGE=en-US
set DOTNET_CLI_LOCALE=en-US
bun run dev
```

这样可避免 .NET 查找中文本地化资源 DLL，彻底解决此类报错。
