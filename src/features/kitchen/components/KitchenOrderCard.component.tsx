'use client';

import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/features/database/types/index.type';
import { Burger } from '@/features/database/types/burger.type';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '../styles/KitchenOrderCard.module.css';

interface KitchenOrderCardProps {
  order: Order;
  onTakeOrder?: (orderId: string) => Promise<void>;
  onMarkAsReady: (orderId: string) => Promise<void>;
  updatingStatus: Record<string, boolean>;
  getBurgerName: (burgerId: string) => string;
  isPending: boolean;
  isReady: boolean;
  burgers?: Record<string, Burger>;
}

export function KitchenOrderCard({
  order,
  onTakeOrder,
  onMarkAsReady,
  updatingStatus,
  getBurgerName,
  isPending,
  isReady,
  burgers = {},
}: KitchenOrderCardProps) {
  const { t } = useLanguage();
  const [timeWaiting, setTimeWaiting] = useState(0);

  const orderId = order._id?.toString() || '';
  const displayOrderNumber = order.orderNumber || orderId.slice(-6);
  const estimatedPrepTime = order.estimatedPrepTime || 0;

  const burgerItems = order.items.map((item) => {
    const burger = burgers[item.burgerId];
    const burgerName = getBurgerName(item.burgerId);
    const ingredients = burger && burger.ingredients
      ? burger.ingredients.filter((ing) => !item.removedIngredients.includes(ing))
      : [];
    return {
      quantity: item.quantity,
      name: burgerName,
      ingredients,
      note: item.note || '',
    };
  });

  const totalBurgers = burgerItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const calculateTimeWaiting = () => {
      const now = new Date();
      const referenceTime = isPending ? new Date(order.createdAt) : (order.cookingStartedAt ? new Date(order.cookingStartedAt) : new Date(order.createdAt));
      const waitingMinutes = Math.floor((now.getTime() - referenceTime.getTime()) / 1000 / 60);
      setTimeWaiting(Math.max(0, waitingMinutes));
    };

    calculateTimeWaiting();
    const interval = setInterval(calculateTimeWaiting, 60000);

    return () => clearInterval(interval);
  }, [order.createdAt, order.cookingStartedAt, isPending]);

  const getUrgencyLevel = () => {
    if (isReady) return 'ready';
    if (isPending) {
      if (timeWaiting >= 15) return 'urgent';
      if (timeWaiting >= 10) return 'high';
      return 'normal';
    }
    if (estimatedPrepTime > 0) {
      const timeElapsed = timeWaiting;
      const timeRemaining = estimatedPrepTime - timeElapsed;
      if (timeRemaining <= 0) return 'urgent';
      if (timeRemaining <= 5) return 'high';
    }
    return 'normal';
  };

  const urgencyLevel = getUrgencyLevel();

  return (
    <div className={`${styles.card} ${styles[`card${urgencyLevel.charAt(0).toUpperCase() + urgencyLevel.slice(1)}`]}`}>
      <div className={styles.cardContent}>
        <div className={styles.orderHeader}>
          <h3 className={styles.orderTitle}>
            #{displayOrderNumber}
          </h3>
          <div className={styles.statusBadge}>
            {isReady ? (
              <span className={`${styles.badge} ${styles.badgeReady}`}>
                {t('ready')}
              </span>
            ) : isPending ? (
              <span className={`${styles.badge} ${styles.badgePending}`}>
                {t('pending')}
              </span>
            ) : (
              <span className={`${styles.badge} ${styles.badgeCooking}`}>
                {t('cooking')}
              </span>
            )}
          </div>
        </div>

        <div className={styles.burgersList}>
          {burgerItems.map((burgerItem, index) => (
            <div key={index} className={styles.burgerItem}>
              <div className={styles.burgerHeader}>
                <span className={styles.burgerQuantity}>{burgerItem.quantity}x</span>
                <span className={styles.burgerName}>{burgerItem.name}</span>
              </div>
              {burgerItem.ingredients.length > 0 && (
                <div className={styles.ingredientsList}>
                  {burgerItem.ingredients.map((ingredient, ingIndex) => (
                    <span key={ingIndex} className={styles.ingredientTag}>
                      {ingredient}
                    </span>
                  ))}
                </div>
              )}
              {burgerItem.note && (
                <div className={styles.itemNote}>
                  <span className={styles.itemNoteLabel}>{t('notes')}:</span>
                  <span className={styles.itemNoteText}>{burgerItem.note}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.timeInfo}>
          <div className={styles.timeRow}>
            <span className={`material-symbols-outlined ${styles.timeIcon}`}>
              restaurant_menu
            </span>
            <span className={styles.timeText}>
              {t('totalBurgers')}: {totalBurgers}
            </span>
          </div>
          <div className={styles.timeRow}>
            <span className={`material-symbols-outlined ${styles.timeIcon}`}>
              schedule
            </span>
            <span className={styles.timeText}>
              {isPending ? t('timeWaiting') : t('elapsedTime')}: {timeWaiting} {t('minutes')}
            </span>
          </div>
          {estimatedPrepTime > 0 && (
            <div className={styles.timeRow}>
              <span className={`material-symbols-outlined ${styles.timeIcon}`}>
                timer
              </span>
              <span className={styles.timeText}>
                {t('estimatedTime')}: {estimatedPrepTime} {t('minutes')}
              </span>
            </div>
          )}
        </div>

        {isPending && onTakeOrder && (
          <button
            className={styles.buttonTake}
            onClick={() => onTakeOrder(orderId)}
            disabled={updatingStatus[orderId]}
          >
            {updatingStatus[orderId] ? (
              <>
                <span className={`material-symbols-outlined ${styles.buttonIcon}`}>
                  hourglass_empty
                </span>
                {t('takingOrder')}...
              </>
            ) : (
              <>
                <span className={`material-symbols-outlined ${styles.buttonIcon}`}>
                  restaurant_menu
                </span>
                {t('takeOrder')}
              </>
            )}
          </button>
        )}

        {!isPending && !isReady && (
          <button
            className={styles.buttonReady}
            onClick={() => onMarkAsReady(orderId)}
            disabled={updatingStatus[orderId]}
          >
            {updatingStatus[orderId] ? (
              <>
                <span className={`material-symbols-outlined ${styles.buttonIcon}`}>
                  hourglass_empty
                </span>
                {t('markingReady')}...
              </>
            ) : (
              <>
                <span className={`material-symbols-outlined ${styles.buttonIcon}`}>
                  check_circle
                </span>
                {t('markAsReady')}
              </>
            )}
          </button>
        )}

        {isReady && (
          <div className={styles.readyMessage}>
            <span className={`material-symbols-outlined ${styles.readyIcon}`}>
              done_all
            </span>
            <span className={styles.readyText}>{t('orderReadyMessage')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
