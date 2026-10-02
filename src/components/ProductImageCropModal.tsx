import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Minus, Plus, RotateCcw, X } from 'lucide-react';

interface ProductImageCropModalProps {
  file: File;
  onCancel: () => void;
  onApply: (file: File) => Promise<void>;
}

const FRAME_WIDTH = 320;
const FRAME_HEIGHT = 400;

export const ProductImageCropModal: React.FC<ProductImageCropModalProps> = ({ file, onCancel, onApply }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isApplying, setIsApplying] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const frameRef = useRef<HTMLDivElement>(null);
  const dragOrigin = useRef<{ x: number; y: number; imageX: number; imageY: number } | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
    setImage(null);
    setZoom(1);
    const source = new Image();
    source.onload = () => {
      setImage(source);
      const scale = Math.max(FRAME_WIDTH / source.naturalWidth, FRAME_HEIGHT / source.naturalHeight);
      setPosition({
        x: (FRAME_WIDTH - source.naturalWidth * scale) / 2,
        y: (FRAME_HEIGHT - source.naturalHeight * scale) / 2
      });
    };
    source.src = objectUrl;
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const getImageSize = () => {
    if (!image) return { width: FRAME_WIDTH, height: FRAME_HEIGHT };
    const scale = Math.max(FRAME_WIDTH / image.naturalWidth, FRAME_HEIGHT / image.naturalHeight) * zoom;
    return { width: image.naturalWidth * scale, height: image.naturalHeight * scale };
  };

  const moveImage = (x: number, y: number, targetZoom = zoom) => {
    if (!image) return;
    const scale = Math.max(FRAME_WIDTH / image.naturalWidth, FRAME_HEIGHT / image.naturalHeight) * targetZoom;
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    setPosition({
      x: Math.min(0, Math.max(FRAME_WIDTH - width, x)),
      y: Math.min(0, Math.max(FRAME_HEIGHT - height, y))
    });
  };

  const changeZoom = (nextZoom: number) => {
    const boundedZoom = Math.min(3, Math.max(1, nextZoom));
    const centerX = FRAME_WIDTH / 2;
    const centerY = FRAME_HEIGHT / 2;
    const ratio = boundedZoom / zoom;
    setZoom(boundedZoom);
    moveImage(centerX - (centerX - position.x) * ratio, centerY - (centerY - position.y) * ratio, boundedZoom);
  };

  const handleApply = async () => {
    if (!image) return;
    setIsApplying(true);
    const scale = Math.max(FRAME_WIDTH / image.naturalWidth, FRAME_HEIGHT / image.naturalHeight) * zoom;
    const sourceX = -position.x / scale;
    const sourceY = -position.y / scale;
    const sourceWidth = FRAME_WIDTH / scale;
    const sourceHeight = FRAME_HEIGHT / scale;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1500;
    const context = canvas.getContext('2d');
    if (!context) {
      setIsApplying(false);
      return;
    }
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) {
        setIsApplying(false);
        return;
      }
      void onApply(new File([blob], file.name.replace(/\.[^.]+$/, '') + '-cropped.jpg', { type: 'image/jpeg' }))
        .finally(() => setIsApplying(false));
    }, 'image/jpeg', 0.92);
  };

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOrigin.current = { x: event.clientX, y: event.clientY, imageX: position.x, imageY: position.y };
  };

  const drag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragOrigin.current || !frameRef.current) return;
    const bounds = frameRef.current.getBoundingClientRect();
    const factor = FRAME_WIDTH / bounds.width;
    moveImage(
      dragOrigin.current.imageX + (event.clientX - dragOrigin.current.x) * factor,
      dragOrigin.current.imageY + (event.clientY - dragOrigin.current.y) * factor
    );
  };

  const stopDrag = () => {
    dragOrigin.current = null;
  };

  const size = getImageSize();
  const previewScale = frameRef.current ? frameRef.current.clientWidth / FRAME_WIDTH : 1;

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onCancel}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-5" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-heading font-bold text-base text-[#1A1A1A]">Adjust product image</h2>
            <p className="text-xs text-gray-500 mt-1">Drag to reposition, then crop to the store image frame.</p>
          </div>
          <button type="button" onClick={onCancel} title="Close crop editor" className="p-1.5 text-gray-500 hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          ref={frameRef}
          className="relative mx-auto w-full max-w-[320px] aspect-4/5 overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={startDrag}
          onPointerMove={drag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
        >
          {image && (
            <img
              src={imageUrl}
              alt="Image crop preview"
              draggable={false}
              className="absolute max-w-none select-none pointer-events-none"
              style={{
                width: size.width * previewScale,
                height: size.height * previewScale,
                left: position.x * previewScale,
                top: position.y * previewScale
              }}
            />
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button type="button" onClick={() => changeZoom(zoom - 0.1)} title="Zoom out" className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(event) => changeZoom(Number(event.target.value))}
            aria-label="Image zoom"
            className="flex-1 accent-[#8A6D1F]"
          />
          <button type="button" onClick={() => changeZoom(zoom + 0.1)} title="Zoom in" className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => { setZoom(1); if (image) { const scale = Math.max(FRAME_WIDTH / image.naturalWidth, FRAME_HEIGHT / image.naturalHeight); setPosition({ x: (FRAME_WIDTH - image.naturalWidth * scale) / 2, y: (FRAME_HEIGHT - image.naturalHeight * scale) / 2 }); } }}
            title="Reset crop"
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button type="button" onClick={onCancel} className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-black">Cancel</button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!image || isApplying}
            className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {isApplying && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Use this crop</span>
          </button>
        </div>
      </div>
    </div>
  );
};
