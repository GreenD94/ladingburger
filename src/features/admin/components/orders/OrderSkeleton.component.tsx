'use client';

import styles from '@/features/admin/styles/Skeleton.module.css';

export function OrderSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonCardHeader}>
        <div className={`${styles.skeleton} ${styles.skeletonCircular}`} />
        <div className={styles.skeletonCardContent}>
          <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '40%' }} />
          <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '60%' }} />
        </div>
        <div className={`${styles.skeleton} ${styles.skeletonRect}`} style={{ width: '80px', height: '32px' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {[1, 2, 3].map((index) => (
          <div key={index} style={{ display: 'flex', gap: '8px' }}>
            <div className={`${styles.skeleton} ${styles.skeletonRect}`} style={{ width: '24px', height: '24px' }} />
            <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '70%' }} />
          </div>
        ))}
      </div>

      <div className={styles.skeletonCardFooter}>
        <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '30%' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className={`${styles.skeleton} ${styles.skeletonRect}`} style={{ width: '100px', height: '36px' }} />
          <div className={`${styles.skeleton} ${styles.skeletonRect}`} style={{ width: '100px', height: '36px' }} />
        </div>
      </div>
    </div>
  );
}
