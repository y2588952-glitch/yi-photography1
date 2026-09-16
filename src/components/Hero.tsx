'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, EffectFade } from 'swiper/modules';
import { HERO_SLIDES } from '@/lib/data';

import 'swiper/css';
import 'swiper/css/effect-fade';

// ---- Framer Motion variants ----
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.3,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

const totalSlides = HERO_SLIDES.length;

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  // ---- 滚动到指定区块 ----
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  // ---- 幻灯片切换 ----
  const onSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
    setProgress(0);
  }, []);

  // ---- 自动播放进度（percentage: 0 → 1） ----
  const onAutoplayTimeLeft = useCallback(
    (_s: SwiperType, _time: number, percentage: number) => {
      setProgress(percentage);
    },
    [],
  );

  // ---- 键盘导航 ----
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') swiperRef.current?.slidePrev();
      else if (e.key === 'ArrowRight') swiperRef.current?.slideNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ---- 悬停控制 ----
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    swiperRef.current?.autoplay?.stop();
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    swiperRef.current?.autoplay?.start();
  }, []);

  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-svh overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ============ Swiper 全屏背景 ============ */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        speed={1500}
        onSwiper={(s) => { swiperRef.current = s; }}
        onSlideChange={onSlideChange}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="absolute inset-0 w-full h-full"
      >
        {HERO_SLIDES.map((src, i) => (
          <SwiperSlide key={i}>
            <div
              className="hero-slide-bg absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${src})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ============ 暗色渐变遮罩 ============ */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.55) 0%,
              rgba(0,0,0,0.25) 40%,
              rgba(0,0,0,0.25) 60%,
              rgba(0,0,0,0.75) 100%
            )
          `,
        }}
      />

      {/* ============ 导航箭头 ============ */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className={`absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30
                    w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
                    rounded-full bg-black/20 border border-white/15 text-white/50
                    hover:bg-black/40 hover:text-gold hover:border-gold/30
                    transition-all duration-500 cursor-pointer
                    ${isHovering ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="上一张"
      >
        <ChevronLeft size={20} className="md:size-[22px]" />
      </button>

      <button
        onClick={() => swiperRef.current?.slideNext()}
        className={`absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30
                    w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
                    rounded-full bg-black/20 border border-white/15 text-white/50
                    hover:bg-black/40 hover:text-gold hover:border-gold/30
                    transition-all duration-500 cursor-pointer
                    ${isHovering ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="下一张"
      >
        <ChevronRight size={20} className="md:size-[22px]" />
      </button>

      {/* ============ 中间内容区（Framer Motion） ============ */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key="hero-content"
      >
        {/* 品牌标签 */}
        <motion.p
          className="text-[13px] tracking-[5px] text-gold mb-6 font-normal"
          variants={fadeUpItem}
        >
          风光摄影师&nbsp;&nbsp;·&nbsp;&nbsp;旅行摄影师
        </motion.p>

        {/* 品牌名称 */}
        <motion.h1
          className="font-serif text-[clamp(48px,8vw,96px)] font-bold text-white
                     leading-[1.05] mb-5 tracking-[2px]"
          variants={fadeUpItem}
        >
          亦<span className="text-gold font-light mx-1">·</span>Photography
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          className="text-[clamp(16px,2vw,20px)] text-white/60 font-light mb-14
                     max-w-[520px] leading-relaxed"
          variants={fadeUpItem}
        >
          穿越山海，捕捉光影。每一帧都是与自然的对话。
        </motion.p>

        {/* CTA 按钮组 */}
        <motion.div
          className="flex gap-4 flex-wrap justify-center
                     max-sm:flex-col max-sm:w-full max-sm:max-w-[280px]"
          variants={fadeUpItem}
        >
          <button
            onClick={() => scrollTo('gallery')}
            className="px-10 py-3.5 bg-gold text-[#1a1a1a] text-[15px] font-medium
                       tracking-[1px] hover:bg-gold-light hover:-translate-y-0.5
                       transition-all hover:shadow-[0_8px_30px_rgba(201,169,110,0.35)]
                       max-sm:w-full cursor-pointer"
          >
            查看作品
          </button>

          <button
            onClick={() => scrollTo('contact')}
            className="px-10 py-3.5 bg-transparent text-white border border-white/30
                       text-[15px] font-medium tracking-[1px] hover:border-white
                       hover:bg-white/5 hover:-translate-y-0.5 transition-all
                       max-sm:w-full cursor-pointer"
          >
            立即预约
          </button>
        </motion.div>
      </motion.div>

      {/* ============ 底部控制栏 ============ */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center pb-4 px-6">
        {/* 进度条 */}
        <div className="w-full max-w-[560px] h-[2px] bg-white/10 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gold rounded-full hero-progress-bar"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* 计数器 + 分页点 */}
        <div className="flex items-center gap-5">
          <span className="text-white/40 text-xs tracking-[3px] font-light tabular-nums min-w-[28px] text-right select-none">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>

          <div className="flex gap-3">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => swiperRef.current?.slideToLoop(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer
                  ${i === activeIndex
                    ? 'bg-gold shadow-[0_0_8px_rgba(201,169,110,0.5)] w-5'
                    : 'bg-white/25 hover:bg-white/45 w-2'
                  }`}
                aria-label={`第 ${i + 1} 张`}
              />
            ))}
          </div>

          <span className="text-white/40 text-xs tracking-[3px] font-light tabular-nums min-w-[28px] text-left select-none">
            {String(totalSlides).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ============ 滚动指示器 ============ */}
      <button
        onClick={() => scrollTo('gallery')}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-5 h-8
                   border border-white/15 rounded-full flex justify-center pt-1.5
                   cursor-pointer hover:border-gold/40 hover:text-gold transition-colors"
        aria-label="向下滚动"
      >
        <ChevronDown size={12} className="text-white/40 animate-scroll-bounce" />
      </button>
    </section>
  );
}
