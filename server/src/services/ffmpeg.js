const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

// Use bundled ffmpeg binary
ffmpeg.setFfmpegPath(ffmpegStatic);

const HLS_BASE = path.join(__dirname, '../../../hls');

/**
 * Get video metadata (duration, resolution, etc.)
 */
const getVideoMetadata = (inputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) return reject(err);

      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      resolve({
        duration: Math.round(metadata.format.duration || 0),
        fileSize: metadata.format.size || 0,
        width: videoStream ? videoStream.width : 0,
        height: videoStream ? videoStream.height : 0,
        codec: videoStream ? videoStream.codec_name : 'unknown'
      });
    });
  });
};

/**
 * Convert video to HLS format with multiple quality levels
 */
const convertToHLS = (inputPath, videoId, onProgress) => {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(HLS_BASE, videoId.toString());

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPlaylist = path.join(outputDir, 'index.m3u8');

    ffmpeg(inputPath)
      .addOptions([
        '-profile:v baseline',
        '-level 3.0',
        '-start_number 0',
        '-hls_time 10',
        '-hls_list_size 0',
        '-f hls',
        '-hls_segment_filename',
        path.join(outputDir, 'segment%03d.ts')
      ])
      .output(outputPlaylist)
      .on('start', (cmd) => {
        console.log(`🎬 FFmpeg started for video ${videoId}`);
      })
      .on('progress', (progress) => {
        if (onProgress) {
          onProgress(Math.round(progress.percent || 0));
        }
      })
      .on('end', () => {
        console.log(`✅ HLS conversion completed for video ${videoId}`);
        resolve(outputDir);
      })
      .on('error', (err) => {
        console.error(`❌ FFmpeg error for video ${videoId}:`, err.message);
        // Clean up failed output
        if (fs.existsSync(outputDir)) {
          fs.rmSync(outputDir, { recursive: true, force: true });
        }
        reject(err);
      })
      .run();
  });
};

/**
 * Generate thumbnail from video at a specific timestamp
 */
const generateThumbnail = (inputPath, videoId, timestamp = '00:00:02') => {
  return new Promise((resolve, reject) => {
    const thumbDir = path.join(__dirname, '../../../thumbnails');
    if (!fs.existsSync(thumbDir)) {
      fs.mkdirSync(thumbDir, { recursive: true });
    }

    const thumbName = `thumb-${videoId}.jpg`;
    const thumbPath = path.join(thumbDir, thumbName);

    ffmpeg(inputPath)
      .screenshots({
        timestamps: [timestamp],
        filename: thumbName,
        folder: thumbDir,
        size: '1280x720'
      })
      .on('end', () => {
        console.log(`🖼️ Thumbnail generated for video ${videoId}`);
        resolve(`/thumbnails/${thumbName}`);
      })
      .on('error', (err) => {
        console.warn(`⚠️ Thumbnail generation failed: ${err.message}`);
        resolve(null); // non-fatal
      });
  });
};

/**
 * Delete HLS files for a video
 */
const deleteHLSFiles = (videoId) => {
  const hlsDir = path.join(HLS_BASE, videoId.toString());
  if (fs.existsSync(hlsDir)) {
    fs.rmSync(hlsDir, { recursive: true, force: true });
    console.log(`🗑️ HLS files deleted for video ${videoId}`);
  }
};

module.exports = { convertToHLS, getVideoMetadata, generateThumbnail, deleteHLSFiles };
