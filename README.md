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

### ARM 构建工作流

除了标准平台外，我们还配置了 ARM 架构的构建工作流，用于支持 ARM 设备（如树莓派）。

这个工作流会在推送标签时自动运行，或者可以在 GitHub Actions 页面手动触发。

## 权限设置

确保在 GitHub 仓库设置中为 GitHub Actions 提供了足够的权限：

1. 进入仓库设置 -> Actions -> General
2. 在 "Workflow permissions" 部分，选择 "Read and write permissions"
