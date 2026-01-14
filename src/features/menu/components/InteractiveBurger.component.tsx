'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

type BurgerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

interface InteractiveBurgerProps {
  framesPath: string;
  frameNamePrefix: string;
  totalFrames?: number;
  maxFrames?: number;
  autoRotateSpeed?: number;
  dragSensitivity?: number;
  friction?: number;
  size?: BurgerSize;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_TOTAL_FRAMES = 151;
const DEFAULT_AUTO_ROTATE_SPEED = 0.5;
const DEFAULT_DRAG_SENSITIVITY = 0.3;
const DEFAULT_FRICTION = 0.95;
const DEFAULT_SIZE: BurgerSize = 'md';

const SIZE_MAP: Record<BurgerSize, { width: string; height: string }> = {
  xs: {
    width: 'clamp(120px, 20vw, 200px)',
    height: 'clamp(120px, 20vw, 200px)',
  },
  sm: {
    width: 'clamp(160px, 28vw, 280px)',
    height: 'clamp(160px, 28vw, 280px)',
  },
  md: {
    width: 'clamp(200px, 35vw, 350px)',
    height: 'clamp(200px, 35vw, 350px)',
  },
  lg: {
    width: 'clamp(300px, 50vw, 500px)',
    height: 'clamp(300px, 50vw, 500px)',
  },
  xl: {
    width: 'clamp(400px, 65vw, 700px)',
    height: 'clamp(400px, 65vw, 700px)',
  },
  '2xl': {
    width: 'clamp(500px, 80vw, 900px)',
    height: 'clamp(500px, 80vw, 900px)',
  },
  '3xl': {
    width: 'clamp(600px, 90vw, 1100px)',
    height: 'clamp(600px, 90vw, 1100px)',
  },
};

export const InteractiveBurger: React.FC<InteractiveBurgerProps> = ({
  framesPath,
  frameNamePrefix,
  totalFrames = DEFAULT_TOTAL_FRAMES,
  maxFrames,
  autoRotateSpeed,
  dragSensitivity,
  friction = DEFAULT_FRICTION,
  size = DEFAULT_SIZE,
  className,
  style,
}) => {
  const sizeStyles = SIZE_MAP[size];
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  const containerRef = useRef<HTMLDivElement | undefined>(undefined);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastPositionRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const frameIndexRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  const frameIndices = useMemo((): number[] => {
    if (!maxFrames || maxFrames >= totalFrames) {
      return Array.from({ length: totalFrames }, (_, i) => i);
    }

    const step = totalFrames / maxFrames;
    const indices: number[] = [];

    for (let i = 0; i < maxFrames; i++) {
      const frameIndex = Math.floor(i * step);
      indices.push(frameIndex);
    }

    return indices;
  }, [totalFrames, maxFrames]);

  const effectiveFrameCount = frameIndices.length;

  const calculatedRotateSpeed = useMemo(() => {
    if (autoRotateSpeed !== undefined) {
      return autoRotateSpeed;
    }
    return (DEFAULT_AUTO_ROTATE_SPEED / DEFAULT_TOTAL_FRAMES) * effectiveFrameCount;
  }, [autoRotateSpeed, effectiveFrameCount]);

  const calculatedDragSensitivity = useMemo(() => {
    if (dragSensitivity !== undefined) {
      return dragSensitivity;
    }
    return DEFAULT_DRAG_SENSITIVITY * (DEFAULT_TOTAL_FRAMES / effectiveFrameCount);
  }, [dragSensitivity, effectiveFrameCount]);

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises: Promise<HTMLImageElement>[] = [];
      
      for (const frameIndex of frameIndices) {
        const frameNumber = (frameIndex + 1).toString().padStart(4, '0');
        const imagePath = `${framesPath}/${frameNamePrefix}_${frameNumber}.png`;
        
        const img = new Image();
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = () => {
            console.warn(`Failed to load frame ${frameNumber}`);
            resolve(img);
          };
          img.src = imagePath;
        });
        
        imagePromises.push(promise);
      }
      
      try {
        const loadedImages = await Promise.all(imagePromises);
        setImages(loadedImages);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error loading burger frames:', error);
      }
    };

    loadImages();
  }, [framesPath, frameNamePrefix, frameIndices]);

  const normalizeFrameIndex = useCallback((index: number): number => {
    let normalized = index % effectiveFrameCount;
    if (normalized < 0) {
      normalized += effectiveFrameCount;
    }
    return Math.floor(normalized);
  }, [effectiveFrameCount]);

  const getPosition = useCallback((e: TouchEvent | MouseEvent): number => {
    if ('touches' in e && e.touches.length > 0) {
      return e.touches[0].clientX;
    }
    if ('clientX' in e) {
      return e.clientX;
    }
    return 0;
  }, []);

  const handleStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    isDraggingRef.current = true;
    velocityRef.current = 0;
    const position = getPosition(e.nativeEvent);
    lastPositionRef.current = position;
    lastTimeRef.current = performance.now();
  }, [getPosition]);

  const handleMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    e.preventDefault();
    const currentPosition = getPosition(e);
    const deltaX = currentPosition - lastPositionRef.current;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;
    
    if (deltaTime > 0) {
      velocityRef.current = (deltaX / deltaTime) * 16;
    }
    
    const frameDelta = deltaX / calculatedDragSensitivity;
    frameIndexRef.current = frameIndexRef.current + frameDelta;
    
    const normalizedIndex = normalizeFrameIndex(frameIndexRef.current);
    setCurrentFrame(normalizedIndex);
    
    lastPositionRef.current = currentPosition;
    lastTimeRef.current = currentTime;
  }, [calculatedDragSensitivity, normalizeFrameIndex, getPosition]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const animate = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTimeRef.current;
      
      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.01) {
          frameIndexRef.current += velocityRef.current;
          velocityRef.current *= friction;
        } else {
          frameIndexRef.current += calculatedRotateSpeed;
        }
      }
      
      const normalizedIndex = normalizeFrameIndex(frameIndexRef.current);
      setCurrentFrame(normalizedIndex);
      
      lastTimeRef.current = currentTime;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [imagesLoaded, friction, calculatedRotateSpeed, normalizeFrameIndex]);

  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      handleMove(e);
    };

    const handleGlobalEnd = () => {
      handleEnd();
    };

    window.addEventListener('mousemove', handleGlobalMove);
    window.addEventListener('mouseup', handleGlobalEnd);
    window.addEventListener('touchmove', handleGlobalMove, { passive: false });
    window.addEventListener('touchend', handleGlobalEnd);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  const currentImage = images[currentFrame];

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={className}
      style={{
        position: 'relative',
        width: sizeStyles.width,
        height: sizeStyles.height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        ...style,
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      {imagesLoaded && currentImage ? (
        <img
          src={currentImage.src}
          alt="Interactive Burger"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            pointerEvents: 'none',
            imageRendering: 'auto',
          }}
          draggable={false}
        />
      ) : (
        <div
          style={{
            width: '200px',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ddd9dc',
            fontSize: '1rem',
          }}
        >
          Loading...
        </div>
      )}
    </div>
  );
};

