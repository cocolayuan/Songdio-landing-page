# Songdio Landing Page

Songdio 官网落地页项目，按版本分目录管理。

## 最新版本

**当前以 `V2/Figma Make Visual to HTML/` 为最新内容。**

这是 V2 的主实现（Vite + React），包含 Hero 视频、功能卡片交互、评价轮播等完整落地页。

### 在线预览（公开可访问）

- Preview: https://cocolayuan.github.io/Songdio-landing-page/

由 GitHub Pages（`gh-pages` 分支）托管最新 V2 构建产物，他人无需启动本地服务即可查看。

本地开发：`cd "V2/Figma Make Visual to HTML" && npm install && npm run dev`（默认 [http://localhost:5173](http://localhost:5173)）。

## 目录结构

```
Songdio-landing-page/
├── V1-testing/                      # V1 测试版（归档）
├── V2/
│   ├── Figma Make Visual to HTML/   # ✅ 最新：V2 主落地页（Vite）
│   ├── app/ components/ ...         # 早期 Next.js 实验目录（非最新）
│   └── ...
└── README.md
```

## 版本说明

| 版本 | 路径 | 状态 | 说明 |
|------|------|------|------|
| V1-testing | `V1-testing/` | 归档 | 首版原型：全屏 Hero 视频 + 音乐卡片轮播 |
| V2（最新） | `V2/Figma Make Visual to HTML/` | 活跃 | Figma 转 HTML 完整落地页 |
| V2（旧实验） | `V2/` 根下 Next.js 目录 | 非最新 | 早期 3D 专辑轮播实验，请勿当作当前版本 |
