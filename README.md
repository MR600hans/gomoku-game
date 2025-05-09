# Gomoku Online

A real-time multiplayer Gomoku (Five in a Row) game built with React, TypeScript, and Firebase.

## Features

- Real-time multiplayer gameplay
- 10×10 game board
- Player ready status
- Game state management
- Win detection
- Responsive design

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Firebase 9
- Jest for testing

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

Run the test suite:
```bash
npm test
```

## Project Structure

- `/src/components` - React components
- `/src/hooks` - Custom React hooks
- `/src/utils` - Utility functions
- `/src/pages` - Page components
- `/src/config` - Configuration files 