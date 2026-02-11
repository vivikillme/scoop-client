# ScoopClient

Scoop 的原生桌面 GUI 客户端，基于 Electron + Next.js 构建。

## 功能特性

- **应用管理** - 查看、更新、卸载已安装的应用
- **搜索安装** - 搜索并安装 Scoop 仓库中的应用
- **Bucket 管理** - 添加、删除和管理 Scoop 源
- **版本切换** - 支持 JDK、Node.js、Python 等运行时的版本切换（reset 功能）
- **系统清理** - 清理旧版本应用释放磁盘空间

## 项目结构

```
scoop-client/
├── main/                    # Electron 主进程
│   ├── background.ts        # 主进程入口，窗口管理和 IPC 处理
│   ├── preload.ts          # 预加载脚本，暴露安全的 API
│   └── database.ts         # 数据库操作（可选）
├── renderer/               # Next.js 渲染进程
│   ├── pages/              # 页面组件
│   │   ├── index.tsx       # 已安装应用列表
│   │   ├── search.tsx      # 搜索和安装
│   │   ├── buckets.tsx     # Bucket 管理
│   │   └── settings.tsx    # 设置和版本管理
│   ├── components/         # 可复用组件
│   │   ├── Sidebar.tsx     # 侧边栏导航
│   │   ├── Toast.tsx       # Toast 通知组件
│   │   └── ...
│   ├── hooks/              # 自定义 Hooks
│   │   └── useToast.ts     # Toast 状态管理
│   ├── lib/                # 工具函数和类型定义
│   └── styles/             # 全局样式
├── resources/              # 应用图标资源
└── scripts/                # 构建脚本
```

## 开发环境

### 前置要求

- Node.js 16+
- npm 或 yarn
- Windows 系统（需要 Scoop）

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动后会自动打开 Electron 窗口，支持热重载。

### 快捷键

- `Ctrl+Shift+Alt+O` - 打开/关闭开发者工具

## 构建打包

### Windows

```bash
npm run build              # 构建 Next.js
npm run electron:pack:win  # 打包 Windows 安装包
```

产物位于 `release/` 目录。

### macOS

```bash
npm run build
npm run electron:pack:mac  # 打包 macOS DMG
```

**注意**：构建 Windows 包后需要运行 `npm rebuild better-sqlite3` 恢复开发环境。

## 技术栈

- **Electron** - 跨平台桌面应用框架
- **Next.js** - React 框架，用于渲染进程
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

## 配置说明

- `nextron.config.js` - Nextron 配置
- `renderer/next.config.js` - Next.js 配置（静态导出）
- `electron-builder.yml` - Electron Builder 打包配置

## 开发注意事项

1. **路径问题** - 生产环境使用 `file://` 协议，所有路由需要尾部斜杠
2. **原生模块** - better-sqlite3 需要针对 Electron ABI 重新编译
3. **静态导出** - Next.js 使用 `output: 'export'` 模式，不支持服务端功能
4. **IPC 通信** - 主进程和渲染进程通过 `window.electronAPI` 通信


