'use client';
import { useState, useEffect, useCallback } from 'react';

export function useScrollSpy(sectionIds: string[], offset = 120) {
  const [activeId, setActiveId] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setScrolled(scrollY > 50);

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.offsetTop - offset;
      const bottom = top + el.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        setActiveId(id);
        break;
      }
    }
  }, [sectionIds, offset]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { activeId, scrolled };
}
