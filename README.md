# 开饭盒子

每天不知道吃什么？打开页面，用盲盒 / 翻牌 / 转盘抽出家常菜。

## 功能

- 500 道不重复家常菜
- 可选 2–5 道；凉菜、海鲜默认不进奖池，可勾选包含
- 盲盒 / 翻牌 / 转盘三种揭晓方式，可随时换一组
- 数据存在本机 `localStorage`，无后端

## 开发

```bash
npm install
npm run dev
```

生成菜谱库：

```bash
node scripts/generate-recipes.mjs
```

## 技术

Vite · React · TypeScript · Motion · React Router
