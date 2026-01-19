import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../lib/cn';

const SCROLL_THRESHOLD = 320;

const ToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setIsVisible(scrollTop >= SCROLL_THRESHOLD);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const scrollElement =
      document.scrollingElement || document.documentElement || document.body;
    if (!scrollElement) return;

    const start = scrollElement.scrollTop;
    if (start === 0) return;
    const duration = 520;
    const startTime = window.performance?.now?.() || Date.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const current = now || Date.now();
      const elapsed = Math.min((current - startTime) / duration, 1);
      const eased = easeOutCubic(elapsed);
      scrollElement.scrollTop = Math.round(start * (1 - eased));
      if (elapsed < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Volver arriba"
      className={cn(
        'fixed bottom-6 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 shadow-lg shadow-slate-200/70 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <ArrowUp size={14} />
      ToTop
    </button>
  );
};

export default ToTop;
