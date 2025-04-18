'use client';

import { useState, useEffect } from 'react';

interface TimerInfo {
  timeString: string;
  color: 'success' | 'warning' | 'error';
}

export function useOrderTimer(startTime: string): TimerInfo {
  const [timerInfo, setTimerInfo] = useState<TimerInfo>({
    timeString: '',
    color: 'success'
  });

  useEffect(() => {
    const startDate = new Date(startTime);
    const now = new Date();
    
    // If the start date is in the future, use current time instead
    const effectiveStartDate = startDate > now ? now : startDate;
    
    const timer = setInterval(() => {
      const currentTime = new Date();
      const diff = currentTime.getTime() - effectiveStartDate.getTime();
      
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const years = Math.floor(days / 365);

      // Calculate remaining time after larger units
      const remainingDays = days % 365;
      const remainingHours = hours % 24;
      const remainingMinutes = minutes % 60;

      // Build descriptive time string
      const parts: string[] = [];
      
      if (years > 0) {
        parts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
      }
      if (remainingDays > 0) {
        parts.push(`${remainingDays} ${remainingDays === 1 ? 'día' : 'días'}`);
      }
      if (remainingHours > 0) {
        parts.push(`${remainingHours} ${remainingHours === 1 ? 'hora' : 'horas'}`);
      }
      if (remainingMinutes > 0) {
        parts.push(`${remainingMinutes} ${remainingMinutes === 1 ? 'minuto' : 'minutos'}`);
      }

      // Join parts with appropriate connectors
      let timeString = '';
      if (parts.length > 1) {
        const lastPart = parts.pop();
        timeString = `${parts.join(', ')} y ${lastPart}`;
      } else {
        timeString = parts[0] || '0 minutos';
      }

      // Determine color based on elapsed time
      let color: 'success' | 'warning' | 'error' = 'success';
      if (minutes > 20) {
        color = 'error';
      } else if (minutes > 10) {
        color = 'warning';
      }

      setTimerInfo({ timeString, color });
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  return timerInfo;
} 