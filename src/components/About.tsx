'use client';
import { Camera, BookOpen, MessageCircle, Globe } from 'lucide-react';
import { ABOUT_STATS, SOCIAL_LINKS } from '@/lib/data';
import { useIntersection } from '@/hooks/useIntersection';
import { useCountUp } from '@/hooks/useCountUp';

const iconMap: Record<string, React.ElementType> = {
  Camera, BookOpen, MessageCircle, Globe,
};

function StatCard({ value, suffix, label, visible }: { value: number; suffix?: string; label: string; visible: boolean }) {
  const count = useCountUp(value, 2000, visible);
  return (
    <div className="py-8 px-4 bg-surface-card rounded border border-transparent hover:border-border-light hover:bg-surface-hover transition-all text-center">
      <span className="font-serif text-5xl font-bold text-gold block leading-none mb-2 max-sm:text-4xl">
        {count.toLocaleString()}{suffix && <span className="text-4xl max-sm:text-3xl">{suffix}</span>}
      </span>
      <span className="text-sm text-text-secondary tracking-[1px]">{label}</span>
    </div>
  );
}

export default function About() {
  const { ref: statsRef, isVisible: statsVisible } = useIntersection({ threshold: 0.3 });
  const { ref: imgRef, isVisible: imgVisible } = useIntersection({ threshold: 0.1 });
  const { ref: textRef, isVisible: textVisible } = useIntersection({ threshold: 0.1 });

  return (
    <section id="about" className="py-[120px] bg-surface-secondary max-lg:py-20 max-sm:py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-[1fr_1.5fr] gap-20 items-center mb-20 max-lg:grid-cols-1 max-lg:gap-12 max-lg:text-center">
          {/* Image */}
          <div className="flex flex-col items-center gap-6">
            <div
              ref={imgRef}
              className={`relative rounded overflow-hidden border-2 border-border-default
                before:content-[''] before:absolute before:-top-2.5 before:-left-2.5 before:w-full before:h-full
                before:border-2 before:border-gold before:rounded before:-z-10
                transition-all duration-[0.6s] ${imgVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
            >
              <img
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&q=80"
                alt="摄影师 亦"
                className="w-[360px] h-[480px] object-cover max-lg:w-[280px] max-lg:h-[380px] max-lg:mx-auto"
              />
            </div>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map(s => {
                const Icon = iconMap[s.icon] || Globe;
                return (
                  <a key={s.label} href={s.href} aria-label={s.label}
                    className="w-11 h-11 rounded-full border border-border-default flex items-center justify-center
                      text-text-secondary text-lg hover:border-gold hover:text-gold hover:bg-gold/10 transition-all">
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Text */}
          <div
            ref={textRef}
            className={`transition-all duration-[0.6s] ${textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            <span className="inline-block text-xs font-medium tracking-[4px] text-gold uppercase mb-4
              before:content-[''] before:inline-block before:w-6 before:h-px before:bg-gold/50 before:align-middle before:mx-3
              after:content-[''] after:inline-block after:w-6 after:h-px after:bg-gold/50 after:align-middle after:mx-3
              max-sm:before:hidden max-sm:after:hidden">
              ABOUT ME
            </span>
            <h2 className="font-serif text-[42px] font-bold text-white mb-4 tracking-[2px] max-lg:text-[34px] max-sm:text-[28px]">
              我是亦
            </h2>
            <p className="text-xl font-light text-white leading-relaxed mb-4">
              一名自由风光摄影师，行走了 <strong className="text-gold font-medium">20+</strong> 个国家，穿越山川湖海，
              用镜头捕捉大自然最真实、最动人的瞬间。
            </p>
            <p className="text-[15px] text-text-secondary mb-3 leading-relaxed">
              从青藏高原的雪山到冰岛的极光，从江南水乡的晨雾到撒哈拉的星空——
              每一次按下快门，都是与这个世界的一次深情对话。
              我相信，好的照片不仅仅是画面的记录，更是情感与故事的传递。
            </p>
            <p className="text-[15px] text-text-secondary mb-0 leading-relaxed">
              常年旅居在路上，接受各地旅拍、商业风光及摄影教学合作。
              愿与每一个热爱光影的你，共同记录这个世界的温度。
            </p>
            <blockquote className="mt-6 p-5 border-l-[3px] border-gold font-serif text-lg text-text-primary italic bg-gold/5">
              &ldquo;摄影对我来说，不是工作，而是一种生活方式。&rdquo;
            </blockquote>
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:gap-3"
        >
          {ABOUT_STATS.map(s => (
            <StatCard key={s.label} {...s} visible={statsVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
