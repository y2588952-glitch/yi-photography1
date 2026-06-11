// ============================================================
// 微信 OAuth 会话存储（内存实现）
// 生产环境多实例部署时请替换为 Redis
// ============================================================

export interface WechatUserInfo {
  openid: string;
  nickname: string;
  headimgurl: string;
  unionid?: string;
  sex?: number;
  province?: string;
  city?: string;
  country?: string;
}

interface OAuthState {
  id: string;
  createdAt: number;
  status: 'pending' | 'authorized';
  user?: WechatUserInfo;
  token?: string;
}

interface Session {
  token: string;
  user: WechatUserInfo;
  createdAt: number;
}

// ---- 内存存储 ----
const oauthStates = new Map<string, OAuthState>();
const sessions = new Map<string, Session>();

// ---- 过期时间 ----
const STATE_TTL = 5 * 60 * 1000;       // OAuth state 5 分钟
const SESSION_TTL = 7 * 24 * 3600 * 1000; // 会话 7 天

// ---- 定期清理过期条目 ----
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 每 5 分钟

function scheduleCleanup() {
  const now = Date.now();
  for (const [k, v] of oauthStates) {
    if (now - v.createdAt > STATE_TTL) oauthStates.delete(k);
  }
  for (const [k, v] of sessions) {
    if (now - v.createdAt > SESSION_TTL) sessions.delete(k);
  }
}

// 仅在服务端运行
if (typeof globalThis !== 'undefined') {
  // 使用 setInterval 定期清理（避免在 serverless 中泄漏）
  const interval = setInterval(scheduleCleanup, CLEANUP_INTERVAL);
  // Node.js 环境下允许进程退出
  if (typeof process !== 'undefined' && typeof process.on === 'function') {
    process.on('beforeExit', () => clearInterval(interval));
  }
}

// ---- 简单随机 ID 生成 ----
function generateId(length = 32): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// ============================================================
// OAuth State 管理
// ============================================================

/** 创建一个待授权的 OAuth state，返回 state ID */
export function createOAuthState(): string {
  const id = generateId();
  oauthStates.set(id, { id, createdAt: Date.now(), status: 'pending' });
  return id;
}

/** 获取 OAuth state */
export function getOAuthState(id: string): OAuthState | undefined {
  const state = oauthStates.get(id);
  if (!state) return undefined;
  if (Date.now() - state.createdAt > STATE_TTL) {
    oauthStates.delete(id);
    return undefined;
  }
  return state;
}

/** 授权 state：绑定用户信息并创建会话，返回 session token */
export function authorizeOAuthState(
  id: string,
  user: WechatUserInfo
): string | null {
  const state = oauthStates.get(id);
  if (!state || state.status === 'authorized') return null;

  const token = generateId(48);
  state.status = 'authorized';
  state.user = user;
  state.token = token;

  sessions.set(token, { token, user, createdAt: Date.now() });
  return token;
}

// ============================================================
// Session 管理
// ============================================================

/** 根据 token 获取会话 */
export function getSession(token: string): Session | undefined {
  const session = sessions.get(token);
  if (!session) return undefined;
  if (Date.now() - session.createdAt > SESSION_TTL) {
    sessions.delete(token);
    return undefined;
  }
  return session;
}

/** 删除会话（登出） */
export function deleteSession(token: string): void {
  sessions.delete(token);
}
