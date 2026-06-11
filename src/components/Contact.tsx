'use client';
import { useState, type FormEvent } from 'react';
import { Mail, MessageCircle, MapPin, Loader2, CheckCircle2, Send } from 'lucide-react';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/lib/data';
import { useIntersection } from '@/hooks/useIntersection';

const iconMap: Record<string, React.ElementType> = {
  Mail, MessageCircle, MapPin,
};

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { ref: formRef, isVisible: formVisible } = useIntersection({ threshold: 0.05 });
  const { ref: infoRef, isVisible: infoVisible } = useIntersection({ threshold: 0.1 });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section id="contact" className="py-[120px] bg-surface-secondary max-lg:py-20 max-sm:py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-medium tracking-[4px] text-gold uppercase mb-4
            before:content-[''] before:inline-block before:w-6 before:h-px before:bg-gold/50 before:align-middle before:mx-3
            after:content-[''] after:inline-block after:w-6 after:h-px after:bg-gold/50 after:align-middle after:mx-3
            max-sm:before:hidden max-sm:after:hidden">
            CONTACT
          </span>
          <h2 className="font-serif text-[42px] font-bold text-white mb-4 tracking-[2px] max-lg:text-[34px] max-sm:text-[28px]">
            联系我
          </h2>
          <p className="text-base text-text-secondary font-light">期待与你一起创造独一无二的光影记忆</p>
        </div>

        <div className="grid grid-cols-[1fr_380px] gap-12 max-lg:grid-cols-1 max-sm:gap-8">
          {/* Form */}
          <div
            ref={formRef}
            className={`transition-all duration-[0.6s] ${formVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 px-8 bg-surface-card rounded border border-gold/30 text-center">
                <CheckCircle2 size={56} className="text-gold mb-5" />
                <h3 className="font-serif text-2xl text-white mb-3">预约提交成功！</h3>
                <p className="text-text-secondary text-[15px] leading-relaxed">
                  感谢你的信任，我将在 <strong className="text-gold">24小时内</strong> 回复你。
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 px-6 py-2.5 bg-gold text-[#1a1a1a] text-[13px] font-medium tracking-[1px]
                    hover:bg-gold-light hover:-translate-y-0.5 transition-all"
                >
                  继续提交
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1 max-sm:gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-[13px] text-text-secondary tracking-[1px]">姓名 *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="你的名字"
                      required
                      className="w-full px-4 py-3 bg-surface-input border border-border-default rounded text-text-primary text-[14px]
                        placeholder:text-text-muted outline-none transition-all
                        focus:border-gold focus:ring-1 focus:ring-gold/30"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[13px] text-text-secondary tracking-[1px]">邮箱 *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 bg-surface-input border border-border-default rounded text-text-primary text-[14px]
                        placeholder:text-text-muted outline-none transition-all
                        focus:border-gold focus:ring-1 focus:ring-gold/30"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="serviceType" className="text-[13px] text-text-secondary tracking-[1px]">拍摄类型</label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    className="w-full px-4 py-3 bg-surface-input border border-border-default rounded text-text-primary text-[14px]
                      outline-none transition-all focus:border-gold focus:ring-1 focus:ring-gold/30
                      appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')]
                      bg-[length:12px] bg-[right_16px_center] bg-no-repeat"
                  >
                    <option value="">请选择拍摄类型</option>
                    <option value="travel">个人旅拍</option>
                    <option value="commercial">商业风光</option>
                    <option value="architecture">城市建筑</option>
                    <option value="retouch">后期修图</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-[13px] text-text-secondary tracking-[1px]">留言 *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="请描述你的拍摄需求、时间、地点等信息..."
                    required
                    className="w-full px-4 py-3 bg-surface-input border border-border-default rounded text-text-primary text-[14px]
                      placeholder:text-text-muted outline-none resize-none transition-all
                      focus:border-gold focus:ring-1 focus:ring-gold/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gold text-[#1a1a1a] text-[15px] font-medium tracking-[1px]
                    hover:bg-gold-light hover:-translate-y-0.5 transition-all hover:shadow-[0_8px_25px_rgba(201,169,110,0.3)]
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                    flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      发送中...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      发送预约
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div
            ref={infoRef}
            className={`transition-all duration-[0.6s] delay-200 ${infoVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            <div className="bg-surface-card p-10 rounded border border-border-default h-full max-lg:p-8 max-sm:p-6">
              <h3 className="font-serif text-xl text-white mb-4">联系方式</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-8">
                有任何问题或合作意向，欢迎随时联系。也期待在社交媒体上与你互动。
              </p>

              <div className="space-y-6 mb-8">
                {CONTACT_INFO.map(info => {
                  const Icon = iconMap[info.icon] || Mail;
                  return (
                    <div key={info.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0 text-gold">
                        <Icon size={16} />
                      </div>
                      <div>
                        <span className="text-[11px] text-text-muted tracking-[1px] uppercase">{info.label}</span>
                        <p className="text-[14px] text-white mt-0.5">{info.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <span className="text-[11px] text-text-muted tracking-[1px] uppercase block mb-4">关注我</span>
                <div className="flex gap-3">
                  {SOCIAL_LINKS.map(s => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="w-10 h-10 rounded-full border border-border-default flex items-center justify-center
                        text-text-secondary hover:border-gold hover:text-gold hover:bg-gold/10 transition-all"
                    >
                      <span className="text-[13px]">{s.label === 'Instagram' ? 'IG' : s.label === '小红书' ? '红' : s.label === '微信' ? '微' : '博'}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
