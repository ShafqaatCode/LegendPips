import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiCamera, FiRefreshCw, FiCheck } from 'react-icons/fi';
import {
  KycUploadCard,
  KycUploadHeader,
  KycPreviewArea,
  KycStatusBadge,
  KycActions,
  KycActionBtn,
  KycErrorNote,
  KycPlaceholder,
} from './kycUploadStyles';

export interface LiveCameraCaptureProps {
  label: string;
  hint?: string;
  fileName: string;
  facingMode?: 'user' | 'environment';
  value: File | null;
  previewUrl?: string | null;
  onChange: (file: File | null, previewUrl: string | null) => void;
}

async function requestCameraStream(facingMode: 'user' | 'environment'): Promise<MediaStream> {
  const constraints: MediaStreamConstraints = {
    video: {
      facingMode: { ideal: facingMode },
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  };

  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  }
}

const LiveCameraCapture: React.FC<LiveCameraCaptureProps> = ({
  label,
  hint,
  fileName,
  facingMode = 'environment',
  value,
  previewUrl,
  onChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [starting, setStarting] = useState(false);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError('');
    setStarting(true);
    try {
      stopCamera();

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera not supported');
      }

      const stream = await requestCameraStream(facingMode);
      streamRef.current = stream;
      setActive(true);
    } catch {
      setCameraError('Could not access camera. Allow camera permission and try again.');
      setActive(false);
    } finally {
      setStarting(false);
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    if (!active) return;

    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return;

    video.srcObject = stream;
    video.play().catch(() => {
      setCameraError('Could not start camera preview. Try again.');
      stopCamera();
    });

    return () => {
      video.srcObject = null;
    };
  }, [active, stopCamera]);

  const capturePhoto = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    stopCamera();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.92)
    );
    if (!blob) return;

    const file = new File([blob], `${fileName}.jpg`, { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    onChange(file, url);
  }, [fileName, onChange, stopCamera]);

  const retake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    onChange(null, null);
    startCamera();
  };

  useEffect(() => () => {
    stopCamera();
  }, [stopCamera]);

  const hasCapture = !!value && !!previewUrl;

  return (
    <KycUploadCard>
      <KycUploadHeader>
        <div className="meta">
          <strong>{label}</strong>
          {hint && <span>{hint}</span>}
        </div>
      </KycUploadHeader>

      <KycPreviewArea>
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          style={{ display: active && !hasCapture ? 'block' : 'none' }}
        />
        {hasCapture ? (
          <>
            <img src={previewUrl!} alt={label} />
            <KycStatusBadge><FiCheck /> Captured</KycStatusBadge>
          </>
        ) : !active ? (
          <KycPlaceholder>
            <FiCamera />
            <div>Live camera capture required</div>
          </KycPlaceholder>
        ) : null}
      </KycPreviewArea>

      {cameraError && <KycErrorNote>{cameraError}</KycErrorNote>}

      <KycActions>
        {!hasCapture && !active && (
          <KycActionBtn type="button" $primary onClick={startCamera} disabled={starting}>
            <FiCamera /> {starting ? 'Starting…' : 'Open Camera'}
          </KycActionBtn>
        )}
        {active && !hasCapture && (
          <>
            <KycActionBtn type="button" $success onClick={capturePhoto}>
              <FiCamera /> Capture
            </KycActionBtn>
            <KycActionBtn type="button" onClick={stopCamera}>
              Cancel
            </KycActionBtn>
          </>
        )}
        {hasCapture && (
          <KycActionBtn type="button" onClick={retake}>
            <FiRefreshCw /> Retake
          </KycActionBtn>
        )}
      </KycActions>
    </KycUploadCard>
  );
};

export default LiveCameraCapture;
