"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface AudioPlayerListeningProps {
  audioUrl?: string;
  transcript?: string;
  isGraded?: boolean;
}

/**
 * Trình phát âm thanh cho phần thi Listening KET (Part 10–14)
 * Hỗ trợ phát audio, tua lại 5 giây, điều chỉnh âm lượng, và mở transcript sau khi nộp bài
 */
export function AudioPlayerListening({
  audioUrl,
  transcript,
  isGraded = false,
}: AudioPlayerListeningProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const rewind5s = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = target;
      setCurrentTime(target);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  if (!audioUrl) return null;

  return (
    <div className="bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg p-4 shadow-sm space-y-3">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Nút Play / Pause & Tua 5s */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Tạm dừng audio" : "Phát audio"}
            className="w-11 h-11 rounded-full bg-[var(--color-navy)] hover:opacity-95 text-white flex items-center justify-center transition-all shadow-sm"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={rewind5s}
            aria-label="Tua lại 5 giây"
            className="w-9 h-9 rounded-full border border-[var(--border-subtle)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-primary)] flex items-center justify-center transition-all"
            title="Tua lại 5 giây"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-semibold text-[var(--text-primary)] ml-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Thanh trượt tiến độ */}
        <div className="flex-1 max-w-md flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Tiến độ phát audio"
            className="w-full accent-[var(--color-navy)] h-2 rounded-lg cursor-pointer bg-slate-200 dark:bg-slate-700"
          />
        </div>

        {/* Nút xem Transcript (chỉ hiện khi đã nộp bài) */}
        {isGraded && transcript && (
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="min-h-[44px] px-3.5 py-1.5 rounded-lg border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 text-xs font-bold flex items-center gap-1.5 hover:bg-sky-100 transition-all shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>Lời thoại (Transcript)</span>
            {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Khối hiển thị Lời thoại Transcript */}
      {showTranscript && transcript && (
        <div className="mt-3 p-4 rounded-lg bg-[var(--surface-bg)] border border-sky-200 dark:border-sky-900 text-xs leading-relaxed text-[var(--text-primary)] whitespace-pre-line space-y-2">
          <p className="font-bold text-[var(--color-navy)] dark:text-sky-300 uppercase tracking-wide">
            Audio Script / Transcript:
          </p>
          <div className="font-sans font-medium text-slate-800 dark:text-slate-200">
            {transcript}
          </div>
        </div>
      )}
    </div>
  );
}
