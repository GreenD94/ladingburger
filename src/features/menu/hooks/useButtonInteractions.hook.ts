import { DEFAULT_SCALE, DEFAULT_SCALE_HOVER, DEFAULT_SCALE_TOUCH, DEFAULT_OPACITY, DEFAULT_OPACITY_HOVER } from '../constants/defaults.constants';
import { TRANSLATE_Y_DISTANCE } from '../constants/dimensions.constants';

export interface ButtonInteractionHandlers {
  onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLButtonElement>) => void;
  onAnimationEnd: (e: React.AnimationEvent<HTMLButtonElement>) => void;
}

export const useButtonInteractions = (
  baseTransform: string = `translateY(-${TRANSLATE_Y_DISTANCE})`
): ButtonInteractionHandlers => {
  const onMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = `${baseTransform} scale(${DEFAULT_SCALE_HOVER})`;
    e.currentTarget.style.opacity = String(DEFAULT_OPACITY_HOVER);
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = `${baseTransform} scale(${DEFAULT_SCALE})`;
    e.currentTarget.style.opacity = String(DEFAULT_OPACITY);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = `${baseTransform} scale(${DEFAULT_SCALE_TOUCH})`;
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = `${baseTransform} scale(${DEFAULT_SCALE})`;
  };

  const onAnimationEnd = (e: React.AnimationEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = baseTransform;
  };

  return { onMouseEnter, onMouseLeave, onTouchStart, onTouchEnd, onAnimationEnd };
};

