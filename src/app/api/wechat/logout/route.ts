// ============================================================
// POST /api/wechat/logout — 登出，销毁会话 token
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/wechat-store';

export async function POST(request: NextRequest) {
  let token: string | undefined;

  try {
    const body = await request.json();
    token = body.token;
  } catch {
    // 也支持通过 query string 传递
    const { searchParams } = new URL(request.url);
    token = searchParams.get('token') || undefined;
  }

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  deleteSession(token);
  return NextResponse.json({ success: true });
}
