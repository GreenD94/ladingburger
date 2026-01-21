interface GestureState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export type GestureDirection = 'horizontal' | 'vertical' | 'none';

const MIN_DIRECTION_THRESHOLD = 10;
const DIRECTION_RATIO = 1.5;

export const detectGestureDirection = (state: GestureState): GestureDirection => {
  const deltaX = Math.abs(state.currentX - state.startX);
  const deltaY = Math.abs(state.currentY - state.startY);
  
  if (deltaX < MIN_DIRECTION_THRESHOLD && deltaY < MIN_DIRECTION_THRESHOLD) {
    return 'none';
  }
  
  if (deltaX > deltaY * DIRECTION_RATIO) {
    return 'horizontal';
  }
  
  if (deltaY > deltaX * DIRECTION_RATIO) {
    return 'vertical';
  }
  
  return 'none';
};

