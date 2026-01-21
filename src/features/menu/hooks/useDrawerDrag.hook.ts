import { useState, useRef, useEffect, useCallback } from 'react';
import { getDrawerZone, DrawerZone } from '../utils/getDrawerZone.util';
import { detectGestureDirection, GestureDirection } from '../utils/detectGestureDirection.util';
import { MIN_DRAG_DISTANCE } from '../constants/drawer.constants';

interface UseDrawerDragProps {
  isOpen: boolean;
  drawerRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
}

interface UseDrawerDragReturn {
  dragOffset: number;
  isDragging: boolean;
  isDraggingRef: React.MutableRefObject<boolean>;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
}

interface GestureState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  zone: DrawerZone;
  direction: GestureDirection;
}

export const useDrawerDrag = ({
  isOpen,
  drawerRef,
  onClose,
}: UseDrawerDragProps): UseDrawerDragReturn => {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const velocityRef = useRef<number>(0);
  const lastMoveTimeRef = useRef<number>(0);
  const lastMoveXRef = useRef<number>(0);
  const gestureStateRef = useRef<GestureState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    zone: 'none',
    direction: 'none',
  });

  useEffect(() => {
    if (!isOpen) {
      setDragOffset(0);
      setIsDragging(false);
      isDraggingRef.current = false;
      startXRef.current = 0;
      startYRef.current = 0;
      currentXRef.current = 0;
      currentYRef.current = 0;
      velocityRef.current = 0;
      lastMoveTimeRef.current = 0;
      lastMoveXRef.current = 0;
      gestureStateRef.current = {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        zone: 'none',
        direction: 'none',
      };
    }
  }, [isOpen]);

  const handleStart = useCallback((clientX: number, clientY: number, target: EventTarget | null) => {
    if (!isOpen) return;
    
    const zone = getDrawerZone(target as Element, drawerRef);
    
    if (zone === 'action') {
      return;
    }
    
    startXRef.current = clientX;
    startYRef.current = clientY;
    currentXRef.current = clientX;
    currentYRef.current = clientY;
    lastMoveXRef.current = clientX;
    lastMoveTimeRef.current = Date.now();
    velocityRef.current = 0;
    setDragOffset(0);
    
    gestureStateRef.current = {
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
      zone,
      direction: 'none',
    };
  }, [isOpen, drawerRef]);

  const handleMove = useCallback((clientX: number, clientY: number, target: EventTarget | null) => {
    if (!isOpen) return;
    
    if (startXRef.current === 0 && startYRef.current === 0) {
      return;
    }
    
    const zone = getDrawerZone(target as Element, drawerRef);
    
    gestureStateRef.current.currentX = clientX;
    gestureStateRef.current.currentY = clientY;
    gestureStateRef.current.zone = zone;
    
    const direction = detectGestureDirection({
      startX: gestureStateRef.current.startX,
      startY: gestureStateRef.current.startY,
      currentX: clientX,
      currentY: clientY,
    });
    
    gestureStateRef.current.direction = direction;
    
    if (zone === 'action') {
      return;
    }
    
    if (zone === 'scroll' && direction === 'vertical') {
      return;
    }
    
    if (zone === 'drag' && direction === 'horizontal') {
      const deltaX = clientX - startXRef.current;
      
      if (deltaX > 0) {
        currentXRef.current = clientX;
      }
      
      const now = Date.now();
      const timeDelta = now - lastMoveTimeRef.current;
      if (timeDelta > 0) {
        const distanceDelta = clientX - lastMoveXRef.current;
        velocityRef.current = Math.abs(distanceDelta) / timeDelta;
      }
      lastMoveXRef.current = clientX;
      lastMoveTimeRef.current = now;
      
      if (Math.abs(deltaX) >= MIN_DRAG_DISTANCE && !isDraggingRef.current) {
        isDraggingRef.current = true;
        setIsDragging(true);
      }
      
      if (deltaX >= MIN_DRAG_DISTANCE) {
        isDraggingRef.current = false;
        setIsDragging(false);
        setDragOffset(0);
        startXRef.current = 0;
        startYRef.current = 0;
        currentXRef.current = 0;
        currentYRef.current = 0;
        velocityRef.current = 0;
        lastMoveTimeRef.current = 0;
        lastMoveXRef.current = 0;
        gestureStateRef.current = {
          startX: 0,
          startY: 0,
          currentX: 0,
          currentY: 0,
          zone: 'none',
          direction: 'none',
        };
        onClose();
        return;
      }
      
      if (!isDraggingRef.current) return;
      
      if (deltaX > 0) {
        setDragOffset(deltaX);
      }
    }
  }, [isOpen, onClose, drawerRef]);

  const handleEnd = useCallback(() => {
    if (!isOpen) return;
    
    if (startXRef.current === 0 && startYRef.current === 0) {
      return;
    }
    
    const { zone, direction } = gestureStateRef.current;
    
    if (zone === 'action') {
      startXRef.current = 0;
      startYRef.current = 0;
      currentXRef.current = 0;
      currentYRef.current = 0;
      gestureStateRef.current = {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        zone: 'none',
        direction: 'none',
      };
      return;
    }
    
    if (zone === 'scroll' && direction === 'vertical') {
      startXRef.current = 0;
      startYRef.current = 0;
      currentXRef.current = 0;
      currentYRef.current = 0;
      gestureStateRef.current = {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        zone: 'none',
        direction: 'none',
      };
      return;
    }
    
    const deltaX = currentXRef.current - startXRef.current;
    
    if (deltaX >= MIN_DRAG_DISTANCE && zone === 'drag' && direction === 'horizontal') {
      isDraggingRef.current = false;
      setIsDragging(false);
      setDragOffset(0);
      startXRef.current = 0;
      startYRef.current = 0;
      currentXRef.current = 0;
      currentYRef.current = 0;
      velocityRef.current = 0;
      lastMoveTimeRef.current = 0;
      lastMoveXRef.current = 0;
      gestureStateRef.current = {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        zone: 'none',
        direction: 'none',
      };
      onClose();
      return;
    }
    
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setDragOffset(0);
    }
    startXRef.current = 0;
    startYRef.current = 0;
    currentXRef.current = 0;
    currentYRef.current = 0;
    velocityRef.current = 0;
    lastMoveTimeRef.current = 0;
    lastMoveXRef.current = 0;
    gestureStateRef.current = {
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      zone: 'none',
      direction: 'none',
    };
  }, [isOpen, onClose]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isOpen) return;
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    handleStart(e.clientX, e.clientY, e.target);
  }, [isOpen, handleStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isOpen || e.touches.length === 0) return;
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    handleStart(e.touches[0].clientX, e.touches[0].clientY, e.target);
  }, [isOpen, handleStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX, e.clientY, e.target);
  }, [handleMove]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (isDraggingRef.current) {
      handleEnd();
    } else {
      startXRef.current = 0;
      startYRef.current = 0;
      currentXRef.current = 0;
      currentYRef.current = 0;
    }
  }, [handleEnd]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const target = e.target as Element;
      
      gestureStateRef.current.currentX = touch.clientX;
      gestureStateRef.current.currentY = touch.clientY;
      
      const zone = getDrawerZone(target, drawerRef);
      const direction = detectGestureDirection({
        startX: gestureStateRef.current.startX,
        startY: gestureStateRef.current.startY,
        currentX: touch.clientX,
        currentY: touch.clientY,
      });
      
      const shouldPreventDefault = zone === 'drag' && direction === 'horizontal';
      
      if (shouldPreventDefault) {
        e.preventDefault();
      }
      
      handleMove(touch.clientX, touch.clientY, target);
    }
  }, [handleMove, drawerRef]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (isDraggingRef.current) {
      handleEnd();
    } else {
      startXRef.current = 0;
      startYRef.current = 0;
      currentXRef.current = 0;
      currentYRef.current = 0;
    }
  }, [handleEnd]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isOpen, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return {
    dragOffset,
    isDragging,
    isDraggingRef,
    handleMouseDown,
    handleTouchStart,
  };
};
