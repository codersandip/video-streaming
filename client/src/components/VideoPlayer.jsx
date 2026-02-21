import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipForward, SkipBack } from 'lucide-react';

const VideoPlayer = ({ src, poster, startTime = 0, onProgress }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeout = useRef(null);

    useEffect(() => {
        let hls;

        if (Hls.isSupported()) {
            const token = localStorage.getItem('token');
            hls = new Hls({
                enableWorker: true,
                maxBufferLength: 30,
                xhrSetup: (xhr, url) => {
                    if (token) {
                        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    }
                }
            });
            hls.loadSource(src);
            hls.attachMedia(videoRef.current);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (startTime > 0) {
                    videoRef.current.currentTime = startTime;
                }
            });
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = src;
        }

        return () => {
            if (hls) hls.destroy();
        };
    }, [src]);

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleProgress = () => {
        const current = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        const percent = (current / duration) * 100;
        setProgress(percent);

        if (onProgress && Math.floor(current) % 5 === 0) {
            onProgress(current);
        }
    };

    const handleSeek = (e) => {
        const rect = e.target.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = pos * videoRef.current.duration;
    };

    const toggleMute = () => {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(controlsTimeout.current);
        controlsTimeout.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    return (
        <div
            ref={containerRef}
            className={`player-container ${!showControls && isPlaying ? 'hide-cursor' : ''}`}
            onMouseMove={handleMouseMove}
            style={{
                position: 'relative',
                width: '100%',
                background: '#000',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
        >
            <video
                ref={videoRef}
                poster={poster}
                onTimeUpdate={handleProgress}
                onClick={togglePlay}
                style={{ width: '100%', display: 'block' }}
            />

            {/* Custom Controls Overlay */}
            <div className={`controls-overlay ${showControls ? 'show' : ''}`} style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                padding: '20px',
                transition: 'opacity 0.3s ease',
                opacity: showControls ? 1 : 0,
                pointerEvents: showControls ? 'auto' : 'none'
            }}>
                {/* Progress Bar */}
                <div
                    className="progress-bar-container"
                    onClick={handleSeek}
                    style={{
                        height: '6px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        marginBottom: '15px',
                        position: 'relative'
                    }}
                >
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: 'var(--primary)',
                        borderRadius: '10px',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            right: -5,
                            top: -3,
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: 'white',
                            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                        }} />
                    </div>
                </div>

                {/* Bottom Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button onClick={togglePlay} className="control-btn">
                            {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
                        </button>
                        <button className="control-btn" onClick={() => videoRef.current.currentTime -= 10}>
                            <SkipBack size={20} />
                        </button>
                        <button className="control-btn" onClick={() => videoRef.current.currentTime += 10}>
                            <SkipForward size={20} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button onClick={toggleMute} className="control-btn">
                                {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </button>
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={volume}
                                onChange={(e) => {
                                    const v = parseFloat(e.target.value);
                                    setVolume(v);
                                    videoRef.current.volume = v;
                                    setIsMuted(v === 0);
                                }}
                                className="volume-slider"
                            />
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'white' }}>
                            {formatTime(videoRef.current?.currentTime)} / {formatTime(videoRef.current?.duration)}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button className="control-btn"><Settings size={20} /></button>
                        <button onClick={toggleFullScreen} className="control-btn">
                            <Maximize size={22} />
                        </button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .control-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: transform 0.2s ease;
        }
        .control-btn:hover {
          transform: scale(1.1);
        }
        .volume-slider {
          width: 80px;
          height: 4px;
          accent-color: var(--primary);
        }
        .hide-cursor {
          cursor: none;
        }
        .player-container:hover .controls-overlay {
          opacity: 1;
        }
      `}} />
        </div>
    );
};

const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default VideoPlayer;
