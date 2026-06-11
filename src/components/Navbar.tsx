'use client';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Camera, BookOpen } from 'lucide-react';
import { NAV_LINKS } from '@/lib/data';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import WechatLogin from './WechatLogin';

const sectionIds = NAV_LINKS.map(l => l.href.replace('#', ''));

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tooltipIcon, setTooltipIcon] = useState<string | null>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { activeId, scrolled } = useScrollSpy(sectionIds);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const showTooltip = (icon: string) => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setTooltipIcon(icon);
    tooltipTimer.current = setTimeout(() => setTooltipIcon(null), 2000);
  };

  const handleSocialClick = (label: string) => {
    showTooltip(label);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[1000] h-20 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/95 backdrop-blur-xl border-b border-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
           className="flex items-baseline gap-1.5 z-[1001]">
          <span className="font-serif text-[28px] font-bold text-white leading-none">亦</span>
          <span className="text-[10px] font-medium tracking-[3px] text-gold">PHOTOGRAPHY</span>
        </a>

        {/* Desktop Menu */}
        <ul className="flex items-center gap-9 max-md:hidden">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className={`relative text-sm tracking-[1px] py-1.5 transition-colors
                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold after:transition-all
                  ${activeId === link.href.replace('#', '')
                    ? 'text-white after:w-full'
                    : 'text-text-secondary after:w-0 hover:text-white hover:after:w-full'
                  }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Social Icons */}
        <div className="flex items-center gap-4 max-md:hidden">
          <a href="#" onClick={(e) => { e.preventDefault(); handleSocialClick('Instagram'); }}
             className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-transparent
                        text-text-secondary hover:text-gold hover:border-gold hover:bg-gold/10 transition-all"
             aria-label="Instagram">
            <Camera size={16} />
            {tooltipIcon === 'Instagram' && (
              <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gold text-[#1a1a1a] text-[11px] font-medium
                               px-2.5 py-1.5 rounded whitespace-nowrap pointer-events-none animate-fade-in z-10">
                Instagram 即将上线
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-gold" />
              </span>
            )}
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleSocialClick('小红书'); }}
             className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-transparent
                        text-text-secondary hover:text-gold hover:border-gold hover:bg-gold/10 transition-all"
             aria-label="小红书">
            <BookOpen size={16} />
            {tooltipIcon === '小红书' && (
              <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gold text-[#1a1a1a] text-[11px] font-medium
                               px-2.5 py-1.5 rounded whitespace-nowrap pointer-events-none animate-fade-in z-10">
                小红书 即将上线
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-gold" />
              </span>
            )}
          </a>
          {/* 微信扫码登录 */}
          <WechatLogin />
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hidden max-md:flex flex-col gap-[5px] bg-none border-none cursor-pointer z-[1001] p-1"
          aria-label="菜单"
        >
          <span className={`block w-6 h-0.5 bg-white rounded-sm transition-all ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white rounded-sm transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white rounded-sm transition-all ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>

        {/* Mobile Overlay */}
        <div
          className={`fixed inset-0 bg-surface/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8
            transition-opacity duration-300 z-[1000]
            ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className="text-xl text-text-secondary hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
