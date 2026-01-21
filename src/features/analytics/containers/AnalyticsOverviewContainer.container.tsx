'use client';

import { SafeArea } from '@/features/shared/components/SafeArea.component';
import { AnalyticsOverview } from '@/features/analytics/components/AnalyticsOverview.component';
import styles from '@/features/analytics/styles/AnalyticsOverviewContainer.module.css';

export default function AnalyticsOverviewContainer() {
  return (
    <SafeArea className={styles.container} sides="all">
      <AnalyticsOverview />
    </SafeArea>
  );
}

