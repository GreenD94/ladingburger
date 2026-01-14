import { ANIMATION_DURATION_SHORT, ANIMATION_DURATION_LONG, ANIMATION_DURATION_ONE_SECOND, ANIMATION_DURATION_ONE_POINT_TWO_SECONDS, ANIMATION_DURATION_ONE_POINT_SEVEN_SECONDS } from '../constants/animations.constants';

interface AnimationDelays {
  titleDelay: string;
  imageDelay: string;
  priceDelay: string;
  ingredientsDelay: string;
}

export const useAnimationDelays = (
  isFirstItemWithCheckers: boolean
): AnimationDelays => {
  const titleDelay = isFirstItemWithCheckers ? ANIMATION_DURATION_ONE_SECOND : '0s';
  const imageDelay = isFirstItemWithCheckers ? ANIMATION_DURATION_ONE_POINT_TWO_SECONDS : ANIMATION_DURATION_SHORT;
  const priceDelay = isFirstItemWithCheckers ? ANIMATION_DURATION_ONE_POINT_SEVEN_SECONDS : ANIMATION_DURATION_LONG;
  const ingredientsDelay = isFirstItemWithCheckers ? ANIMATION_DURATION_ONE_POINT_SEVEN_SECONDS : ANIMATION_DURATION_LONG;

  return { titleDelay, imageDelay, priceDelay, ingredientsDelay };
};

