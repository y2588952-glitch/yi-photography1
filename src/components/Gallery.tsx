'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_ITEMS, GALLERY_FILTERS } from '@/lib/data';
import Lightbox from './Lightbox';
import type { GalleryItem } from '@/lib/types';

// ---- JSON-LD 结构化数据 ----
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: '亦 Photography 作品精选',
  description: '风光旅行摄影师亦的作品集，涵盖自然风光、城市建筑、人文纪实、旅行随笔',
  author: { '@type': 'Person', name: '亦' },
  image: GALLERY_ITEMS.map(item => ({
    '@type': 'ImageObject',
    name: item.title,
    contentUrl: item.src,
    description: item.alt,
    width: item.width,
    height: item.height,
  })),
};

// ---- Framer Motion 变体 ----
const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.25 },
  },
};

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => GALLERY_ITEMS.filter(item => filter === 'all' || item.category === filter),
    [filter],
  );

  const openLightbox = (item: GalleryItem) => {
    const idx = filtered.indexOf(item);
    if (idx !== -1) setLightboxIndex(idx);
  };

  return (
    <section id="gallery" className="py-[120px] bg-surface max-lg:py-20 max-sm:py-16">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* ======== Section Header ======== */}
        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-medium tracking-[4px] text-gold uppercase mb-4
            before:content-[''] before:inline-block before:w-6 before:h-px before:bg-gold/50 before:align-middle before:mx-3
            after:content-[''] after:inline-block after:w-6 after:h-px after:bg-gold/50 after:align-middle after:mx-3
            max-sm:before:hidden max-sm:after:hidden"
          >
            PORTFOLIO
          </span>
          <h2 className="font-serif text-[42px] font-bold text-white mb-4 tracking-[2px] max-lg:text-[34px] max-sm:text-[28px]">
            作品精选
          </h2>
          <p className="text-base text-text-secondary font-light">
            每一次快门，都是与光影的邂逅
          </p>
        </div>

        {/* ======== 筛选按钮 ======== */}
        <div className="flex justify-center gap-3 flex-wrap mb-12 max-sm:gap-2">
          {GALLERY_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-6 py-2.5 text-[13px] tracking-[1px] border transition-all cursor-pointer
                max-sm:px-4 max-sm:py-2 max-sm:text-xs
                ${filter === f.key
                  ? 'bg-gold text-[#1a1a1a] border-gold'
                  : 'text-text-secondary border-border-default bg-transparent hover:border-gold hover:text-gold'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ======== Masonry 瀑布流 ======== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="columns-3 gap-5 max-lg:columns-2 max-sm:columns-1 max-sm:gap-0"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {filtered.map(item => (
              <motion.figure
                key={item.id}
                layout
                variants={itemVariants}
                onClick={() => openLightbox(item)}
                className="break-inside-avoid mb-5 relative overflow-hidden cursor-pointer rounded group"
                itemProp="image"
                itemScope
                itemType="https://schema.org/ImageObject"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  className="w-full h-auto block transition-transform duration-[0.6s] group-hover:scale-105"
                  itemProp="contentUrl"
                />
                {/* 悬停遮罩 */}
                <figcaption
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent
                    flex flex-col justify-end p-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  itemProp="caption"
                >
                  <h3 className="font-serif text-lg text-white mb-1 translate-y-2.5 group-hover:translate-y-0 transition-transform">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gold tracking-[2px] translate-y-2.5 group-hover:translate-y-0 transition-transform delay-[50ms]">
                    {item.categoryLabel}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ======== Lightbox ======== */}
      <Lightbox
        items={filtered}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() =>
          setLightboxIndex(i =>
            i !== null ? (i > 0 ? i - 1 : filtered.length - 1) : 0,
          )
        }
        onNext={() =>
          setLightboxIndex(i =>
            i !== null ? (i + 1) % filtered.length : 0,
          )
        }
      />
    </section>
  );
}
