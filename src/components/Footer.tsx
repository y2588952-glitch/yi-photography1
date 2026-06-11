'use client';
import { useState, useEffect } from 'react';
import { ArrowUp, Send, Heart } from 'lucide-react';
import { NAV_LINKS, SERVICES } from '@/lib/data';

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="bg-surface border-t border-white/5 pt-20 pb-8 max-lg:pt-16 max-sm:pt-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr] gap-10 mb-16 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-8">
            {/* Brand */}
            <div>
              <a
                href="#home"
                onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
                className="flex items-baseline gap-1.5 mb-5"
              >
                <span className="font-serif text-[28px] font-bold text-white leading-none">亦</span>
                <span className="text-[10px] font-medium tracking-[3px] text-gold">PHOTOGRAPHY</span>
              </a>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                穿越山海，捕捉光影。<br />
                每一帧都是与自然的对话。
              </p>
            </div>

            {/* Quick Nav */}
            <div>
              <h4 className="text-[13px] text-white font-medium tracking-[1px] mb-5 uppercase">快速导航</h4>
              <ul className="space-y-3">
                {NAV_LINKS.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                      className="text-[13px] text-text-secondary hover:text-gold transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-[13px] text-white font-medium tracking-[1px] mb-5 uppercase">服务项目</h4>
              <ul className="space-y-3">
                {SERVICES.map(s => (
                  <li key={s.id}>
                    <a
                      href="#services"
                      onClick={(e) => { e.preventDefault(); scrollToSection('#services'); }}
                      className="text-[13px] text-text-secondary hover:text-gold transition-colors"
                    >
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-[13px] text-white font-medium tracking-[1px] mb-5 uppercase">订阅更新</h4>
              <p className="text-[13px] text-text-secondary mb-4">获取最新作品与旅拍故事</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = (e.target as HTMLFormElement).querySelector('input');
                  if (input) input.value = '';
                }}
                className="flex"
              >
                <input
                  type="email"
                  placeholder="你的邮箱地址"
                  required
                  className="flex-1 px-4 py-2.5 bg-surface-input border border-border-default rounded-l text-text-primary text-[13px]
                    placeholder:text-text-muted outline-none transition-all
                    focus:border-gold focus:ring-1 focus:ring-gold/30"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gold text-[#1a1a1a] rounded-r hover:bg-gold-light transition-all flex items-center justify-center"
                  aria-label="订阅"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5 flex justify-between items-center flex-wrap gap-4
            max-sm:flex-col max-sm:text-center">
            <p className="text-[12px] text-text-muted">
              &copy; 2026 亦&middot;PHOTOGRAPHY. All rights reserved.
            </p>
            <p className="text-[12px] text-text-muted flex items-center gap-1">
              Designed with <Heart size={12} className="text-red-500 fill-red-500" /> for photography lovers
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-10 right-10 z-50 w-11 h-11 rounded-full bg-gold text-[#1a1a1a]
          flex items-center justify-center border-none cursor-pointer shadow-[0_4px_15px_rgba(201,169,110,0.4)]
          hover:bg-gold-light hover:-translate-y-1 transition-all
          max-sm:bottom-6 max-sm:right-6 max-sm:w-10 max-sm:h-10
          ${showBackToTop ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}`}
        aria-label="回到顶部"
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
}
