import { useEffect, useState } from 'react';

export const useFirstItemAnimation = (index: number) => {
  const [hasAnimatedCheckers, setHasAnimatedCheckers] = useState(false);
  const isFirstItem = index === 0;

  useEffect(() => {
    if (isFirstItem) {
      setHasAnimatedCheckers(true);
    }
  }, [isFirstItem]);

  return { hasAnimatedCheckers, isFirstItem };
};

