// ============================================================
// GET /api/wechat/callback — 微信 OAuth 回调
// 微信扫描授权后将 code 和 state 发送到此端点
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getOAuthState, authorizeOAuthState, type WechatUserInfo } from '@/lib/wechat-store';

// ---- WeChat API 返回的类型 ----
interface WechatTokenResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  openid?: string;
  scope?: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

interface WechatUserResponse {
  openid?: string;
  nickname?: string;
  sex?: number;
  province?: string;
  city?: string;
  country?: string;
  headimgurl?: string;
  privilege?: string[];
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

// ---- 成功页 HTML（在微信内置浏览器中展示） ----
function successHtml(user: WechatUserInfo): string {
  const name = escapeHtml(user.nickname || '用户');
  const avatar = escapeHtml(user.headimgurl || '');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>登录成功 · 亦·PHOTOGRAPHY</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
    background:#0a0a0a;color:#e8e8e8;display:flex;align-items:center;justify-content:center;
    min-height:100vh;text-align:center;padding:20px;
  }
  .card{
    background:#1a1a1a;border:1px solid #2a2a2a;border-radius:16px;
    padding:40px 28px;max-width:340px;width:100%;
  }
  .check{
    width:64px;height:64px;border-radius:50%;background:#07C160;
    display:flex;align-items:center;justify-content:center;
    margin:0 auto 20px;font-size:32px;color:#fff;
  }
  h2{font-size:20px;font-weight:600;margin-bottom:6px}
  .sub{color:#a0a0a0;font-size:14px;margin-bottom:20px;line-height:1.6}
  .user{
    display:flex;align-items:center;gap:10px;padding:12px 14px;
    background:#111;border-radius:10px;border:1px solid #222;
  }
  .user img{width:40px;height:40px;border-radius:50%;object-fit:cover;background:#2a2a2a}
  .user .name{font-size:14px;font-weight:500;color:#e8e8e8}
  .gold{color:#c9a96e;margin-top:20px;font-size:13px;font-family:"Noto Serif SC",serif}
</style>
</head>
<body>
<div class="card">
  <div class="check">✓</div>
  <h2>登录成功</h2>
  <p class="sub">您已通过微信授权登录<br>请返回网页继续浏览</p>
  ${avatar ? `<div class="user"><img src="${avatar}" alt="" onerror="this.style.display='none'" /><span class="name">${name}</span></div>` : `<p style="color:#c9a96e;font-size:15px;">${name}</p>`}
  <p class="gold">亦 · PHOTOGRAPHY</p>
</div>
</body>
</html>`;
}

function errorHtml(message: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>登录失败</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0a0a0a;color:#e8e8e8;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
  .card{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:16px;padding:40px 28px;max-width:340px;width:100%;text-align:center}
  .icon{font-size:48px;margin-bottom:16px}
  h2{font-size:18px;margin-bottom:8px}
  p{color:#a0a0a0;font-size:14px;line-height:1.6}
</style></head>
<body>
<div class="card">
  <div class="icon">⚠️</div>
  <h2>登录失败</h2>
  <p>${escapeHtml(message)}</p>
</div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ============================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return new NextResponse(errorHtml('缺少授权参数'), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const oauthState = getOAuthState(state);
  if (!oauthState) {
    return new NextResponse(errorHtml('登录会话已过期，请刷新页面重新扫码'), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const appId = process.env.WECHAT_APP_ID;
  const appSecret = process.env.WECHAT_APP_SECRET;

  if (!appId || !appSecret) {
    return new NextResponse(errorHtml('服务器配置错误'), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  try {
    // ---- Step 1: 用 code 换取 access_token ----
    const tokenUrl =
      'https://api.weixin.qq.com/sns/oauth2/access_token?' +
      `appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`;

    const tokenRes = await fetch(tokenUrl);
    const tokenData: WechatTokenResponse = await tokenRes.json();

    if (tokenData.errcode || !tokenData.access_token || !tokenData.openid) {
      console.error('[Wechat OAuth] Token exchange failed:', tokenData);
      return new NextResponse(errorHtml(`微信授权失败：${tokenData.errmsg || '未知错误'}`), {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // ---- Step 2: 获取用户信息 ----
    const userUrl =
      'https://api.weixin.qq.com/sns/userinfo?' +
      `access_token=${tokenData.access_token}&openid=${tokenData.openid}`;

    const userRes = await fetch(userUrl);
    const userData: WechatUserResponse = await userRes.json();

    if (userData.errcode || !userData.openid) {
      console.error('[Wechat OAuth] Userinfo failed:', userData);
      return new NextResponse(errorHtml(`获取用户信息失败：${userData.errmsg || '未知错误'}`), {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // ---- Step 3: 授权 state，创建会话 ----
    const wechatUser: WechatUserInfo = {
      openid: userData.openid!,
      nickname: userData.nickname || '微信用户',
      headimgurl: userData.headimgurl || '',
      unionid: userData.unionid,
      sex: userData.sex,
      province: userData.province,
      city: userData.city,
      country: userData.country,
    };

    const sessionToken = authorizeOAuthState(state, wechatUser);

    if (!sessionToken) {
      return new NextResponse(errorHtml('该登录会话已被使用'), {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // ---- Step 4: 返回成功页（微信内置浏览器中展示） ----
    return new NextResponse(successHtml(wechatUser), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (err) {
    console.error('[Wechat OAuth] Unexpected error:', err);
    return new NextResponse(errorHtml('服务器内部错误，请稍后重试'), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}
