# CLAUDE.md

本文件为 Claude Code（claude.ai/code）在此仓库中工作时提供指导。

## 项目概述

摄影师"亦·PHOTOGRAPHY"的个人作品集网站，专注风光旅行摄影。项目以两种形态存在：

- **`index.html` + `css/style.css` + `js/main.js`** — 原始静态参考实现，是内容、设计和交互的权威来源。
- **`src/`（Next.js）** — 正在进行的迁移目标。所有新开发都在此处进行。

## 常用命令

```bash
npm run dev       # 启动 Next.js 开发服务器（Turbopack）
npm run build     # 生产构建
npm run start     # 启动生产服务器
npm run lint      # 运行代码检查
```

## 架构

### 技术栈
- **Next.js 16**（App Router、Turbopack）、**React 19**、**TypeScript 6**
- **Tailwind CSS 4**，使用 `@tailwindcss/postcss` 插件
- **lucide-react** 作为图标库（无品牌图标——使用 `Camera`、`Globe`、`MessageCircle` 等通用图标）

### 目录结构

```
src/
├── app/
│   ├── globals.css      # Tailwind v4 @theme（--color-*、--font-*）、动画、基础样式
│   ├── layout.tsx        # 根布局：元数据、next/font（Noto Sans/Serif SC）
│   └── page.tsx          # 首页：按顺序组合所有区块
├── components/           # 均为 'use client'（滚动动画、交互逻辑）
│   ├── Navbar.tsx        # 固定导航栏、滚动监听、移动端抽屉菜单
│   ├── Hero.tsx          # 全屏幻灯片（CSS background-image）、Ken Burns 效果
│   ├── Gallery.tsx       # CSS columns 瀑布流布局、分类筛选、灯箱触发
│   ├── Lightbox.tsx      # 基于 Portal 的模态框，支持键盘导航
│   ├── About.tsx         # 照片 + 简介 + 数据统计（滚动触发数字递增动画）
│   ├── Services.tsx      # 报价卡片网格、热门卡片高亮
│   ├── Testimonials.tsx  # 评价轮播（自动旋转）
│   ├── Contact.tsx       # 表单 + 联系信息侧栏、提交成功状态
│   ├── Footer.tsx        # 链接、邮件订阅、回到顶部按钮
│   └── SectionHeader.tsx # 可复用的标题组件（大部分区块未使用，它们内联了标题）
├── hooks/
│   ├── useScrollSpy.ts   # 追踪当前视口中的区块、导航栏背景状态
│   ├── useIntersection.ts # IntersectionObserver——触发一次后永久为 true，返回 { ref, isVisible }
│   └── useCountUp.ts     # 数字递增动画（requestAnimationFrame、缓动函数）
└── lib/
    ├── types.ts          # 所有 TypeScript 类型定义
    └── data.ts           # 所有内容数据（导航链接、作品、服务、评价等）
```

### 核心模式

- **设计系统**：暗色表面层级（`#0a0a0a` → `#1a1a1a`），金色点缀（`#c9a96e`），中文衬线/无衬线字体。所有颜色在 `globals.css` 中通过 Tailwind v4 `@theme` 自定义属性定义。
- **滚动动画**：组件使用 `useIntersection` 钩子在首次进入视口时触发一次性淡入/滑入动画。钩子会在首次交叉后将 `isVisible` 永久设为 `true`。
- **平滑滚动导航**：所有导航使用 `document.querySelector(href)` + `window.scrollTo({ behavior: 'smooth' })`，并为固定导航栏预留 80px 偏移。
- **图片**：托管在 Unsplash（`images.unsplash.com`），在 `next.config.ts` 的 `remotePatterns` 中配置。作品集使用 `w=600` 尺寸，Hero 幻灯片使用 `w=1920`。
- **表单处理**：模拟异步提交，延迟 1.5 秒——无实际后端接口。

### 原始静态站点

`index.html`、`css/style.css` 和 `js/main.js` 是完整的可用参考。当某个 Next.js 组件的行为不明确时，请阅读这些文件中对应的部分。静态站点使用原生 JavaScript 实现：作品筛选、灯箱前后切换、Hero/评价自动轮播、基于滚动的导航栏样式、数字递增统计、移动端菜单切换、表单提交以及回到顶部按钮的显隐。

# 注意事项
每句话后面都要加一句“喵~”