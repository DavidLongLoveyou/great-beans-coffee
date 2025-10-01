'use client';

import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Download,
  Share2,
  Loader2,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';

export interface VideoSource {
  src: string;
  quality: string;
  type?: string;
}

export interface VideoChapter {
  time: number;
  title: string;
  description?: string;
}

interface VideoPlayerProps {
  sources: VideoSource[];
  title?: string;
  description?: string;
  poster?: string;
  chapters?: VideoChapter[];
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  allowDownload?: boolean;
  allowShare?: boolean;
  className?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

export function VideoPlayer({
  sources,
  title,
  description,
  poster,
  chapters = [],
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
  allowDownload = true,
  allowShare = true,
  className = '',
  onTimeUpdate,
  onEnded,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState(
    sources[0]?.quality || 'auto'
  );
  const [showSettings, setShowSettings] = useState(false);
  const [buffered, setBuffered] = useState(0);

  const currentSource =
    sources.find(s => s.quality === selectedQuality) || sources[0];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime);

      // Update buffered
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [onTimeUpdate, onEnded]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = newVolume;
    setVolume(newVolume);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(
      0,
      Math.min(duration, video.currentTime + seconds)
    );
  };

  const changeQuality = (quality: string) => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const wasPlaying = isPlaying;

    setSelectedQuality(quality);
    setIsLoading(true);

    // After source change, restore time and play state
    setTimeout(() => {
      video.currentTime = currentTime;
      if (wasPlaying) {
        video.play();
      }
    }, 100);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentSource.src;
    link.download = title || 'video';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Video',
          text: description,
          url: window.location.href,
        });
      } catch (error) {
        // Error sharing - silently fail
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercentage = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">{title}</h2>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="group relative aspect-video bg-black">
            {/* Video Element */}
            <video
              ref={videoRef}
              className="h-full w-full"
              poster={poster}
              autoPlay={autoPlay}
              loop={loop}
              muted={muted}
              playsInline
              onClick={togglePlay}
            >
              <source
                src={currentSource.src}
                type={currentSource.type || 'video/mp4'}
              />
              Your browser does not support the video tag.
            </video>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}

            {/* Play/Pause Overlay */}
            <div
              className="absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
              onClick={togglePlay}
            >
              <Button
                variant="secondary"
                size="icon"
                className="h-16 w-16 bg-white/20 text-white hover:bg-white/30"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="ml-1 h-8 w-8" />
                )}
              </Button>
            </div>

            {/* Controls */}
            {controls && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                {/* Progress Bar */}
                <div className="mb-4">
                  <div
                    className="h-1 w-full cursor-pointer rounded-full bg-white/30"
                    onClick={e => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const percentage = x / rect.width;
                      handleSeek(percentage * duration);
                    }}
                  >
                    {/* Buffered */}
                    <div
                      className="absolute h-full rounded-full bg-white/50"
                      style={{ width: `${bufferedPercentage}%` }}
                    />
                    {/* Progress */}
                    <div
                      className="relative h-full rounded-full bg-white"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-white" />
                    </div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => skipTime(-10)}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => skipTime(10)}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={toggleMute}
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>

                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={e =>
                          handleVolumeChange(parseFloat(e.target.value))
                        }
                        className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/30"
                      />
                    </div>

                    <span className="text-sm text-white">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quality Settings */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={() => setShowSettings(!showSettings)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>

                      {showSettings && (
                        <div className="absolute bottom-full right-0 mb-2 min-w-32 rounded-lg bg-black/90 p-2">
                          <div className="mb-2 text-sm font-medium text-white">
                            Quality
                          </div>
                          {sources.map(source => (
                            <button
                              key={source.quality}
                              className={`block w-full rounded px-2 py-1 text-left text-sm ${
                                selectedQuality === source.quality
                                  ? 'bg-white/20 text-white'
                                  : 'text-gray-300 hover:bg-white/10'
                              }`}
                              onClick={() => {
                                changeQuality(source.quality);
                                setShowSettings(false);
                              }}
                            >
                              {source.quality}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {allowDownload && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}

                    {allowShare && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={handleShare}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? (
                        <Minimize className="h-4 w-4" />
                      ) : (
                        <Maximize className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chapters */}
      {chapters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chapters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <button
                  key={`chapter-${chapter.time}-${chapter.title}`}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    currentTime >= chapter.time &&
                    (index === chapters.length - 1 ||
                      currentTime < chapters[index + 1].time)
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSeek(chapter.time)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{chapter.title}</div>
                      {chapter.description && (
                        <div className="mt-1 text-sm text-gray-600">
                          {chapter.description}
                        </div>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {formatTime(chapter.time)}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
