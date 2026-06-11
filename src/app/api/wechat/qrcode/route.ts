// ============================================================
// GET /api/wechat/qrcode — 生成微信扫码登录的授权 URL
// ============================================================

import { NextResponse } from 'next/server';
import { createOAuthState } from '@/lib/wechat-store';

export async function GET() {
  const appId = process.env.WECHAT_APP_ID;
  const redirectUri = process.env.WECHAT_REDIRECT_URI;

  // 未配置 OAuth → 返回错误，前端自动降级为模拟模式
  if (!appId || !redirectUri) {
    return NextResponse.json(
      {
        error: 'not_configured',
        message: '微信 OAuth 未配置，请在 .env.local 中设置 WECHAT_APP_ID 和 WECHAT_REDIRECT_URI',
      },
      { status: 500 }
    );
  }

  const state = createOAuthState();

  const authUrl =
    'https://open.weixin.qq.com/connect/qrconnect?' +
    `appid=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=snsapi_login` +
    `&state=${state}` +
    `#wechat_redirect`;

  return NextResponse.json({ qrcodeUrl: authUrl, state });
}
