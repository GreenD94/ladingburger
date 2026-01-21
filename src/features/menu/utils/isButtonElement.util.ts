export const isButtonElement = (target: EventTarget | null): boolean => {
  if (!target) return false;
  
  const isButton = target instanceof HTMLButtonElement;
  const isButtonChild = target instanceof HTMLElement && target.closest('button') !== null;
  
  return isButton || isButtonChild;
};

