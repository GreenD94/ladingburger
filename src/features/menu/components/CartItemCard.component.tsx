'use client';

import React from 'react';
import { CartItem } from '../contexts/CartContext.context';
import { PRIMARY_GREEN, OFF_WHITE } from '../constants/cartColors.constants';
import { CARD_PADDING, CARD_GAP } from '../constants/cartItem.constants';
import { parseBurgerName } from '../utils/parseBurgerName.util';
// import { useSwipeToReduce } from '../hooks/useSwipeToReduce.hook';
import { CartItemPlusButton } from './CartItemPlusButton.component';
import { CartItemMinusButton } from './CartItemMinusButton.component';
// import { SwipeTrashIcon } from './SwipeTrashIcon.component';
import { CartItemBadge } from './CartItemBadge.component';

interface CartItemCardProps {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
  onAddNote: () => void;
  index: number;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onRemove,
  onUpdateQuantity,
  index,
}) => {
  const quantity = item.quantity;
  const { restPart } = parseBurgerName(item.burger.name);
  
  // Swipe left to reduce functionality - COMMENTED OUT
  // const {
  //   isSwiping,
  //   swipeOffset,
  //   swipeProgress,
  //   handleMouseDown,
  //   handleTouchStart,
  //   cardRef,
  // } = useSwipeToReduce({
  //   quantity,
  //   onUpdateQuantity,
  //   isEnabled: true,
  // });

  const handleIncrease = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const currentQuantity = item.quantity;
    onUpdateQuantity(currentQuantity + 1);
  };

  const handleDecrease = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const currentQuantity = item.quantity;
    
    // If quantity is 1, remove the item completely
    if (currentQuantity === 1) {
      onRemove();
    } else {
      onUpdateQuantity(currentQuantity - 1);
    }
  };

  const hasDecimals = item.burger.price % 1 !== 0;
  const formattedPrice = hasDecimals ? item.burger.price.toFixed(2) : item.burger.price.toString();
  
  // Swipe left visual feedback - COMMENTED OUT
  // const shouldShowTrash = isSwiping && swipeOffset < 0;
  // const transformValue = swipeOffset !== 0 ? `translateX(${swipeOffset}px)` : 'translateX(0)';
  // const cursorStyle = isSwiping ? 'grabbing' : 'grab';
  // const transitionStyle = isSwiping ? 'none' : 'transform 0.3s ease-out';

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      {/* Swipe left trash icon - COMMENTED OUT */}
      {/* {shouldShowTrash && <SwipeTrashIcon progress={swipeProgress} />} */}
      <div
        // ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        // Swipe left handlers - COMMENTED OUT
        // onMouseDown={handleMouseDown}
        // onTouchStart={handleTouchStart}
        style={{
          position: 'relative',
          padding: `${CARD_PADDING}px`,
          borderRadius: 'clamp(1.5rem, 4vw, 2rem)',
          backgroundColor: OFF_WHITE,
          color: PRIMARY_GREEN,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: `${CARD_GAP}px`,
          // Swipe left transform - COMMENTED OUT
          // transform: transformValue,
          // transition: transitionStyle,
          zIndex: 1,
          // cursor: cursorStyle,
          userSelect: 'none',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 'clamp(80px, 20vw, 96px)',
            height: 'clamp(80px, 20vw, 96px)',
            flexShrink: 0,
          }}
        >
          <CartItemBadge quantity={quantity} />
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 'clamp(1rem, 2.5vw, 1.5rem)',
              overflow: 'hidden',
            }}
          >
            <img
              src={item.burger.image}
              alt={item.burger.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            paddingRight: `${CARD_PADDING}px`,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-playfair-display), "Playfair Display", serif',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              lineHeight: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: PRIMARY_GREEN,
              margin: 0,
            }}
          >
            {restPart}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-bebas-neue), Impact, "Arial Black", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              marginTop: '8px',
              opacity: 0.8,
              color: PRIMARY_GREEN,
              marginBottom: 0,
            }}
          >
            ${formattedPrice}
          </p>
        </div>
        <CartItemPlusButton onIncrease={handleIncrease} />
        <CartItemMinusButton onDecrease={handleDecrease} />
      </div>
    </div>
  );
};
