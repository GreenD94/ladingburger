'use client';

import { OrderSkeleton } from './OrderSkeleton.component';
import styles from '@/features/admin/styles/Skeleton.module.css';

export function OrderSkeletonList() {
  return (
    <div className={styles.skeletonList}>
      <div className={styles.skeletonHeader}>
        <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '200px', height: '40px' }} />
        <div className={`${styles.skeleton} ${styles.skeletonRect}`} style={{ width: '100px', height: '40px' }} />
      </div>

      <div className={styles.skeletonChips}>
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className={`${styles.skeleton} ${styles.skeletonRect}`} style={{ width: '120px', height: '48px' }} />
        ))}
      </div>

      {[1, 2, 3, 4, 5].map((index) => (
        <OrderSkeleton key={index} />
      ))}
    </div>
  );
}
