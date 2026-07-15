# 开饭盒子

每天不知道吃什么？打开页面，用盲盒 / 翻牌 / 转盘抽出三道家常菜。

## 功能

- 300 道家常菜（荤菜为主，含素菜 / 汤 / 主食 / 凉菜）
- 每日种子抽奖，刷新仍一致；每天可再抽 1 次
- 确认菜单打卡、连吃、稀有菜解锁
- 可避开昨天已确认的菜
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
