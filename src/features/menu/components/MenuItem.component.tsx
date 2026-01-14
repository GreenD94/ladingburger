'use client';

import React from 'react';
import { Burger } from '@/features/database/types/index.type';
import { useMenuTheme } from '../hooks/useMenuTheme.hook';
import { useCart } from '../contexts/CartContext.context';
import { CheckerboardBackground } from './CheckerboardBackground.component';
import { BurgerImageSection } from './BurgerImageSection.component';
import { BurgerTitleSection } from './BurgerTitleSection.component';
import { BurgerDetails } from './BurgerDetails.component';
import { AddToCartButton } from './AddToCartButton.component';
import { MenuAnimations } from '../styles/menuAnimations.styles';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.hook';
import { useFirstItemAnimation } from '../hooks/useFirstItemAnimation.hook';
import { useAnimationDelays } from '../hooks/useAnimationDelays.hook';
import { useSafeAreaPadding } from '../hooks/useSafeAreaPadding.hook';
import { useMenuItemStyles } from '../hooks/useMenuItemStyles.hook';
import { useIngredientsText } from '../hooks/useIngredientsText.hook';
import { parseBurgerName } from '../utils/parseBurgerName.util';
import { Z_INDEX_BACKGROUND } from '../constants/zIndex.constants';
import { DEFAULT_QUANTITY } from '../constants/defaults.constants';

interface MenuItemProps {
  burger: Burger;
  index: number;
}

export const MenuItem: React.FC<MenuItemProps> = ({ burger, index }) => {
  const { theme } = useMenuTheme();
  const { openCart, addItem } = useCart();
  const { isVisible, elementRef } = useIntersectionObserver();
  const { hasAnimatedCheckers, isFirstItem } = useFirstItemAnimation(index);
  const isFirstItemWithCheckers = isFirstItem && hasAnimatedCheckers;
  const { titleDelay, imageDelay, priceDelay, ingredientsDelay } = useAnimationDelays(isFirstItemWithCheckers);
  const { paddingLeft, paddingRight } = useSafeAreaPadding();
  const { containerStyle } = useMenuItemStyles(theme, paddingLeft, paddingRight);
  const { burgerPart, restPart } = parseBurgerName(burger.name);
  const ingredientsText = useIngredientsText(burger);
  const shouldAnimateCheckers = hasAnimatedCheckers && isFirstItem;

  const handleAddToCart = () => {
    addItem(burger, DEFAULT_QUANTITY);
    openCart();
  };

  return (
    <>
      <MenuAnimations />
      <div
        ref={elementRef as React.RefObject<HTMLDivElement>}
        data-menu-item={index}
        style={containerStyle}
      >
        <BurgerImageSection
          theme={theme}
          imageUrl={burger.image}
          imageAlt={burger.name}
          isVisible={isVisible}
          imageDelay={imageDelay}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          shouldAnimateCheckers={shouldAnimateCheckers}
        />

        <BurgerTitleSection
          theme={theme}
          burgerPart={burgerPart}
          restPart={restPart}
          isVisible={isVisible}
          titleDelay={titleDelay}
        />

        <BurgerDetails
          ingredientsText={ingredientsText}
          price={burger.price}
          isVisible={isVisible}
          ingredientsDelay={ingredientsDelay}
          priceDelay={priceDelay}
        />

        <AddToCartButton
          theme={theme}
          priceDelay={priceDelay}
          onAddToCart={handleAddToCart}
          itemIndex={index}
        />

        <CheckerboardBackground
          backgroundColor={theme.backgroundColor}
          height="12.5dvh"
          position="bottom"
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
          zIndex={Z_INDEX_BACKGROUND}
          shouldAnimate={shouldAnimateCheckers}
        />
      </div>
    </>
  );
};

