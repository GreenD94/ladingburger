import { useEffect, useRef, useState } from 'react';
import { INTERSECTION_THRESHOLD } from '../constants/dimensions.constants';

interface UseIntersectionObserverOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
}

export const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    const hasElement = currentElement !== null;

    if (!hasElement) {
      return;
    }

    const threshold = options.threshold ?? INTERSECTION_THRESHOLD;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold,
        root: options.root ?? null,
        rootMargin: options.rootMargin,
      }
    );

    const currentObserver = observerRef.current;
    currentObserver.observe(currentElement);

    return () => {
      if (currentObserver) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [options.threshold, options.root, options.rootMargin]);

  return { isVisible, elementRef };
};

