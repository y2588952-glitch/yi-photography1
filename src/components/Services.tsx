'use client';
import { Camera, Mountain, Building2, Wand, Check } from 'lucide-react';
import { SERVICES } from '@/lib/data';
import { useIntersection } from '@/hooks/useIntersection';

const iconMap: Record<string, React.ElementType> = {
  Camera, Mountain, Building2, Wand,
};

export default function Services() {
  const { ref, isVisible } = useIntersection({ threshold: 0.05 });

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-[120px] bg-surface max-lg:py-20 max-sm:py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-medium tracking-[4px] text-gold uppercase mb-4
            before:content-[''] before:inline-block before:w-6 before:h-px before:bg-gold/50 before:align-middle before:mx-3
            after:content-[''] after:inline-block after:w-6 after:h-px after:bg-gold/50 after:align-middle after:mx-3
            max-sm:before:hidden max-sm:after:hidden">
            SERVICES
          </span>
          <h2 className="font-serif text-[42px] font-bold text-white mb-4 tracking-[2px] max-lg:text-[34px] max-sm:text-[28px]">
            服务与报价
          </h2>
          <p className="text-base text-text-secondary font-light">为每一位客户量身定制专属拍摄方案</p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:max-w-[400px] max-sm:mx-auto"
        >
          {SERVICES.map((service, i) => {
            const Icon = iconMap[service.icon] || Camera;
            return (
              <div
                key={service.id}
                className={`relative bg-surface-card p-10 text-center rounded border transition-all duration-300 flex flex-col items-center
                  hover:border-border-light hover:bg-surface-hover hover:-translate-y-2 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]
                  ${service.featured ? 'border-gold bg-gradient-to-b from-gold/8 to-surface-card' : 'border-transparent'}
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {service.badge && (
                  <span className="absolute top-4 right-4 bg-gold text-[#1a1a1a] text-[11px] font-semibold px-3 py-1 tracking-[1px]">
                    {service.badge}
                  </span>
                )}
                <div className="w-[72px] h-[72px] rounded-full bg-gold/10 flex items-center justify-center mb-6 text-[28px] text-gold
                  group-hover:bg-gold group-hover:text-[#1a1a1a] transition-all">
                  <Icon size={28} />
                </div>
                <h3 className="font-serif text-xl text-white mb-3">{service.name}</h3>
                <p className="text-[13px] text-text-secondary leading-relaxed mb-5 flex-1">{service.desc}</p>
                <div className="mb-5">
                  <span className="font-serif text-[32px] font-bold text-gold">{service.price}</span>
                  <span className="text-[13px] text-text-muted">{service.unit}</span>
                </div>
                <ul className="w-full text-left mb-7">
                  {service.features.map(f => (
                    <li key={f} className="text-[13px] text-text-secondary py-2 border-b border-white/5 flex items-center gap-2.5">
                      <Check size={12} className="text-gold shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={scrollToContact}
                  className="px-6 py-2.5 bg-gold text-[#1a1a1a] text-[13px] font-medium tracking-[1px]
                    hover:bg-gold-light hover:-translate-y-0.5 transition-all hover:shadow-[0_8px_25px_rgba(201,169,110,0.3)]"
                >
                  立即预约
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
