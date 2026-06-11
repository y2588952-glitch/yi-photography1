'use client';
import { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/data';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const total = TESTIMONIALS.length;

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="testimonials" className="py-[120px] bg-surface-secondary max-lg:py-20 max-sm:py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-medium tracking-[4px] text-gold uppercase mb-4
            before:content-[''] before:inline-block before:w-6 before:h-px before:bg-gold/50 before:align-middle before:mx-3
            after:content-[''] after:inline-block after:w-6 after:h-px after:bg-gold/50 after:align-middle after:mx-3
            max-sm:before:hidden max-sm:after:hidden">
            TESTIMONIALS
          </span>
          <h2 className="font-serif text-[42px] font-bold text-white mb-4 tracking-[2px] max-lg:text-[34px] max-sm:text-[28px]">
            客户心声
          </h2>
          <p className="text-base text-text-secondary font-light">来自每一位信任我的客户的真实评价</p>
        </div>

        {/* Slider */}
        <div className="overflow-hidden max-w-[800px] mx-auto">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {TESTIMONIALS.map(t => (
              <div key={t.id} className="min-w-full p-10 text-center max-sm:p-5">
                <div className="flex justify-center gap-0.5 mb-5 text-gold text-sm tracking-[2px]">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="font-serif text-lg text-[#ddd] leading-relaxed mb-7 italic max-sm:text-[15px]">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center justify-center gap-3.5 text-left">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-[52px] h-[52px] rounded-full object-cover border-2 border-gold"
                  />
                  <div>
                    <h4 className="text-[15px] text-white">{t.name}</h4>
                    <span className="text-xs text-text-muted">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2.5 mt-6">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full border-none cursor-pointer transition-all ${
                i === current ? 'w-6 bg-gold' : 'w-2 bg-white/20'
              }`}
              aria-label={`第 ${i + 1} 条评价`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
