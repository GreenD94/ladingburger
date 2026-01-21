'use client';

import { useState } from 'react';
import { Order, OrderStatus, OrderStatusType, OrderStatusLabels } from '@/features/database/types/index.type';
import { formatTimeAgo } from '@/features/admin/utils/formatTimeAgo.util';
import { getValidNextStatuses } from '@/features/orders/utils/validateStatusTransition.util';
import { OrderDetailModal } from './OrderDetailModal.component';
import PaymentModal from './PaymentModal.component';
import { ConfirmNextStatusModal } from './ConfirmNextStatusModal.component';
import { ConfirmCompleteModal } from './ConfirmCompleteModal.component';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/admin/styles/SimpleOrderCard.module.css';

interface SimpleOrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatusType) => Promise<void>;
  updatingStatus: Record<string, boolean>;
  getBurgerName: (burgerId: string) => string;
  onPaymentUpdate: () => void;
}

export function SimpleOrderCard({ order, onStatusChange, updatingStatus, getBurgerName, onPaymentUpdate }: SimpleOrderCardProps) {
  const { t } = useLanguage();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [nextStatusModalOpen, setNextStatusModalOpen] = useState(false);
  const [selectedNextStatus, setSelectedNextStatus] = useState<OrderStatusType>(OrderStatus.COOKING);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);

  const orderId = order._id?.toString() || '';
  const displayOrderNumber = order.orderNumber || orderId.slice(-6);
  const needsPayment = order.status === OrderStatus.WAITING_PAYMENT || order.status === OrderStatus.PAYMENT_FAILED;
  const isCooking = order.status === OrderStatus.COOKING;
  const isReady = order.status === OrderStatus.READY;
  const isInTransit = order.status === OrderStatus.IN_TRANSIT;
  const isWaitingPickup = order.status === OrderStatus.WAITING_PICKUP;
  const canComplete = isInTransit || isWaitingPickup;
  const validNextStatuses = getValidNextStatuses(order.status);
  const readyNextStatuses = validNextStatuses.filter(s => 
    s === OrderStatus.IN_TRANSIT || s === OrderStatus.WAITING_PICKUP
  );

  const handleWhatsAppClick = () => {
    const phoneNumber = order.customerPhone.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/${phoneNumber}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.orderHeader}>
            <div className={styles.orderTitleSection}>
              <h3 className={styles.orderTitle}>
                #{displayOrderNumber}
              </h3>
              {order.customerName && (
                <p className={styles.customerName}>
                  {order.customerName}
                </p>
              )}
              {!order.customerName && (
                <p className={styles.customerPhone}>
                  {order.customerPhone}
                </p>
              )}
            </div>
            <p className={styles.orderPrice}>
              ${order.totalPrice.toLocaleString()}
            </p>
          </div>

          <div className={styles.timeInfo}>
            <span className={`material-symbols-outlined ${styles.timeIcon}`}>
              schedule
            </span>
            <span className={styles.timeText}>
              {formatTimeAgo(order.createdAt)}
            </span>
          </div>

          <div className={styles.buttonsRow}>
            <button
              className={`${styles.button} ${styles.buttonWhatsApp}`}
              onClick={handleWhatsAppClick}
            >
              <span className={`material-symbols-outlined ${styles.buttonIcon}`}>
                chat
              </span>
              {t('whatsapp')}
            </button>
            <button
              className={`${styles.button} ${styles.buttonDetails}`}
              onClick={() => setDetailModalOpen(true)}
            >
              <span className={`material-symbols-outlined ${styles.buttonIcon}`}>
                info
              </span>
              {t('details')}
            </button>
          </div>

          {needsPayment && (
            <button
              className={styles.buttonPayment}
              onClick={() => setPaymentModalOpen(true)}
              disabled={updatingStatus[orderId]}
            >
              {order.status === OrderStatus.PAYMENT_FAILED ? t('retryPayment') : t('confirmPayment')}
              <span className={`material-symbols-outlined ${styles.buttonPaymentIcon}`}>
                payments
              </span>
            </button>
          )}

          {isReady && readyNextStatuses.length > 0 && (
            <div className={styles.cookingActionsRow}>
              {readyNextStatuses.includes(OrderStatus.IN_TRANSIT) && (
                <button
                  className={`${styles.button} ${styles.buttonCookingAction}`}
                  onClick={() => {
                    setSelectedNextStatus(OrderStatus.IN_TRANSIT);
                    setNextStatusModalOpen(true);
                  }}
                  disabled={updatingStatus[orderId]}
                >
                  <span className={`material-symbols-outlined ${styles.buttonIcon}`}>
                    delivery_dining
                  </span>
                  {OrderStatusLabels[OrderStatus.IN_TRANSIT]}
                </button>
              )}
              {readyNextStatuses.includes(OrderStatus.WAITING_PICKUP) && (
                <button
                  className={`${styles.button} ${styles.buttonCookingAction}`}
                  onClick={() => {
                    setSelectedNextStatus(OrderStatus.WAITING_PICKUP);
                    setNextStatusModalOpen(true);
                  }}
                  disabled={updatingStatus[orderId]}
                >
                  <span className={`material-symbols-outlined ${styles.buttonIcon}`}>
                    storefront
                  </span>
                  {OrderStatusLabels[OrderStatus.WAITING_PICKUP]}
                </button>
              )}
            </div>
          )}

          {canComplete && (
            <button
              className={styles.buttonPayment}
              onClick={() => setCompleteModalOpen(true)}
              disabled={updatingStatus[orderId]}
            >
              {t('completeOrder')}
              <span className={`material-symbols-outlined ${styles.buttonPaymentIcon}`}>
                check_circle
              </span>
            </button>
          )}
        </div>
      </div>

      <ConfirmCompleteModal
        open={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        orderId={orderId}
        onSuccess={onPaymentUpdate}
      />

      <ConfirmNextStatusModal
        open={nextStatusModalOpen}
        onClose={() => {
          setNextStatusModalOpen(false);
          setSelectedNextStatus(OrderStatus.COOKING);
        }}
        orderId={orderId}
        currentStatus={order.status}
        nextStatus={selectedNextStatus}
        onConfirm={async () => {
          await onStatusChange(orderId, selectedNextStatus);
          onPaymentUpdate();
        }}
      />

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderId={orderId}
        onSuccess={onPaymentUpdate}
      />

      <OrderDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        order={order}
        getBurgerName={getBurgerName}
        onStatusChange={onStatusChange}
        onPaymentUpdate={onPaymentUpdate}
        updatingStatus={updatingStatus}
      />
    </>
  );
}
