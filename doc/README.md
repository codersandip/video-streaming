# 🎬 StreamVault Documentation

## 📌 Project Overview
StreamVault is a high-performance, self-hosted HLS video streaming platform. It allows users to upload videos, which are then asynchronously processed into adaptive HLS segments for smooth playback across all devices.

---

## 🏗 System Architecture

### 🛡 Backend (Node.js & Express)
- **HLS Processing**: Uses FFmpeg to convert raw video files into `.m3u8` playlists and `.ts` segments.
- **Security**: JWT-based authentication for APIs. Secure stream delivery through custom middleware.
- **Database**: MongoDB for storing user data, video metadata, and subscription details.
- **Storage**: Local filesystem storage for uploads, segments, and thumbnails.

### 🌐 Frontend (React & Vite)
- **Player**: Custom HLS player using `hls.js` with premium UI controls.
- **Animations**: `framer-motion` for smooth transitions.
- **Styling**: Premium modern UI using **Material UI 5** with a sleek dark theme and glassmorphism.

---

## 🛠 Features

### 1. Adaptive Streaming
Backend automatically handles FFmpeg conversions. The player intelligently buffers segments to ensure no lag during playback.

### 2. Tiered Subscriptions
- **Free**: Restricted access to premium content.
- **Basic/Standard/Premium**: Unlocks higher resolutions (720p, 1080p, 4K) and exclusive content.

### 3. Admin Dashboard
- **Upload Manager**: Drag-and-drop video uploads with progress tracking.
- **Metadata Control**: Manage genres, visibility, and subscription requirements.

### 4. Watch History
Automatically tracks user progress (seconds into the video) and allows resuming from where they left off.

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB 6.0+
- FFmpeg installed on system (for production)

### Commands
1. **Install All Dependencies**:
   ```bash
   npm run install:all
   ```
2. **Setup Database**:
   ```bash
   npm run seed
   ```
3. **Start Development**:
   ```bash
   npm run dev
   ```

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate
- `GET /api/auth/me` - Get current user profile

### Video Management
- `GET /api/videos` - Get public video list
- `POST /api/videos/upload` - (Admin) Upload new video
- `DELETE /api/videos/:id` - (Admin) Remove video and files

### Streaming
- `GET /api/stream/:videoId/index.m3u8` - Get secure playlist
- `GET /api/stream/:videoId/segmentXXX.ts` - Get secure video segment
- `GET /api/stream/thumbnail/:filename` - Serve optimized previews

---

## 🔒 Security Implementation
1. **Protected Segments**: Unlike public bucket URLs, StreamVault segments are served through an Express route that verifies the user's JWT and subscription status before sending each `.ts` file.
2. **CORS Policy**: Restricted to the defined `CLIENT_URL` in `.env`.
3. **Rate Limiting**: Protects auth endpoints from brute-force attacks.
