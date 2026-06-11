// ============================================================
// GET /api/wechat/check — 前端轮询检查扫码状态
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getOAuthState } from '@/lib/wechat-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');

  if (!state) {
    return NextResponse.json({ error: 'Missing state parameter' }, { status: 400 });
  }

  const oauthState = getOAuthState(state);

  if (!oauthState) {
    return NextResponse.json({ status: 'expired' });
  }

  if (oauthState.status === 'authorized' && oauthState.user && oauthState.token) {
    return NextResponse.json({
      status: 'authorized',
      token: oauthState.token,
      user: oauthState.user,
    });
  }

  return NextResponse.json({ status: 'pending' });
}
