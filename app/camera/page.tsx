'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FILTER_PRESETS,
  getFilterPreset,
  getLayoutOption,
  type FilterId,
} from '@/lib/photobooth';
import { usePhotoboothStore } from '@/lib/store';

type CameraOption = {
  id: string;
  label: string;
};

type CaptureMode = 'manual' | 'automatic';

const AUTO_FRONT_CAMERA = 'auto-front';
const AUTO_BACK_CAMERA = 'auto-back';
const COUNTDOWN_SECONDS = 3;

const buildCameraOptions = (devices: MediaDeviceInfo[]): CameraOption[] => [
  { id: AUTO_FRONT_CAMERA, label: 'Front camera' },
  { id: AUTO_BACK_CAMERA, label: 'Back camera' },
  ...devices
    .filter((device) => device.kind === 'videoinput')
    .map((device, index) => ({
      id: device.deviceId,
      label: device.label || `Camera ${index + 1}`,
    })),
];

export default function CameraPage() {
  const router = useRouter();
  const {
    selectedLayout,
    activeFilterId,
    capturedPhotos,
    addPhoto,
    retakePhotoId,
    completePhotoRetake,
    clearRetake,
    removeLastPhoto,
    setActiveFilterId,
    setSessionStage,
  } = usePhotoboothStore();
  const layout = getLayoutOption(selectedLayout);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const captureTimeoutRef = useRef<number | null>(null);
  const countdownActiveRef = useRef(false);
  const autoSequenceRef = useRef(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [countdownProgress, setCountdownProgress] = useState(1);
  const [showFlash, setShowFlash] = useState(false);
  const [captureMode, setCaptureMode] = useState<CaptureMode>('automatic');
  const [cameraOptions, setCameraOptions] = useState<CameraOption[]>([
    { id: AUTO_FRONT_CAMERA, label: 'Front camera' },
    { id: AUTO_BACK_CAMERA, label: 'Back camera' },
  ]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>(AUTO_FRONT_CAMERA);

  const syncCameraOptions = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const nextOptions = buildCameraOptions(devices);
      setCameraOptions(nextOptions);

      const selectedStillExists = nextOptions.some(
        (option) => option.id === selectedCameraId
      );

      if (!selectedStillExists) {
        setSelectedCameraId(AUTO_FRONT_CAMERA);
      }
    } catch (error) {
      console.error(error);
    }
  }, [selectedCameraId]);

  const handleRefreshCameras = async () => {
    await syncCameraOptions();
  };

  const clearCountdownTimers = useCallback(() => {
    if (progressIntervalRef.current !== null) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    if (countdownIntervalRef.current !== null) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    if (captureTimeoutRef.current !== null) {
      window.clearTimeout(captureTimeoutRef.current);
      captureTimeoutRef.current = null;
    }

    countdownActiveRef.current = false;
  }, []);

  useEffect(() => {
    if (!layout) {
      router.replace('/dashboard');
      return;
    }

    let cancelled = false;

    const initializeCamera = async () => {
      setCameraReady(false);
      setCameraError(null);

      try {
        await syncCameraOptions();
        streamRef.current?.getTracks().forEach((track) => track.stop());

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video:
            selectedCameraId === AUTO_FRONT_CAMERA
              ? {
                  facingMode: 'user',
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                }
              : selectedCameraId === AUTO_BACK_CAMERA
                ? {
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                  }
                : {
                    deviceId: { exact: selectedCameraId },
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                  },
          audio: false,
        });

        if (cancelled) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = mediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setCameraReady(true);
        }

        await syncCameraOptions();
        window.setTimeout(() => {
          if (!cancelled) {
            void syncCameraOptions();
          }
        }, 350);
      } catch (error) {
        console.error(error);
        setCameraError('Camera access was blocked. You can still use sample shots below.');
      }
    };

    initializeCamera();
    setSessionStage('camera');

    const handleDeviceChange = async () => {
      try {
        await syncCameraOptions();
      } catch (error) {
        console.error(error);
      }
    };

    const handleWindowFocus = () => {
      void syncCameraOptions();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void syncCameraOptions();
      }
    };

    navigator.mediaDevices?.addEventListener?.('devicechange', handleDeviceChange);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      clearCountdownTimers();
      autoSequenceRef.current = false;
      navigator.mediaDevices?.removeEventListener?.('devicechange', handleDeviceChange);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [
    clearCountdownTimers,
    layout,
    router,
    selectedCameraId,
    setSessionStage,
    syncCameraOptions,
  ]);

  useEffect(() => {
    const activeCapturedPhotos = capturedPhotos.filter((photo) => !photo.isDeleted);

    if (layout && retakePhotoId === null && activeCapturedPhotos.length >= layout.captureTarget) {
      router.push('/selection');
    }
  }, [capturedPhotos, layout, retakePhotoId, router]);

  const filterPreset = getFilterPreset(activeFilterId);
  const activeCapturedPhotos = capturedPhotos.filter((photo) => !photo.isDeleted);
  const isCountingDown = countdownValue !== null;
  const isRetakeMode = retakePhotoId !== null;

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!layout || !video || !canvas) {
      return;
    }

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    context.filter = filterPreset.canvasFilter;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.filter = 'none';

    const photoData = {
      dataUrl: canvas.toDataURL('image/jpeg', 0.92),
      filterId: activeFilterId,
    };

    if (retakePhotoId !== null) {
      autoSequenceRef.current = false;
      completePhotoRetake(photoData);
      router.push('/selection');
      return;
    }

    addPhoto(photoData);
    const nextPhotoCount = activeCapturedPhotos.length + 1;

    if (autoSequenceRef.current && nextPhotoCount < layout.captureTarget) {
      window.setTimeout(() => {
        startCaptureCountdown();
      }, 250);
      return;
    }

    autoSequenceRef.current = false;
  };

  const startCaptureCountdown = () => {
    if (!cameraReady || isCountingDown || countdownActiveRef.current) {
      return;
    }

    clearCountdownTimers();
    countdownActiveRef.current = true;
    setCountdownValue(COUNTDOWN_SECONDS);
    setCountdownProgress(1);

    const totalDuration = COUNTDOWN_SECONDS * 1000;
    let elapsedMs = 0;

    progressIntervalRef.current = window.setInterval(() => {
      elapsedMs += 16;
      const nextProgress = Math.max(1 - elapsedMs / totalDuration, 0);
      setCountdownProgress(nextProgress);
    }, 16);

    countdownIntervalRef.current = window.setInterval(() => {
      setCountdownValue((currentValue) => {
        if (currentValue === null) {
          return null;
        }

        if (currentValue <= 1) {
          clearCountdownTimers();
          setCountdownProgress(0);
          captureTimeoutRef.current = window.setTimeout(() => {
            setShowFlash(true);
            window.setTimeout(() => setShowFlash(false), 180);
            captureFrame();
            setCountdownValue(null);
            setCountdownProgress(1);
            captureTimeoutRef.current = null;
          }, 90);
          return null;
        }

        return currentValue - 1;
      });
    }, 1000);
  };

  if (!layout) {
    return null;
  }

  const remainingShots =
    retakePhotoId !== null
      ? 1
      : Math.max(layout.captureTarget - activeCapturedPhotos.length, 0);
  const canContinue = activeCapturedPhotos.length >= layout.slots;

  const addSampleShot = () => {
    const colorMap: Record<FilterId, string> = {
      original: '#f59e0b',
      bw: '#475569',
      sepia: '#92400e',
      cool: '#0ea5e9',
    };
    const shotNumber = capturedPhotos.length + 1;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${colorMap[activeFilterId]}"/>
            <stop offset="100%" stop-color="#111827"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="900" fill="url(#bg)"/>
        <circle cx="230" cy="220" r="110" fill="rgba(255,255,255,0.18)"/>
        <circle cx="980" cy="160" r="70" fill="rgba(255,255,255,0.12)"/>
        <text x="80" y="140" fill="white" font-size="64" font-family="Arial">Snapybara Demo</text>
        <text x="80" y="250" fill="white" font-size="120" font-family="Arial" font-weight="bold">Shot ${shotNumber}</text>
        <text x="80" y="350" fill="white" font-size="48" font-family="Arial">Filter: ${filterPreset.label}</text>
        <text x="80" y="780" fill="white" font-size="36" font-family="Arial">Use these to test selection, design, and download without a live camera.</text>
      </svg>
    `;

    addPhoto({
      dataUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
      filterId: activeFilterId,
    });
  };

  return (
    <main className="min-h-screen px-3 py-5 sm:px-4 md:px-6 md:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-5">
        <div className="flex flex-col gap-3 text-center text-white">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Step 2</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            {isRetakeMode ? 'Retake photo' : 'Camera capture'}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/80 sm:gap-3 sm:text-sm">
            <span className="rounded-full bg-black/35 px-3 py-2 backdrop-blur-sm sm:px-4">
              {cameraReady ? 'Camera ready' : 'Connecting camera...'}
            </span>
            <span className="rounded-full bg-black/35 px-3 py-2 backdrop-blur-sm sm:px-4">
              {capturedPhotos.length} / {layout.captureTarget} captured
            </span>
            <span className="rounded-full bg-black/35 px-3 py-2 backdrop-blur-sm sm:px-4">
              {isRetakeMode ? '1 replacement shot' : `${remainingShots} shots left`}
            </span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-3 flex flex-col gap-2 rounded-[1.25rem] bg-black/30 p-3 text-xs text-white backdrop-blur-sm sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-4 sm:py-3 sm:text-sm">
            <div className="flex flex-col gap-2 sm:flex-1">
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-sky-300 sm:text-xs">
                Camera source
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={selectedCameraId}
                  onChange={(event) => setSelectedCameraId(event.target.value)}
                  className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/12 px-3 py-2.5 text-sm text-white outline-none backdrop-blur-sm transition focus:border-sky-300 sm:min-w-56 sm:px-4 sm:py-3"
                >
                  {cameraOptions.map((option) => (
                    <option key={option.id} value={option.id} className="text-slate-950">
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => void handleRefreshCameras()}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/18 sm:px-4 sm:py-3 sm:text-xs"
                >
                  Refresh
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:min-w-56">
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-sky-300 sm:text-xs">
                Capture mode
              </span>
              <div className="grid grid-cols-2 gap-2 rounded-full bg-white/8 p-1">
                {(['manual', 'automatic'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setCaptureMode(mode);
                      if (mode === 'manual') {
                        autoSequenceRef.current = false;
                      }
                    }}
                    className={`rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition sm:text-xs ${
                      captureMode === mode
                        ? 'bg-amber-300 text-slate-950'
                        : 'bg-transparent text-white hover:bg-white/10'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] bg-black shadow-[0_28px_70px_rgba(0,0,0,0.35)] sm:rounded-[2.4rem]">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`aspect-[4/5] w-full object-cover sm:aspect-video ${
                filterPreset.previewClassName ? filterPreset.previewClassName : ''
              }`}
            />
            <canvas ref={canvasRef} className="hidden" />

            {showFlash ? (
              <div className="pointer-events-none absolute inset-0 z-30 bg-white/55 animate-pulse" />
            ) : null}

            {isCountingDown ? (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-black/28 backdrop-blur-sm sm:h-36 sm:w-36">
                  <svg
                    className="-rotate-90 absolute inset-0 h-full w-full"
                    viewBox="0 0 120 120"
                    aria-hidden="true"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="rgba(255,255,255,0.22)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="white"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={314.159}
                      strokeDashoffset={314.159 * (1 - countdownProgress)}
                      transform="scale(-1, 1) translate(-120, 0)"
                    />
                  </svg>
                  <span className="text-5xl font-semibold text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] sm:text-6xl">
                    {countdownValue}
                  </span>
                </div>
              </div>
            ) : null}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/92 via-black/45 to-transparent sm:h-44 sm:from-black/85 sm:via-black/35" />

            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 md:p-6">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={removeLastPhoto}
                  disabled={capturedPhotos.length === 0}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white backdrop-blur-sm transition hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-40 sm:h-14 sm:w-14 sm:text-xl"
                  aria-label="Remove last shot"
                >
                  ↺
                </button>
                <button
                  onClick={() => {
                    if (captureMode === 'automatic' && !isRetakeMode) {
                      autoSequenceRef.current = true;
                    }

                    startCaptureCountdown();
                  }}
                  disabled={!cameraReady || isCountingDown}
                  className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-amber-400 text-2xl text-slate-950 shadow-[0_12px_30px_rgba(251,191,36,0.35)] transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:border-slate-500 disabled:bg-slate-700 disabled:text-slate-400 sm:h-20 sm:w-20 sm:text-3xl"
                  aria-label="Take photo"
                >
                  ⬤
                </button>
                <button
                  onClick={addSampleShot}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white backdrop-blur-sm transition hover:bg-white/18 sm:h-14 sm:w-14 sm:text-xl"
                  aria-label="Add sample shot"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {cameraError ? (
          <p className="mx-auto max-w-4xl rounded-2xl bg-rose-500/12 px-4 py-3 text-center text-sm text-rose-100 backdrop-blur-sm">
            {cameraError}
          </p>
        ) : null}

        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-sky-300 sm:text-xs">
            Filters
          </p>
          <div className="flex w-full gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
            {FILTER_PRESETS.map((filter) => {
              const isSelected = activeFilterId === filter.id;

              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilterId(filter.id)}
                  className="flex min-w-14 flex-col items-center gap-2"
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full border text-[10px] font-semibold transition sm:h-14 sm:w-14 ${
                      isSelected
                        ? 'border-amber-300 bg-amber-300 text-slate-950 shadow-[0_0_0_6px_rgba(252,211,77,0.16)]'
                        : 'border-white/20 bg-black/30 text-white hover:bg-black/40'
                    } ${
                      filter.id === 'bw'
                        ? 'grayscale'
                        : filter.id === 'sepia'
                          ? 'sepia'
                          : filter.id === 'cool'
                            ? 'saturate-125 hue-rotate-15'
                            : ''
                    }`}
                  >
                    {filter.label.slice(0, 3)}
                  </span>
                  <span
                    className={`text-[10px] font-medium sm:text-[11px] ${
                      isSelected ? 'text-amber-200' : 'text-white/80'
                    }`}
                  >
                    {filter.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-between">
          <button
            onClick={() => {
              clearRetake();
              router.push(isRetakeMode ? '/selection' : '/dashboard');
            }}
            className="w-full rounded-full border border-white/20 bg-black/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-black/40 sm:w-auto"
          >
            {isRetakeMode ? 'Back to selection' : 'Back'}
          </button>
          <button
            onClick={() => router.push('/selection')}
            disabled={!canContinue}
            className="w-full rounded-full border border-sky-300/60 bg-sky-400/10 px-6 py-3 text-sm font-semibold text-sky-100 backdrop-blur-sm transition hover:bg-sky-300/10 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
