'use client';

import { useState } from 'react';
import { Order, OrderStatus, OrderStatusType, OrderStatusLabels } from '@/features/database/types/index.type';
import { formatTimeAgo } from '@/features/admin/utils/formatTimeAgo.util';
import { getValidNextStatuses } from '@/features/orders/utils/validateStatusTransition.util';
import PaymentModal from './PaymentModal.component';
import { IssueModal } from './IssueModal.component';
import { ConfirmCompleteModal } from './ConfirmCompleteModal.component';
import { ConfirmNextStatusModal } from './ConfirmNextStatusModal.component';
import { CancelOrderModal } from './CancelOrderModal.component';
import { RefundOrderModal } from './RefundOrderModal.component';
import { CustomerHistoryModal } from './CustomerHistoryModal.component';
import { OrderNotes } from './OrderNotes.component';
import { updateOrderNotes } from '@/features/orders/actions/updateOrderNotes.action';
import { VENEZUELAN_BANKS } from '@/features/admin/constants/banks.constants';
import { useLanguage } from '@/features/i18n/hooks/useLanguage.hook';
import styles from '@/features/admin/styles/Modal.module.css';
import headerStyles from '@/features/admin/styles/OrderDetailHeader.module.css';

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  order: Order;
  getBurgerName: (burgerId: string) => string;
  onStatusChange: (orderId: string, newStatus: OrderStatusType) => Promise<void>;
  onPaymentUpdate: () => void;
  updatingStatus: Record<string, boolean>;
}

const getStatusIcon = (status: OrderStatusType) => {
  switch (status) {
    case OrderStatus.WAITING_PAYMENT: return 'hourglass_empty';
    case OrderStatus.PAYMENT_FAILED: return 'credit_card_off';
    case OrderStatus.COOKING: return 'cooking';
    case OrderStatus.IN_TRANSIT: return 'delivery_dining';
    case OrderStatus.WAITING_PICKUP: return 'storefront';
    case OrderStatus.COMPLETED: return 'check_circle';
    case OrderStatus.ISSUE: return 'report';
    case OrderStatus.CANCELLED: return 'cancel';
    case OrderStatus.REFUNDED: return 'payments';
    default: return 'circle';
  }
};

export function OrderDetailModal({
  open,
  onClose,
  order,
  getBurgerName,
  onStatusChange,
  onPaymentUpdate,
  updatingStatus,
}: OrderDetailModalProps) {
  const { t } = useLanguage();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [nextStatusModalOpen, setNextStatusModalOpen] = useState(false);
  const [selectedNextStatus, setSelectedNextStatus] = useState<OrderStatusType>(OrderStatus.COOKING);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [updatingNotes, setUpdatingNotes] = useState(false);

  const orderId = order._id?.toString() || '';
  const displayOrderNumber = order.orderNumber || orderId.slice(-6);
  const validNextStatuses = getValidNextStatuses(order.status);
  const isCancelled = order.status === OrderStatus.CANCELLED;
  const isCompleted = order.status === OrderStatus.COMPLETED;
  const isRefunded = order.status === OrderStatus.REFUNDED;
  const isDisabled = updatingStatus[orderId] || isCancelled || isCompleted || isRefunded;

  const isWaitingPayment = order.status === OrderStatus.WAITING_PAYMENT;
  const isPaymentFailed = order.status === OrderStatus.PAYMENT_FAILED;
  const isCooking = order.status === OrderStatus.COOKING;
  const isInTransit = order.status === OrderStatus.IN_TRANSIT;
  const isWaitingPickup = order.status === OrderStatus.WAITING_PICKUP;
  const isIssue = order.status === OrderStatus.ISSUE;

  const canRefund = isCooking || isInTransit || isWaitingPickup || isIssue;
  const canComplete = isInTransit || isWaitingPickup || isIssue;

  const cookingNextStatuses = validNextStatuses.filter(s => 
    s === OrderStatus.IN_TRANSIT || s === OrderStatus.WAITING_PICKUP
  );

  const nextStatus = validNextStatuses.find(s => {
    if (isWaitingPayment || isPaymentFailed) return s === OrderStatus.COOKING;
    if (isInTransit) return s === OrderStatus.WAITING_PICKUP;
    if (isWaitingPickup) return s === OrderStatus.COMPLETED;
    return false;
  }) || OrderStatus.WAITING_PAYMENT;

  const handleNotesChange = async (orderId: string, notes: string) => {
    try {
      setUpdatingNotes(true);
      const result = await updateOrderNotes(orderId, notes);
      if (result.success) {
        onPaymentUpdate();
      }
    } catch (error) {
      console.error('Error updating notes:', error);
    } finally {
      setUpdatingNotes(false);
    }
  };

  const whatsappLink = `https://wa.me/${order.customerPhone.replace(/\D/g, '')}`;

  if (!open) {
    return null;
  }

  return (
    <>
      <div className={styles.overlayFullScreen}>
        <div className={styles.modalFullScreen}>
          <div className={headerStyles.header}>
            <div className={headerStyles.headerLeft}>
              <button 
                className={headerStyles.backButton} 
                onClick={onClose}
                aria-label={t('back')}
                type="button"
              >
                <span className={`material-symbols-outlined ${headerStyles.backIcon}`}>arrow_back</span>
              </button>
              <div className={headerStyles.headerTitle}>
                <h2 className={headerStyles.titleText}>
                  {t('orderNumber')} #{displayOrderNumber}
                </h2>
                <p className={headerStyles.statusText}>
                  {OrderStatusLabels[order.status]}
                </p>
              </div>
            </div>
            <button className={headerStyles.notificationButton}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>

          <div className={styles.modalContentNoPadding}>
            <p className={styles.sectionTitle}>{t('customerInfo')}</p>

            <div className={styles.infoCard}>
              <div className={styles.infoCardContent}>
                <div className={styles.avatar}>
                  {(order.customerName || order.customerPhone)[0].toUpperCase()}
                </div>
                <div className={styles.infoText}>
                  <p className={styles.infoName}>
                    {order.customerName || order.customerPhone}
                  </p>
                  {order.customerName && (
                    <p className={styles.infoSubtext}>{order.customerPhone}</p>
                  )}
                </div>
              </div>
            </div>

            <p className={styles.sectionTitleLarge}>{t('orderSummary')}</p>

            <div className={styles.itemCard}>
              {order.items.map((item, index) => (
                <div key={index} className={styles.itemRow}>
                  <div className={styles.itemIcon}>
                    <span className="material-symbols-outlined">lunch_dining</span>
                  </div>
                  <div className={styles.itemContent}>
                    <p className={styles.itemName}>
                      {getBurgerName(item.burgerId)} <span style={{ fontSize: '0.75rem', color: '#666' }}>x{item.quantity}</span>
                    </p>
                    {item.removedIngredients.length > 0 && (
                      <p className={styles.itemExcluded}>
                        {t('excludeLabel')}: {item.removedIngredients.join(', ')}
                      </p>
                    )}
                    {item.note && (
                      <p className={styles.itemNote}>{item.note}</p>
                    )}
                  </div>
                  <p className={styles.itemPrice}>
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
              <div className={styles.totalRow}>
                <p className={styles.totalLabel}>{t('total')}</p>
                <p className={styles.totalPrice}>${order.totalPrice.toLocaleString()}</p>
              </div>
            </div>

            <p className={styles.sectionTitleLarge}>{t('orderInfo')}</p>
            <div className={styles.orderInfoCard}>
              <div className={styles.orderInfoRow}>
                <span className={styles.orderInfoLabel}>{t('orderNumberLabel')}:</span>
                <span className={styles.orderInfoValue}>#{displayOrderNumber}</span>
              </div>
              <div className={styles.orderInfoRow}>
                <span className={styles.orderInfoLabel}>{t('orderId')}:</span>
                <span className={styles.orderInfoValueMono}>{orderId}</span>
              </div>
              <div className={styles.orderInfoRow}>
                <span className={styles.orderInfoLabel}>{t('creationDate')}:</span>
                <span className={styles.orderInfoValue}>
                  {new Date(order.createdAt).toLocaleString('es-ES')}
                </span>
              </div>
            </div>

            {(order.paymentInfo.bankAccount || order.paymentInfo.transferReference) && (
              <>
                <p className={styles.sectionTitleLarge}>{t('paymentInfo')}</p>
                <div className={styles.paymentCard}>
                  <div className={styles.paymentRow}>
                    <span className={styles.paymentLabel}>{t('method')}:</span>
                    <span className={styles.paymentValue}>{t('bankTransfer')}</span>
                  </div>
                  {order.paymentInfo.bankAccount && (
                    <div className={styles.paymentRow}>
                      <span className={styles.paymentLabel}>{t('bank')}:</span>
                      <span className={styles.paymentValue}>
                        {VENEZUELAN_BANKS.find(bank => bank.id === order.paymentInfo.bankAccount)?.name || order.paymentInfo.bankAccount}
                      </span>
                    </div>
                  )}
                  {order.paymentInfo.transferReference && (
                    <div className={styles.paymentRow}>
                      <span className={styles.paymentLabel}>{t('reference')}:</span>
                      <span className={`${styles.paymentValue} ${styles.paymentValueUpper}`}>
                        {order.paymentInfo.transferReference}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            <p className={styles.sectionTitleLarge}>{t('history')}</p>
            <div className={styles.timeline}>
              {order.logs?.map((log, index) => {
                return (
                  <div key={index} className={styles.timelineItem}>
                    <div className={styles.timelineContent}>
                      <p className={styles.timelineTitle}>{log.statusName}</p>
                      <p className={styles.timelineDate}>
                        {new Date(log.createdAt).toLocaleString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {log.comment && (
                        <p className={styles.timelineDate} style={{ marginTop: '4px' }}>
                          Nota: {log.comment}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className={styles.sectionTitleLarge}>Notas Internas</p>
            <div style={{ padding: '0 16px 16px' }}>
              <OrderNotes order={order} onNotesChange={handleNotesChange} updating={updatingNotes} />
            </div>
            
            <div style={{ height: '900px', width: '1px' }} />
          </div>

          {!isCompleted && !isCancelled && !isRefunded && (
          <div className={styles.actionBar}>
            <div className={styles.actionBarContent}>
              {isIssue ? (
                <>
                  <div className={styles.actionRow}>
                    {validNextStatuses.includes(OrderStatus.CANCELLED) && (
                      <button
                        className={`${styles.actionButton} ${styles.actionButtonCancel}`}
                        onClick={() => setCancelModalOpen(true)}
                        disabled={isDisabled}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>close</span>
                        Cancelar
                      </button>
                    )}
                    <button
                      className={`${styles.actionButton} ${styles.actionButtonRefund}`}
                      onClick={() => setRefundModalOpen(true)}
                      disabled={isDisabled}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>payments</span>
                      Reembolsar
                    </button>
                  </div>
                  {validNextStatuses.includes(OrderStatus.COMPLETED) && (
                    <button
                      className={styles.actionButtonPrimary}
                      onClick={() => {
                        setSelectedNextStatus(OrderStatus.COMPLETED);
                        setNextStatusModalOpen(true);
                      }}
                      disabled={isDisabled}
                    >
                      Completar Pedido
                      <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>check_circle</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div className={styles.actionRow}>
                    {order.status !== OrderStatus.ISSUE && validNextStatuses.includes(OrderStatus.ISSUE) && (
                      <button
                        className={`${styles.actionButton} ${styles.actionButtonIssue}`}
                        onClick={() => setIssueModalOpen(true)}
                        disabled={isDisabled}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>report</span>
                        Problema
                      </button>
                    )}
                    {validNextStatuses.includes(OrderStatus.CANCELLED) && (
                      <button
                        className={`${styles.actionButton} ${styles.actionButtonCancel}`}
                        onClick={() => setCancelModalOpen(true)}
                        disabled={isDisabled}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>close</span>
                        Cancelar
                      </button>
                    )}
                    {canRefund && (
                      <button
                        className={`${styles.actionButton} ${styles.actionButtonRefund}`}
                        onClick={() => setRefundModalOpen(true)}
                        disabled={isDisabled}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>payments</span>
                        Reembolsar
                      </button>
                    )}
                  </div>

                  {(isWaitingPayment || isPaymentFailed) && (
                    <button
                      className={styles.actionButtonPrimary}
                      onClick={() => setPaymentModalOpen(true)}
                      disabled={isDisabled}
                    >
                      {isPaymentFailed ? 'Reintentar Pago' : 'Confirmar Pago'}
                      <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>payments</span>
                    </button>
                  )}

                  {isCooking && cookingNextStatuses.length > 0 && (
                    <div className={styles.actionRow}>
                      {cookingNextStatuses.includes(OrderStatus.IN_TRANSIT) && (
                        <button
                          className={styles.actionButtonPrimary}
                          onClick={() => {
                            setSelectedNextStatus(OrderStatus.IN_TRANSIT);
                            setNextStatusModalOpen(true);
                          }}
                          disabled={isDisabled}
                        >
                          {OrderStatusLabels[OrderStatus.IN_TRANSIT]}
                          <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>delivery_dining</span>
                        </button>
                      )}
                      {cookingNextStatuses.includes(OrderStatus.WAITING_PICKUP) && (
                        <button
                          className={styles.actionButtonPrimary}
                          onClick={() => {
                            setSelectedNextStatus(OrderStatus.WAITING_PICKUP);
                            setNextStatusModalOpen(true);
                          }}
                          disabled={isDisabled}
                        >
                          {OrderStatusLabels[OrderStatus.WAITING_PICKUP]}
                          <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>storefront</span>
                        </button>
                      )}
                    </div>
                  )}

                  {canComplete && !isIssue && (
                    <button
                      className={styles.actionButtonPrimary}
                      onClick={() => setCompleteModalOpen(true)}
                      disabled={isDisabled}
                    >
                      Completar Pedido
                      <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>check_circle</span>
                    </button>
                  )}

                  {!isWaitingPayment && !isPaymentFailed && !isCooking && !canComplete && (
                    <button
                      className={styles.actionButtonPrimary}
                      onClick={() => setNextStatusModalOpen(true)}
                      disabled={isDisabled}
                    >
                      {OrderStatusLabels[nextStatus]}
                      <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>chevron_right</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          )}
        </div>
      </div>

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderId={orderId}
        onSuccess={onPaymentUpdate}
      />

      <IssueModal
        open={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        orderId={orderId}
        onSuccess={onPaymentUpdate}
      />

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
        onConfirm={() => {
          return onStatusChange(orderId, selectedNextStatus);
        }}
      />

      <CancelOrderModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        orderId={orderId}
        orderNumber={order.orderNumber || 0}
        onSuccess={onPaymentUpdate}
      />

      <RefundOrderModal
        open={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        orderId={orderId}
        orderNumber={order.orderNumber || 0}
        onSuccess={onPaymentUpdate}
      />

      <CustomerHistoryModal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        phoneNumber={order.customerPhone}
        customerName={order.customerName}
        getBurgerName={getBurgerName}
      />
    </>
  );
}
