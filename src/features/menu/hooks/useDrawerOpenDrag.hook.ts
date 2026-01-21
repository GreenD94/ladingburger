import { useState, useRef, useEffect, useCallback } from 'react';
import { isButtonElement } from '../utils/isButtonElement.util';
import { DRAG_HANDLE_WIDTH, DRAWER_OPEN_THRESHOLD } from '../constants/drawer.constants';

interface UseDrawerOpenDragProps {
  isOpen: boolean;
  onOpen: () => void;
}

interface UseDrawerOpenDragReturn {
  dragOffset: number;
  isDragging: boolean;
}

export const useDrawerOpenDrag = ({
  isOpen,
  onOpen,
}: UseDrawerOpenDragProps): UseDrawerOpenDragReturn => {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);

  const handleStart = useCallback((clientX: number, target: EventTarget | null) => {
    if (isOpen) return;
    
    if (isButtonElement(target)) return;
    
    const windowWidth = window.innerWidth;
    const startFromRightEdge = windowWidth - clientX <= DRAG_HANDLE_WIDTH;
    
    if (startFromRightEdge) {
      setIsDragging(true);
      startXRef.current = clientX;
      currentXRef.current = clientX;
      setDragOffset(0);
    }
  }, [isOpen]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || isOpen) return;
    
    const deltaX = clientX - startXRef.current;
    
    if (deltaX < 0) {
      currentXRef.current = clientX;
      setDragOffset(deltaX);
    }
  }, [isDragging, isOpen]);

  const handleEnd = useCallback(() => {
    if (!isDragging || isOpen) return;
    
    const deltaX = currentXRef.current - startXRef.current;
    
    if (Math.abs(deltaX) > DRAWER_OPEN_THRESHOLD) {
      onOpen();
    }
    
    setIsDragging(false);
    setDragOffset(0);
    startXRef.current = 0;
    currentXRef.current = 0;
  }, [isDragging, isOpen, onOpen]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (isOpen) return;
    handleStart(e.clientX, e.target);
  }, [isOpen, handleStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isOpen) return;
    if (e.touches.length === 0) return;
    handleStart(e.touches[0].clientX, e.target);
  }, [isOpen, handleStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  useEffect(() => {
    if (!isOpen) {
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('touchstart', handleTouchStart);
      
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
      }
      
      return () => {
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, isOpen, handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    dragOffset,
    isDragging,
  };
};

