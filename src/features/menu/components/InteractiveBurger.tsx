'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

type BurgerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

interface InteractiveBurgerProps {
  framesPath: string; // Required: Path to the directory containing frame images (e.g., '/media/burgers/animated/classic/frames')
  frameNamePrefix: string; // Required: Prefix for frame filenames (e.g., 'frame', 'burger', 'classic'). Final format: {prefix}_xxxx.png
  totalFrames?: number;
  maxFrames?: number; // Optional: reduce frame count using consistent formula
  autoRotateSpeed?: number;
  dragSensitivity?: number;
  friction?: number;
  size?: BurgerSize;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_TOTAL_FRAMES = 151;
const DEFAULT_AUTO_ROTATE_SPEED = 0.5; // frames per frame (60fps)
const DEFAULT_DRAG_SENSITIVITY = 0.3; // pixels per frame
const DEFAULT_FRICTION = 0.95; // velocity multiplier per frame
const DEFAULT_SIZE: BurgerSize = 'md';

// Size mapping similar to Tailwind (responsive clamp values)
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
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastPositionRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const frameIndexRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  // Calculate which frames to use based on maxFrames
  // Formula: evenly distribute selected frames across total frames
  const frameIndices = useMemo((): number[] => {
    if (!maxFrames || maxFrames >= totalFrames) {
      // Use all frames: return indices 0 to totalFrames-1
      return Array.from({ length: totalFrames }, (_, i) => i);
    }

    // Calculate step to evenly distribute frames
    const step = totalFrames / maxFrames;
    const indices: number[] = [];

    for (let i = 0; i < maxFrames; i++) {
      // Calculate which frame to use: evenly spaced across total frames
      const frameIndex = Math.floor(i * step);
      indices.push(frameIndex);
    }

    return indices;
  }, [totalFrames, maxFrames]);

  const effectiveFrameCount = frameIndices.length;

  // Calculate rotation speed:
  // - If autoRotateSpeed is provided, use it as-is (absolute speed)
  // - If not provided, calculate relative to effective frame count to maintain constant rotation time
  const calculatedRotateSpeed = useMemo(() => {
    if (autoRotateSpeed !== undefined) {
      // Use provided speed as-is
      return autoRotateSpeed;
    }
    // Calculate relative speed: maintain same rotation time regardless of frame count
    // Formula: (defaultSpeed / defaultFrameCount) * effectiveFrameCount
    return (DEFAULT_AUTO_ROTATE_SPEED / DEFAULT_TOTAL_FRAMES) * effectiveFrameCount;
  }, [autoRotateSpeed, effectiveFrameCount]);

  // Calculate drag sensitivity:
  // - If dragSensitivity is provided, use it as-is (absolute sensitivity)
  // - If not provided, calculate relative to effective frame count so same mouse movement = same visual rotation
  const calculatedDragSensitivity = useMemo(() => {
    if (dragSensitivity !== undefined) {
      // Use provided sensitivity as-is
      return dragSensitivity;
    }
    // Calculate relative sensitivity: maintain same visual rotation per pixel regardless of frame count
    // We want the same *angle* change per pixel, so with fewer frames (bigger angle per frame)
    // we need *more pixels per frame*. Hence we scale by TOTAL_FRAMES / effectiveFrameCount.
    // Formula: defaultSensitivity * (defaultFrameCount / effectiveFrameCount)
    return DEFAULT_DRAG_SENSITIVITY * (DEFAULT_TOTAL_FRAMES / effectiveFrameCount);
  }, [dragSensitivity, effectiveFrameCount]);

  // Preload selected frame images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises: Promise<HTMLImageElement>[] = [];
      
      // Load only the frames we need based on frameIndices
      for (const frameIndex of frameIndices) {
        // frameIndex is 0-based, but files are 1-based
        // Format: {prefix}_xxxx.png where xxxx is 4-digit frame number
        const frameNumber = (frameIndex + 1).toString().padStart(4, '0');
        const imagePath = `${framesPath}/${frameNamePrefix}_${frameNumber}.png`;
        
        const img = new Image();
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = () => {
            console.warn(`Failed to load frame ${frameNumber}`);
            resolve(img); // Continue even if one frame fails
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

  // Normalize frame index to loop continuously (using effective frame count)
  const normalizeFrameIndex = useCallback((index: number): number => {
    let normalized = index % effectiveFrameCount;
    if (normalized < 0) {
      normalized += effectiveFrameCount;
    }
    return Math.floor(normalized);
  }, [effectiveFrameCount]);

  // Get current position (touch or mouse)
  const getPosition = useCallback((e: TouchEvent | MouseEvent): number => {
    if ('touches' in e && e.touches.length > 0) {
      return e.touches[0].clientX;
    }
    if ('clientX' in e) {
      return e.clientX;
    }
    return 0;
  }, []);

  // Handle drag start
  const handleStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    isDraggingRef.current = true;
    velocityRef.current = 0;
    const position = getPosition(e.nativeEvent);
    lastPositionRef.current = position;
    lastTimeRef.current = performance.now();
  }, [getPosition]);

  // Handle drag move
  const handleMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    e.preventDefault();
    const currentPosition = getPosition(e);
    const deltaX = currentPosition - lastPositionRef.current;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;
    
    // Calculate velocity for momentum
    if (deltaTime > 0) {
      velocityRef.current = (deltaX / deltaTime) * 16; // Normalize to 60fps
    }
    
    // Update frame based on drag distance
    const frameDelta = deltaX / calculatedDragSensitivity;
    frameIndexRef.current = frameIndexRef.current + frameDelta;
    
    const normalizedIndex = normalizeFrameIndex(frameIndexRef.current);
    setCurrentFrame(normalizedIndex);
    
    lastPositionRef.current = currentPosition;
    lastTimeRef.current = currentTime;
  }, [calculatedDragSensitivity, normalizeFrameIndex, getPosition]);

  // Handle drag end
  const handleEnd = useCallback(() => {
    setIsDragging(false);
    isDraggingRef.current = false;
    // Velocity will continue in animation loop
  }, []);

  // Animation loop with momentum and auto-rotation
  useEffect(() => {
    if (!imagesLoaded) return;

    const animate = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTimeRef.current;
      
      if (!isDraggingRef.current) {
        // Apply momentum
        if (Math.abs(velocityRef.current) > 0.01) {
          frameIndexRef.current += velocityRef.current;
          velocityRef.current *= friction;
        } else {
          // Auto-rotate when idle
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
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [imagesLoaded, friction, calculatedRotateSpeed, normalizeFrameIndex]);

  // Global event listeners for mouse (to handle mouse up outside component)
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

  // Get current frame image
  const currentImage = images[currentFrame];

  return (
    <div
      ref={containerRef}
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

