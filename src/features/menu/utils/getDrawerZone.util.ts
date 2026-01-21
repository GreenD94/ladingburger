import { RefObject } from 'react';
import { isButtonElement } from './isButtonElement.util';

export type DrawerZone = 'drag' | 'scroll' | 'action' | 'none';

const DRAG_HANDLE_HEIGHT = 60;
const DRAG_HANDLE_WIDTH = 20;

export const getDrawerZone = (
  element: Element | null,
  drawerRef: RefObject<HTMLDivElement>
): DrawerZone => {
  if (!element || !drawerRef.current) {
    return 'none';
  }
  
  if (isButtonElement(element)) {
    return 'action';
  }
  
  const interactiveElement = element.closest('button, a, input, textarea, select');
  if (interactiveElement) {
    return 'action';
  }
  
  const scrollableArea = element.closest('[data-scrollable]');
  if (scrollableArea) {
    return 'scroll';
  }
  
  const drawerRect = drawerRef.current.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const fromTop = elementRect.top - drawerRect.top;
  const fromLeft = elementRect.left - drawerRect.left;
  
  const isInDragHandle = fromTop < DRAG_HANDLE_HEIGHT || fromLeft < DRAG_HANDLE_WIDTH;
  
  if (isInDragHandle) {
    return 'drag';
  }
  
  return 'scroll';
};

