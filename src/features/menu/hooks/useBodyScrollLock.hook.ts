import { useEffect } from 'react';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';

export const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    const shouldLockBody = isLocked;
    
    if (shouldLockBody) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = EMPTY_STRING;
    }
    
    return () => {
      document.body.style.overflow = EMPTY_STRING;
    };
  }, [isLocked]);
};

