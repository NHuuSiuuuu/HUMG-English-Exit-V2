"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, RotateCcw, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface AudioPlayerListeningProps {
  audioUrl?: string;
  transcript?: string;
  isGraded?: boolean;
}

/**
 * Trình phát âm thanh cho phần Listening chuẩn phong cách TADR OU:
 * Thanh bo cong mềm mại với tông màu tím sang trọng (giống hình mẫu 3), thanh tua mượt mà
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
    <div className="space-y-2">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Thanh Audio Player Tím Sang Trọng giống TADR OU */}
      <div className="bg-[#38114f] dark:bg-[#280c38] text-white rounded-xl px-4 py-3 flex items-center justify-between gap-4 shadow-sm">
        {/* Nút Play / Pause & Tua 5s */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Tạm dừng" : "Phát audio"}
            className="w-8 h-8 rounded-full bg-white text-[#38114f] hover:bg-slate-100 flex items-center justify-center transition-all shadow-sm"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={rewind5s}
            aria-label="Tua lại 5s"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            title="Tua lại 5 giây"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs font-mono font-medium text-white/90">
            {formatTime(currentTime)}
          </span>
        </div>

        {/* Thanh trượt tiến độ mượt mà */}
        <div className="flex-1 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Tiến độ phát audio"
            className="w-full accent-white h-1.5 rounded-lg cursor-pointer bg-white/20 hover:bg-white/30 transition-all"
          />
        </div>

        {/* Tổng thời lượng */}
        <div className="shrink-0 text-xs font-mono font-medium text-white/70">
          {formatTime(duration)}
        </div>
      </div>

      {/* Dòng ghi chú chế độ luyện tập như hình mẫu 3 */}
      <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 px-1">
        <span>Chế độ luyện tập: Bạn có thể tạm dừng, tua và nghe lại không giới hạn.</span>

        {/* Nút xem Transcript sau khi nộp */}
        {isGraded && transcript && (
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-sky-600 dark:text-sky-400 hover:underline font-semibold flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showTranscript ? "Ẩn lời thoại" : "Xem lời thoại (Transcript)"}</span>
            {showTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Khối hiển thị transcript nếu mở */}
      {showTranscript && transcript && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-line space-y-1.5 animate-in fade-in">
          <p className="font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider text-[11px]">
            Audio Script / Transcript:
          </p>
          <div className="font-sans font-normal">{transcript}</div>
        </div>
      )}
    </div>
  );
}
