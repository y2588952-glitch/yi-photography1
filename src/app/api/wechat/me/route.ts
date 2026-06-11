// ============================================================
// GET /api/wechat/me — 根据 token 获取当前登录用户信息
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/wechat-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing token parameter' }, { status: 400 });
  }

  const session = getSession(token);
  if (!session) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  return NextResponse.json({ user: session.user });
}
