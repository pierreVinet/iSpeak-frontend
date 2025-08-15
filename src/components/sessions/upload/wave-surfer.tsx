"use client";
import { Loader2 } from "lucide-react";
import { useWavesurfer } from "@wavesurfer/react";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { AnalysisSegmentData, WaveSurferWithRegionsProps } from "@/types";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import AudioControls from "./audio-controls";
import { useFileUpload } from "@/contexts/file-upload";
import posthog from "posthog-js";

const WaveSurfer = ({
  audioUrl,
  setError,
  setIsLoading,
  isLoading,
  error,
  onRegionUpdate,
  selectedRange,
  analysisSegments,
  setDuration,
  duration,
}: WaveSurferWithRegionsProps) => {
  const wavesurferRef = useRef(null);
  const {
    setWavesurferInstance,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
  } = useFileUpload();

  const regionsPlugin = useMemo(() => RegionsPlugin.create(), []);
  const plugins = useMemo(() => [regionsPlugin], [regionsPlugin]);

  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();

  const primaryWithOpacity = primaryColor
    .replace("oklch(", "oklch(")
    .replace(")", " / 0.6)");

  const {
    wavesurfer,
    isReady,
    currentTime: wavesurferCurrentTime,
  } = useWavesurfer({
    container: wavesurferRef,
    height: 150,
    waveColor: primaryWithOpacity,
    progressColor: primaryWithOpacity,
    cursorColor: "#1e40af",
    cursorWidth: 2,
    normalize: true,
    interact: true, // Enable interaction for regions
    hideScrollbar: true,
    barRadius: 2,
    url: audioUrl,
    barWidth: 3,
    plugins: plugins,
  });

  useEffect(() => {
    if (wavesurfer && isReady) {
      const totalDuration = wavesurfer.getDuration() || 0;
      setDuration(totalDuration);
      setIsLoading(false);
      setError("");

      // Share the wavesurfer instance
      setWavesurferInstance(wavesurfer);

      wavesurfer.on("finish", () => {
        setIsPlaying(false);
      });

      // Set up region event listeners
      if (regionsPlugin) {
        // Enable drag selection
        regionsPlugin.enableDragSelection({
          color: "var(--color-region)",
        });

        // Listen for region creation/update
        regionsPlugin.on("region-updated", (region: any) => {
          posthog.capture("region_updated", {
            region_id: region.id,
            region_start: region.start,
            region_end: region.end,
          });
          onRegionUpdate(
            {
              start: region.start,
              end: region.end,
              regionId: region.id,
            },
            totalDuration
          );
        });

        regionsPlugin.on("region-created", (region: any) => {
          posthog.capture("region_created", {
            region_id: region.id,
            region_start: region.start,
            region_end: region.end,
          });
          // Clear any existing regions to allow only one active region
          const regions = regionsPlugin.getRegions();
          const selectRegions = regions.filter((r) =>
            r.id.startsWith("region-")
          );
          selectRegions.forEach((r: any) => {
            if (r.id !== region.id) {
              r.remove();
            }
          });

          const isFixedRegion = region.id.startsWith("fix-region-");
          if (!isFixedRegion) {
            onRegionUpdate(
              {
                start: region.start,
                end: region.end,
                regionId: region.id,
              },
              totalDuration
            );
          }
        });
      }
    }
  }, [isReady, regionsPlugin, onRegionUpdate, setWavesurferInstance]);

  // Sync current time from wavesurfer to context
  useEffect(() => {
    setCurrentTime(wavesurferCurrentTime);
  }, [wavesurferCurrentTime, setCurrentTime]);

  useEffect(() => {
    handleFixedRegion(analysisSegments);
  }, [analysisSegments, isReady]);

  useEffect(() => {
    // remove only the "select" region when user clears the "selected range" control
    if (!selectedRange && regionsPlugin) {
      const regions = regionsPlugin.getRegions();
      const selectRegions = regions.filter((r) => r.id.startsWith("region-"));
      selectRegions.forEach((r: any) => {
        r.remove();
      });
    }
    // create or update "select" region when user controls from the Time input fields
    if (selectedRange && regionsPlugin) {
      const regions = regionsPlugin.getRegions();
      const regionId = selectedRange.regionId;
      if (regionId) {
        const region = regions.find((r) => r.id === regionId);
        if (region) {
          // Update "select" region width without removing/recreating
          region.setOptions({
            start: selectedRange.start,
            end: selectedRange.end,
          });
        } else {
          // Create "select" region when user controls from the Time input fields
          regionsPlugin.addRegion({
            id: selectedRange.regionId,
            start: selectedRange.start,
            end: selectedRange.end,
            color: "var(--color-region)",
            drag: true,
            resize: true,
          });
        }
      }
    }
  }, [selectedRange]);

  /**
   * create and delete fixed regions from analysis segments
   */
  const handleFixedRegion = (analysisSegments: AnalysisSegmentData[]) => {
    if (regionsPlugin && isReady) {
      const regions = regionsPlugin?.getRegions();

      const newSegments = analysisSegments.filter((segment) => {
        return !regions.some((r: any) => r.id === `fix-region-${segment.id}`);
      });

      const deletedSegments = regions.filter((region: any) => {
        return !analysisSegments.some(
          (s: any) => `fix-region-${s.id}` === region.id
        );
      });

      deletedSegments.forEach((segment: any) => {
        segment.remove();
      });

      newSegments.forEach((segment) => {
        createFixedRegion(segment);
      });
    }
  };

  const createFixedRegion = (analysisSegment: AnalysisSegmentData) => {
    // Create HTML element for region content
    const contentElement = document.createElement("div");
    contentElement.className = "region-content";
    contentElement.style.cssText = `
      padding: 2px 2px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 500;
      pointer-events: none;
      z-index: 10;
    `;
    contentElement.textContent = analysisSegment.name;

    regionsPlugin.addRegion({
      id: `fix-region-${analysisSegment.id}`,
      start: analysisSegment.timeRange.start,
      end: analysisSegment.timeRange.end,
      color:
        analysisSegment.type === "acoustic"
          ? "rgba(168, 85, 247, 0.2)"
          : analysisSegment.type === "intelligibility"
          ? "rgba(34, 197, 94, 0.2)"
          : "rgba(0, 0, 130, 0.2)",
      content: contentElement,
      drag: false,
      resize: false,
    });
  };

  const handlePlayPause = useCallback(() => {
    if (!wavesurfer) return;

    posthog.capture("play_pause_button_clicked", {
      is_playing: isPlaying,
    });
    try {
      if (isPlaying) {
        wavesurfer.pause();
        setIsPlaying(false);
      } else {
        wavesurfer.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error during play/pause:", error);
    }
  }, [wavesurfer, isPlaying, setIsPlaying]);

  const handleSeek = useCallback(
    (time: number) => {
      if (!wavesurfer || !duration) return;

      try {
        const normalizedSeek = time / duration;
        wavesurfer.seekTo(normalizedSeek);
      } catch (error) {
        console.error("Error during seek:", error);
      }
    },
    [duration, wavesurfer]
  );

  return (
    <>
      <div className="relative bg-muted/30 rounded-lg p-4 h-[182px]">
        <div className="cursor-crosshair" ref={wavesurferRef} />
        {!isReady && (
          <div className="absolute top-0 left-0 text-sm text-gray-600 flex items-center justify-center h-full w-full">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}
      </div>

      {/* Audio Controls */}
      <AudioControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        isLoading={isLoading}
        error={error}
        onPlayPause={handlePlayPause}
        onSeek={handleSeek}
      />
    </>
  );
};

export default WaveSurfer;
