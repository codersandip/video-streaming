# 🎬 StreamVault - Self-Hosted Video Streaming Platform

A premium, production-ready video streaming platform built with React, Material UI, Node.js, and FFmpeg. Features a stunning modern dark interface, HLS adaptive streaming, secure JWT authentication, and a tiered subscription system.

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18 or later
- **MongoDB**: Running locally on port `27017`
- **FFmpeg**: Installed on your system (optional, as `ffmpeg-static` is bundled)

### 2. Installation
Run the following command in the root directory to install all dependencies for both frontend and backend:
```bash
npm run install:all
```

### 3. Setup
Initialize the database with the admin user and default subscription plans:
```bash
npm run seed
```

### 4. Development
Start both the client and server concurrently with a single command:
```bash
npm run dev
```
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 🔐 Credentials
**Default Admin Login:**
- **Email:** `admin@example.com`
- **Password:** `Admin@123`

## 🏗 Architecture
- **HLS Streaming**: Videos are converted to `.m3u8` playlists and `.ts` segments.
- **Security**: Routes are protected by JWT. Streaming routes check for active subscriptions.
- **Database**: MongoDB tracks users, metadata, and watch history.
- **Storage**: All media stays local (no S3/CDN required).

## 🐳 Docker Support
Build and run the entire stack using Docker:
```bash
docker-compose up --build
```

---
*Created with ❤️ for self-hosters.*
