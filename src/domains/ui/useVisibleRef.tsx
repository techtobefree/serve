import { useEffect, useRef, useState } from "react";

export function useVisibleRef(): [
  React.LegacyRef<HTMLDivElement> | undefined,
  boolean
] {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update the visibility state based on intersection status
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Adjust threshold as needed
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    const refCopy = ref.current;

    return () => {
      if (refCopy) {
        observer.unobserve(refCopy);
      }
    };
  }, [ref]);

  return [ref, isVisible];
}
