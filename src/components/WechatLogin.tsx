'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, User, LogOut, MessageCircle, Check, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';

// ============================================================
// 微信登录组件 — 真实 OAuth（自动降级模拟模式）
// ============================================================

// ---- 类型 ----
type ScanState = 'idle' | 'scanned' | 'confirming' | 'success';
type AuthMode = 'real' | 'mock';

interface WechatUserInfo {
  openid: string;
  nickname: string;
  headimgurl: string;
  unionid?: string;
  sex?: number;
  province?: string;
  city?: string;
}

interface QrcodeResponse {
  qrcodeUrl: string;
  state: string;
}

interface CheckResponse {
  status: 'pending' | 'authorized' | 'expired';
  token?: string;
  user?: WechatUserInfo;
}

interface MeResponse {
  user: WechatUserInfo;
}

// ---- 模拟用户（OAuth 未配置时使用） ----
const MOCK_USER: WechatUserInfo = {
  openid: 'mock_openid_000001',
  nickname: '亦·PHOTOGRAPHY 会员',
  headimgurl: '',
};

// ---- 模拟模式下的扫码流程时长（毫秒） ----
const MOCK_DELAYS = {
  scanned: 2500,
  confirming: 4200,
  success: 5800,
  done: 6800,
} as const;

// ---- 真实模式轮询间隔 ----
const POLL_INTERVAL = 2000; // 2 秒
const POLL_TIMEOUT = 5 * 60 * 1000; // 5 分钟超时

// ============================================================

export default function WechatLogin() {
  // ---- 状态 ----
  const [showModal, setShowModal] = useState(false);
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [user, setUser] = useState<WechatUserInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('mock');

  // ---- Refs ----
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollStartTime = useRef<number>(0);
  const currentState = useRef<string>('');

  // ============================================================
  // 生命周期
  // ============================================================

  // 挂载标记（用于 Portal）
  useEffect(() => { setMounted(true); }, []);

  // 从 localStorage 恢复会话
  useEffect(() => {
    try {
      const stored = localStorage.getItem('wechat_token');
      const storedUser = localStorage.getItem('wechat_user');
      if (stored && storedUser) {
        // 先立即显示本地缓存的用户
        setUser(JSON.parse(storedUser));
        // 异步验证 token 是否仍然有效
        validateToken(stored);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 清理所有计时器和轮询
  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // 禁止背景滚动
  useEffect(() => {
    if (showModal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [showModal]);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    if (!showDropdown) return;
    const handler = () => setShowDropdown(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showDropdown]);

  // ESC 关闭模态框
  useEffect(() => {
    if (!showModal) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  // ============================================================
  // 辅助函数
  // ============================================================

  const clearAllTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  /** 向服务器验证 token */
  const validateToken = async (token: string) => {
    try {
      const res = await fetch(`/api/wechat/me?token=${encodeURIComponent(token)}`);
      if (res.ok) {
        const data: MeResponse = await res.json();
        setUser(data.user);
        localStorage.setItem('wechat_user', JSON.stringify(data.user));
      } else {
        // token 无效，清除
        setUser(null);
        localStorage.removeItem('wechat_token');
        localStorage.removeItem('wechat_user');
      }
    } catch {
      // 网络错误，保留本地状态
    }
  };

  /** 关闭模态框 */
  const closeModal = useCallback(() => {
    setShowModal(false);
    setScanState('idle');
    clearAllTimers();
    stopPolling();
  }, []);

  /** 登录成功处理 */
  const handleLoginSuccess = useCallback((loginUser: WechatUserInfo, token?: string) => {
    setUser(loginUser);
    if (token) {
      localStorage.setItem('wechat_token', token);
    }
    localStorage.setItem('wechat_user', JSON.stringify(loginUser));
    setShowModal(false);
    setScanState('idle');
    clearAllTimers();
    stopPolling();
  }, []);

  /** 登出 */
  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem('wechat_token');
    if (token) {
      try {
        await fetch('/api/wechat/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      } catch {
        /* ignore */
      }
    }
    localStorage.removeItem('wechat_token');
    localStorage.removeItem('wechat_user');
    setUser(null);
    setShowDropdown(false);
  };

  // ============================================================
  // 真实 OAuth 流程
  // ============================================================

  /** 轮询检查扫码状态 */
  const startPolling = (state: string) => {
    stopPolling();
    pollStartTime.current = Date.now();
    currentState.current = state;

    pollRef.current = setInterval(async () => {
      // 超时检查
      if (Date.now() - pollStartTime.current > POLL_TIMEOUT) {
        stopPolling();
        setScanState('idle');
        return;
      }

      try {
        const res = await fetch(`/api/wechat/check?state=${encodeURIComponent(state)}`);
        if (!res.ok) return;

        const data: CheckResponse = await res.json();

        if (data.status === 'authorized' && data.user) {
          stopPolling();
          setScanState('success');
          // 短暂显示成功状态后关闭
          setTimeout(() => {
            handleLoginSuccess(data.user!, data.token);
          }, 800);
        } else if (data.status === 'expired') {
          stopPolling();
          setScanState('idle');
          // QR 码过期，可以在这里提示用户刷新
        }
      } catch {
        /* 网络错误，继续轮询 */
      }
    }, POLL_INTERVAL);
  };

  /** 启动真实 OAuth 流程 */
  const startRealAuth = async () => {
    try {
      const res = await fetch('/api/wechat/qrcode');
      if (!res.ok) {
        // API 返回错误（如未配置），降级为模拟模式
        startMockAuth();
        return;
      }

      const data: QrcodeResponse = await res.json();
      setAuthMode('real');

      // 用 qrserver 生成二维码图片
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.qrcodeUrl)}&color=000&bgcolor=fff`;

      // 存储 QR 图片 URL 以便渲染
      localStorage.setItem('_wechat_qr_pending', qrImageUrl);

      // 开始轮询
      startPolling(data.state);
    } catch {
      // 网络错误，降级模拟
      startMockAuth();
    }
  };

  // ============================================================
  // 模拟 OAuth 流程（OAuth 未配置时的降级方案）
  // ============================================================

  const startMockAuth = () => {
    setAuthMode('mock');
    setScanState('idle');
    clearAllTimers();

    timers.current.push(setTimeout(() => setScanState('scanned'), MOCK_DELAYS.scanned));
    timers.current.push(setTimeout(() => setScanState('confirming'), MOCK_DELAYS.confirming));
    timers.current.push(setTimeout(() => setScanState('success'), MOCK_DELAYS.success));
    timers.current.push(
      setTimeout(() => {
        handleLoginSuccess({ ...MOCK_USER });
      }, MOCK_DELAYS.done)
    );
  };

  // ============================================================
  // 事件处理
  // ============================================================

  const handleTriggerClick = () => {
    if (user) {
      setShowDropdown((v) => !v);
      return;
    }
    // 打开模态框
    setShowModal(true);
    setScanState('idle');
    clearAllTimers();
    stopPolling();
    localStorage.removeItem('_wechat_qr_pending');

    // 尝试真实 OAuth，失败则自动降级模拟
    startRealAuth();
  };

  const handleRetry = () => {
    setScanState('idle');
    clearAllTimers();
    stopPolling();
    startRealAuth();
  };

  // ============================================================
  // QR 码图片 URL
  // ============================================================

  const getQrImageUrl = (): string => {
    if (authMode === 'real') {
      const pending = typeof localStorage !== 'undefined' ? localStorage.getItem('_wechat_qr_pending') : null;
      if (pending) return pending;
    }
    // 模拟模式或降级：使用通用 QR 码
    return 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=wechat_login_yi_photography&color=000&bgcolor=fff';
  };

  // ============================================================
  // 状态文字渲染
  // ============================================================

  const statusContent = () => {
    switch (scanState) {
      case 'idle':
        return (
          <p className="text-sm text-text-secondary">
            {authMode === 'real' ? '请使用微信扫一扫登录' : '请使用微信扫一扫登录（演示模式）'}
          </p>
        );
      case 'scanned':
        return (
          <div className="flex items-center justify-center gap-2 text-[#07C160] animate-fade-in">
            <Check size={18} strokeWidth={2.5} />
            <span className="text-sm font-medium">已扫描</span>
          </div>
        );
      case 'confirming':
        return (
          <div className="flex items-center justify-center gap-2 text-[#07C160] animate-fade-in">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm font-medium">请在手机上确认登录</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center justify-center gap-2 text-[#07C160] animate-fade-in">
            <Check size={18} strokeWidth={2.5} />
            <span className="text-sm font-medium">登录成功</span>
          </div>
        );
    }
  };

  // ============================================================
  // 渲染
  // ============================================================

  return (
    <>
      {/* ========== 触发按钮 ========== */}
      <div className="relative">
        <button
          onClick={handleTriggerClick}
          className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all
            ${
              user
                ? 'border-gold/50 bg-gold/10 text-gold hover:bg-gold/20'
                : 'border-transparent text-text-secondary hover:text-[#07C160] hover:border-[#07C160]/40 hover:bg-[#07C160]/10'
            }`}
          aria-label={user ? '用户菜单' : '微信登录'}
          title={user ? user.nickname : '微信扫码登录'}
        >
          {user ? (
            user.headimgurl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.headimgurl}
                alt={user.nickname}
                className="w-5 h-5 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-[#07C160] flex items-center justify-center text-white text-[10px] font-bold">
                {user.nickname.charAt(0)}
              </div>
            )
          ) : (
            <MessageCircle size={16} />
          )}

          {/* 未登录绿色小点 */}
          {!user && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#07C160] rounded-full border-2 border-surface" />
          )}
        </button>

        {/* ========== 已登录下拉菜单 ========== */}
        {user && showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-surface-card border border-border-default rounded-xl shadow-2xl overflow-hidden z-[1001] animate-fade-in">
            {/* 用户信息区 */}
            <div className="px-4 py-3 border-b border-border-default">
              <div className="flex items-center gap-3">
                {user.headimgurl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.headimgurl}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0 bg-surface-hover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#07C160] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {user.nickname.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {user.nickname}
                  </p>
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <MessageCircle size={10} className="text-[#07C160]" />
                    通过微信登录
                  </p>
                </div>
              </div>
            </div>

            {/* 退出按钮 */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-red-400 hover:bg-surface-hover transition-colors"
            >
              <LogOut size={14} />
              退出登录
            </button>
          </div>
        )}
      </div>

      {/* ========== 扫码登录模态框 ========== */}
      {mounted &&
        showModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
            onClick={closeModal}
          >
            {/* 遮罩 */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* 弹窗 */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-surface-card border border-border-default rounded-2xl w-full max-w-sm overflow-hidden animate-fade-up shadow-2xl"
            >
              {/* --- 头部 --- */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
                <h3 className="text-lg font-serif text-white">微信登录</h3>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:text-white hover:bg-surface-hover transition-colors"
                  aria-label="关闭"
                >
                  <X size={18} />
                </button>
              </div>

              {/* --- 主体 --- */}
              <div className="px-5 py-8 flex flex-col items-center">
                {/* 二维码区域 */}
                <div className="relative">
                  <div
                    className={`relative w-52 h-52 bg-white rounded-xl overflow-hidden p-3 border-2 transition-all duration-500
                      ${
                        scanState === 'scanned' || scanState === 'confirming'
                          ? 'border-[#07C160] shadow-[0_0_20px_rgba(7,193,96,0.3)]'
                          : ''
                      }
                      ${
                        scanState === 'success'
                          ? 'border-[#07C160] shadow-[0_0_30px_rgba(7,193,96,0.5)]'
                          : ''
                      }
                      ${scanState === 'idle' ? 'border-gray-200' : ''}
                    `}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getQrImageUrl()}
                      alt="微信登录二维码"
                      className="w-full h-full"
                    />

                    {/* 已扫描覆盖层 */}
                    {(scanState === 'scanned' || scanState === 'confirming') && (
                      <div className="absolute inset-0 bg-[#07C160]/10 flex items-center justify-center animate-fade-in">
                        <Check size={48} className="text-[#07C160]" strokeWidth={3} />
                      </div>
                    )}

                    {/* 登录成功覆盖层 */}
                    {scanState === 'success' && (
                      <div className="absolute inset-0 bg-[#07C160]/20 flex items-center justify-center animate-fade-in">
                        <Check size={56} className="text-[#07C160]" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* 扫描线动画（仅 idle） */}
                  {scanState === 'idle' && (
                    <div className="absolute left-3 right-3 top-3 h-0.5 bg-[#07C160]/60 rounded-full shadow-[0_0_8px_rgba(7,193,96,0.5)] animate-scan" />
                  )}
                </div>

                {/* 状态文字 */}
                <div className="mt-6 text-center min-h-[32px] flex items-center">
                  {statusContent()}
                </div>

                {/* 底部提示 */}
                <div className="mt-4 flex flex-col items-center gap-1">
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <MessageCircle size={12} className="text-[#07C160]" />
                    微信扫码安全登录
                  </p>
                  {authMode === 'mock' && scanState === 'idle' && (
                    <p className="text-[10px] text-text-muted/60">
                      当前为演示模式 · 配置环境变量启用真实登录
                    </p>
                  )}
                  {/* 过期重试按钮 */}
                  {scanState === 'idle' && authMode === 'real' && (
                    <button
                      onClick={handleRetry}
                      className="text-xs text-gold hover:text-gold-light transition-colors mt-1"
                    >
                      刷新二维码
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
