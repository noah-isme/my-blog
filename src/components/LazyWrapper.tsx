'use client';

import { useState, useEffect, ReactNode } from 'react';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
}

export function LazyWrapper({
  children,
  fallback = null,
  rootMargin = '50px'
}: LazyWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return (
    <div ref={setRef}>
      {isVisible ? children : fallback}
    </div>
  );
}