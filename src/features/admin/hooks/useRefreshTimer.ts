import { useState, useEffect, useCallback } from 'react';

interface UseRefreshTimerProps {
  onRefresh: () => void;
  initialTime?: number;
  cooldownTime?: number;
}

export function useRefreshTimer({ 
  onRefresh, 
  initialTime = 60, 
  cooldownTime = 10 
}: UseRefreshTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isCooldown, setIsCooldown] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    // Cooldown timer
    if (isCooldown) {
      const cooldownTimer = setTimeout(() => {
        setIsCooldown(false);
        setIsDisabled(false);
      }, cooldownTime * 1000);
      return () => clearTimeout(cooldownTimer);
    }
  }, [isCooldown, cooldownTime]);

  useEffect(() => {
    // Main timer
    if (!isCooldown) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onRefresh();
            return initialTime;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCooldown, initialTime, onRefresh]);

  const handleRefresh = useCallback(() => {
    if (!isDisabled) {
      onRefresh();
      setTimeLeft(initialTime);
      setIsCooldown(true);
      setIsDisabled(true);
    }
  }, [isDisabled, initialTime, onRefresh]);

  return {
    timeLeft,
    isDisabled,
    handleRefresh,
  };
} 