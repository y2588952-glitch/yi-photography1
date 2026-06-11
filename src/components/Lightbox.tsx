'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryItem } from '@/lib/types';

interface Props {
  items: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

// ---- 滑动动画变体 ----
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
};

const slideTransition = {
  x: { type: 'spring', stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

export default function Lightbox({ items, currentIndex, onClose, onPrev, onNext }: Props) {
  // ⚠️ 所有 hooks 必须在 early return 之前调用（React 规则）
  const [mounted, setMounted] = useState(false);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);

  useEffect(() => { setMounted(true); }, []);

  const isOpen = currentIndex !== null;
  const item = currentIndex !== null ? items[currentIndex] : null;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const threshold = 50;
      if (deltaX < -threshold) { setDirection(1); onNext(); }
      else if (deltaX > threshold) { setDirection(-1); onPrev(); }
    },
    [onNext, onPrev],
  );

  const handlePrevClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(-1);
    onPrev();
  }, [onPrev]);

  const handleNextClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(1);
    onNext();
  }, [onNext]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') { setDirection(1); onNext(); }
    if (e.key === 'ArrowLeft')  { setDirection(-1); onPrev(); }
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKey]);

  // SSR 守卫：只在客户端渲染 Portal（所有 hooks 已调用完毕）
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          key="lightbox-overlay"
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <div className="absolute inset-0" />

          {/* 关闭 */}
          <motion.button
            onClick={onClose}
            className="absolute top-6 right-8 z-10 bg-none border-none cursor-pointer
              text-white/70 hover:text-gold transition-colors max-sm:top-4 max-sm:right-4"
            aria-label="关闭"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <X size={36} className="max-sm:size-7" />
          </motion.button>

          {/* 上一张 */}
          <button
            onClick={handlePrevClick}
            className="absolute left-8 top-1/2 -translate-y-1/2 z-10 w-[50px] h-[50px]
              rounded-full bg-white/10 text-white flex items-center justify-center border-none
              cursor-pointer hover:bg-gold hover:text-[#1a1a1a] transition-all
              max-sm:left-3 max-sm:w-[38px] max-sm:h-[38px]"
            aria-label="上一张"
          >
            <ChevronLeft size={24} className="max-sm:size-[18px]" />
          </button>

          {/* 下一张 */}
          <button
            onClick={handleNextClick}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-10 w-[50px] h-[50px]
              rounded-full bg-white/10 text-white flex items-center justify-center border-none
              cursor-pointer hover:bg-gold hover:text-[#1a1a1a] transition-all
              max-sm:right-3 max-sm:w-[38px] max-sm:h-[38px]"
            aria-label="下一张"
          >
            <ChevronRight size={24} className="max-sm:size-[18px]" />
          </button>

          {/* 图片区域 */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] text-center select-none
              max-sm:max-w-[95vw] max-sm:max-h-[70vh]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="flex flex-col items-center"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  className="max-w-full max-h-[75vh] object-contain rounded-sm
                    shadow-[0_8px_40px_rgba(0,0,0,0.6)] max-sm:max-h-[55vh]"
                  draggable={false}
                />
                <motion.div
                  className="mt-5 max-sm:mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                >
                  <h3 className="font-serif text-xl text-white mb-1 max-sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gold tracking-[3px]">
                    {item.categoryLabel}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 计数器 */}
          <motion.span
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30
              text-xs tracking-[3px] font-light tabular-nums max-sm:bottom-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {currentIndex! + 1} / {items.length}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
