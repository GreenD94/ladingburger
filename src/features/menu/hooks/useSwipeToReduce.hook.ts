import { useState, useRef, useEffect } from 'react';
import { SWIPE_THRESHOLD } from '../constants/cartItem.constants';

interface UseSwipeToReduceProps {
  quantity: number;
  onUpdateQuantity: (quantity: number) => void;
  isEnabled: boolean;
}

interface UseSwipeToReduceReturn {
  isSwiping: boolean;
  swipeOffset: number;
  swipeProgress: number;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  cardRef: React.RefObject<HTMLDivElement>;
}

export const useSwipeToReduce = ({
  quantity,
  onUpdateQuantity,
  isEnabled,
}: UseSwipeToReduceProps): UseSwipeToReduceReturn => {
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);
  const isSwipingRef = useRef<boolean>(false);
  const quantityRef = useRef<number>(quantity);
  const onUpdateQuantityRef = useRef(onUpdateQuantity);
  const swipeOffsetRef = useRef<number>(0);
  const hasTriggeredReduceRef = useRef<boolean>(false);

  useEffect(() => {
    quantityRef.current = quantity;
    onUpdateQuantityRef.current = onUpdateQuantity;
  }, [quantity, onUpdateQuantity]);

  const canSwipe = isEnabled && quantity > 1;

  const handleSwipeStart = (clientX: number, clientY: number) => {
    if (!canSwipe) return;
    isSwipingRef.current = true;
    setIsSwiping(true);
    hasTriggeredReduceRef.current = false;
    startXRef.current = clientX;
    startYRef.current = clientY;
    currentXRef.current = clientX;
    swipeOffsetRef.current = 0;
    setSwipeOffset(0);
  };

  const handleSwipeMove = (clientX: number, clientY: number) => {
    if (!isSwipingRef.current) return;
    const deltaX = clientX - startXRef.current;
    const deltaY = Math.abs(clientY - startYRef.current);
    const isHorizontalSwipe = Math.abs(deltaX) > deltaY;
    
    if (deltaX < 0 && isHorizontalSwipe) {
      currentXRef.current = clientX;
      swipeOffsetRef.current = deltaX;
      setSwipeOffset(deltaX);
      
      // Check if threshold is reached and trigger reduce immediately
      const absSwipeOffset = Math.abs(deltaX);
      if (absSwipeOffset >= SWIPE_THRESHOLD && !hasTriggeredReduceRef.current) {
        if (quantityRef.current > 1) {
          hasTriggeredReduceRef.current = true;
          onUpdateQuantityRef.current(quantityRef.current - 1);
        }
      }
    }
  };

  const handleSwipeEnd = () => {
    if (!isSwipingRef.current) return;
    
    // First, disable dragging state to enable transition
    isSwipingRef.current = false;
    setIsSwiping(false);
    
    // Reset the offset to trigger the transition back to original position
    // Use setTimeout to ensure state updates are applied in sequence
    // This allows the transition to be enabled before the offset is reset
    setTimeout(() => {
      swipeOffsetRef.current = 0;
      setSwipeOffset(0);
    }, 0);
    
    // Clean up refs
    hasTriggeredReduceRef.current = false;
    startXRef.current = 0;
    startYRef.current = 0;
    currentXRef.current = 0;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const isButton = e.target instanceof HTMLButtonElement || (e.target as HTMLElement).closest('button');
    if (isButton || !canSwipe) return;
    e.preventDefault();
    handleSwipeStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const isButton = e.target instanceof HTMLButtonElement || (e.target as HTMLElement).closest('button');
    if (isButton || !canSwipe) return;
    handleSwipeStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  useEffect(() => {
    if (!isSwiping) {
      return;
    }

    const handleMouseMoveEvent = (e: MouseEvent) => {
      if (!isSwipingRef.current) return;
      handleSwipeMove(e.clientX, e.clientY);
    };

    const handleMouseUpEvent = () => {
      handleSwipeEnd();
    };

    const handleTouchMoveEvent = (e: TouchEvent) => {
      if (e.touches.length > 0 && isSwipingRef.current) {
        handleSwipeMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEndEvent = () => {
      handleSwipeEnd();
    };

    document.addEventListener('mousemove', handleMouseMoveEvent);
    document.addEventListener('mouseup', handleMouseUpEvent);
    document.addEventListener('touchmove', handleTouchMoveEvent);
    document.addEventListener('touchend', handleTouchEndEvent);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMoveEvent);
      document.removeEventListener('mouseup', handleMouseUpEvent);
      document.removeEventListener('touchmove', handleTouchMoveEvent);
      document.removeEventListener('touchend', handleTouchEndEvent);
    };
  }, [isSwiping]);

  const swipeProgress = Math.min(Math.abs(swipeOffset) / SWIPE_THRESHOLD, 1);

  return {
    isSwiping,
    swipeOffset,
    swipeProgress,
    handleMouseDown,
    handleTouchStart,
    cardRef,
  };
};

