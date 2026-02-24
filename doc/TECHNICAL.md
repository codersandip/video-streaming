# 🛠 Technical Specification & Development Guide

## 🗄 Database Schema

### User Model
- `name`, `email`, `password` (hashed)
- `role`: `user` | `admin`
- `subscription`: Contains `plan`, `expiresAt`, and `isActive`
- `watchHistory`: Array of `{ videoId, progress, lastWatched }`

### Video Model
- `title`, `description`, `genre`, `tags`
- `originalFile`: Reference to raw upload
- `hlsPath`: Path to the `.m3u8` entry point
- `processingStatus`: `pending` | `processing` | `completed` | `failed`
- `requiresSubscription`: Boolean flag for premium content

---

## 🎞 Video Processing Pipeline
1. **Upload**: User uploads file via `multer`.
2. **Metadata**: `ffprobe` extracts duration and resolution.
3. **Thumbnail**: FFmpeg takes a screenshot at 00:00:03.
4. **HLS Conversion**: 
   - Split video into 10-second segments.
   - Generate `index.m3u8` playlist.
   - Update DB once `completed`.

---

## 🔑 Authentication Flow
1. Frontend sends credentials to `/api/auth/login`.
2. Backend returns a Signed JWT.
3. Frontend stores JWT in `localStorage`.
4. `Axios` interceptor attaches `Authorization: Bearer <token>` to all requests.
5. HLS.js uses `xhrSetup` to include the token for segment requests.

---

## 🎨 UI Design System
- **Framework**: Material UI 5 (MUI)
- **Theme**: Custom Dark Mode with Slate-Indigo palette.
- **Background**: Deep surface color `#0f172a` (Slate 900)
- **Primary Accent**: Indigo `#6366f1`
- **Secondary Accent**: Pink `#ec4899`
- **Typography**: `Outfit` (Headings) and `Inter` (Body)
- **Effects**: Backdrop blur (12px), Glassmorphism, Linear Gradients.

---

## 📁 Directory Structure Details
- `/server/src/services/ffmpeg.js`: The heart of video processing.
- `/client/src/context/AuthContext.jsx`: Manages global login state.
- `/hls/`: Dynamic directory where processed streams are stored (organized by video ID).
- `/uploads/`: Temporary storage for raw uploads before processing.
