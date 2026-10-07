import { useEffect, useRef } from 'react';

// Calls onReachEnd when the returned element scrolls near the screen.
// Put the returned reference on an empty <div> at the bottom of the list.
export default function useInfiniteScroll(onReachEnd, isActive) {
  const sentinelElementReference = useRef(null);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const sentinelElement = sentinelElementReference.current;
    if (!sentinelElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          onReachEnd();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinelElement);

    return () => {
      observer.disconnect();
    };
  }, [onReachEnd, isActive]);

  return sentinelElementReference;
}
