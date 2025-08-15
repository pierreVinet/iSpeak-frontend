"use client";

import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { formatTime, isTimeInRange } from "@/lib/utils";
import type { TimeRange } from "@/types";
import { useCallback, useEffect, useRef } from "react";
import { useFileUpload } from "@/contexts/file-upload";
import posthog from "posthog-js";

export interface AudioControlsProps {
  isPlaying?: boolean; // Optional, will use context if not provided
  currentTime?: number; // Optional, will use context if not provided
  duration: number;
  isLoading: boolean;
  error: string | null;
  onPlayPause?: () => void; // Optional, will use default if not provided
  onSeek?: (time: number) => void;
  playbackRange?: TimeRange | null; // Optional range for segment playback
  showSeekbar?: boolean; // Whether to show the seek bar (default: true)
  disabled?: boolean;
  enableSegmentPlayback?: boolean; // Whether to enable automatic segment stopping
}

const AudioControls = ({
  isPlaying: propIsPlaying,
  currentTime: propCurrentTime,
  duration,
  isLoading,
  error,
  onPlayPause: propOnPlayPause,
  onSeek,
  playbackRange,
  showSeekbar = true,
  disabled = false,
  enableSegmentPlayback = false,
}: AudioControlsProps) => {
  const {
    wavesurferInstance,
    isPlaying: contextIsPlaying,
    setIsPlaying,
    currentTime: contextCurrentTime,
  } = useFileUpload();

  // Use context values if props not provided
  const isPlaying = propIsPlaying ?? contextIsPlaying;
  const currentTime = propCurrentTime ?? contextCurrentTime;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Default play/pause handler that uses wavesurfer instance
  const defaultPlayPause = useCallback(() => {
    if (!wavesurferInstance) return;

    try {
      if (isPlaying) {
        wavesurferInstance.pause();
        setIsPlaying(false);
      } else {
        // If segment playback is enabled and we have a range, seek to start first
        if (enableSegmentPlayback && playbackRange) {
          if (!isTimeInRange(currentTime, playbackRange)) {
            const normalizedStart = playbackRange.start / duration;
            wavesurferInstance.seekTo(normalizedStart);
          }
        }
        wavesurferInstance.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error during segment play/pause:", error);
    }
  }, [
    wavesurferInstance,
    isPlaying,
    setIsPlaying,
    enableSegmentPlayback,
    playbackRange,
    duration,
  ]);

  // Use provided onPlayPause or default
  const handlePlayPauseClick = propOnPlayPause || defaultPlayPause;

  // Monitor current time for segment playback stopping
  useEffect(() => {
    if (
      enableSegmentPlayback &&
      playbackRange &&
      isPlaying &&
      wavesurferInstance
    ) {
      intervalRef.current = setInterval(() => {
        const currentWavesurferTime = wavesurferInstance.getCurrentTime();
        if (currentWavesurferTime >= playbackRange.end) {
          wavesurferInstance.pause();
          setIsPlaying(false);
        }
      }, 100); // Check every 100ms for precision

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [
    enableSegmentPlayback,
    playbackRange,
    isPlaying,
    wavesurferInstance,
    setIsPlaying,
  ]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onSeek || !duration) return;

      try {
        const seekTo = parseFloat(e.target.value);
        onSeek(seekTo);
      } catch (error) {
        console.error("Error during seek:", error);
      }
    },
    [duration, onSeek]
  );

  const handlePlayPause = () => {
    posthog.capture("audio_controls_play_pause", {
      is_playing: isPlaying,
      has_playback_range: !!playbackRange,
      playback_start: playbackRange?.start,
      playback_end: playbackRange?.end,
      enable_segment_playback: enableSegmentPlayback,
    });
    handlePlayPauseClick();
  };

  const displayCurrentTime = playbackRange
    ? Math.max(currentTime, playbackRange.start)
    : currentTime;

  // const displayDuration = playbackRange
  //   ? playbackRange.end
  //   : duration;

  const seekMin = playbackRange?.start || 0;
  const seekMax = playbackRange?.end || duration || 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePlayPause}
          disabled={isLoading || !!error || disabled}
          className="gap-2"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      </div>

      {showSeekbar && (
        <div className="flex-1 flex items-center gap-2">
          <span className="text-sm text-gray-600 min-w-0">
            {formatTime(displayCurrentTime)}
          </span>
          <input
            type="range"
            min={seekMin}
            step="0.01"
            max={seekMax}
            value={Math.max(Math.min(currentTime, seekMax), seekMin)}
            onChange={handleSeek}
            className="flex-1"
            disabled={!onSeek || disabled}
          />
          <span className="text-sm text-gray-600 min-w-0">
            {playbackRange
              ? `${formatTime(playbackRange.end)}`
              : formatTime(duration)}
          </span>
        </div>
      )}

      {!showSeekbar && playbackRange && (
        <span className="text-sm text-gray-600">
          {formatTime(playbackRange.start)} - {formatTime(playbackRange.end)}{" "}
          (Duration: {formatTime(playbackRange.end - playbackRange.start, true)}
          )
        </span>
      )}
    </div>
  );
};

export default AudioControls;
