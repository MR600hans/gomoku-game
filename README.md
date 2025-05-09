# 五子棋線上對戰遊戲 (Gomoku Online)

一個使用 React、TypeScript 和 Firebase 構建的線上五子棋對戰遊戲。玩家可以創建房間或加入現有房間進行實時對戰。

## 功能特點

- 🎮 即時線上對戰
- 🏠 房間系統（創建/加入房間）
- 🎯 實時遊戲狀態同步
- 👥 支持兩位玩家對戰
- 📱 響應式設計，支持手機和桌面設備
- ⚡ 快速的遊戲體驗

## 技術棧

- React 18
- TypeScript
- Firebase (Realtime Database)
- Tailwind CSS
- Vite

## 本地開發

1. 克隆倉庫
```bash
git clone https://github.com/MR600hans/gomoku-game.git
cd gomoku-game
```

2. 安裝依賴
```bash
npm install
```

3. 設置環境變量
創建 `.env` 文件並添加以下配置：
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. 啟動開發服務器
```bash
npm run dev
```

## 部署步驟

1. 安裝 Firebase CLI（如果尚未安裝）
```bash
npm install -g firebase-tools
```

2. 登入 Firebase
```bash
firebase login
```

3. 初始化 Firebase 專案（如果是第一次部署）
```bash
firebase init
```
選擇以下選項：
- Choose Hosting
- Select your project
- Set public directory as "dist"
- Configure as single-page app: Yes
- Set up automatic builds and deploys with GitHub: No

4. 構建專案
```bash
npm run build
```

5. 部署到 Firebase
```bash
firebase deploy
```

部署完成後，Firebase 會提供一個託管 URL，可以通過該 URL 訪問應用。

## 遊戲規則

1. 黑子先行，雙方輪流落子
2. 在空位置上點擊即可落子
3. 任意一方在橫、豎、斜方向連成五子即獲勝
4. 遊戲開始前需要雙方玩家都點擊「準備」按鈕


## 開發者

- MR600hans 謝秉軒

## 授權

本專案採用 MIT 授權條款 - 查看 [LICENSE](LICENSE) 文件了解更多細節

## 貢獻

歡迎提交 Issue 和 Pull Request！

1. Fork 本倉庫
2. 創建新的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 聯繫方式

如有任何問題或建議，歡迎通過以下方式聯繫：

- GitHub Issues
- Email: [hieshhanson1@gmail.com]

## 致謝

感謝所有為本專案做出貢獻的開發者！ 