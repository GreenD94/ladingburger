import { TRANSITION_DURATION_MEDIUM } from '../constants/animations.constants';

interface UseDrawerTransformProps {
  isOpen: boolean;
  isDragging: boolean;
  isDraggingRef: React.MutableRefObject<boolean>;
  dragOffset: number;
  externalDragOffset: number;
}

interface UseDrawerTransformReturn {
  transformValue: string;
  transition: string;
}

export const useDrawerTransform = ({
  isOpen,
  isDragging,
  isDraggingRef,
  dragOffset,
  externalDragOffset,
}: UseDrawerTransformProps): UseDrawerTransformReturn => {
  if (!isOpen) {
    return {
      transformValue: 'translateX(100%)',
      transition: `transform ${TRANSITION_DURATION_MEDIUM}`,
    };
  }
  
  const effectiveDragOffset = externalDragOffset !== 0 ? externalDragOffset : dragOffset;
  const isDraggingFromRef = isDraggingRef.current;
  const hasExternalDrag = externalDragOffset !== 0;
  const isActivelyDragging = (isDraggingFromRef || hasExternalDrag) && effectiveDragOffset !== 0;
  
  let transformValue: string;
  
  if (isActivelyDragging) {
    transformValue = `translateX(${effectiveDragOffset}px)`;
  } else {
    transformValue = 'translateX(0)';
  }
  
  const transition = isActivelyDragging ? 'none' : `transform ${TRANSITION_DURATION_MEDIUM}`;
  
  return {
    transformValue,
    transition,
  };
};

