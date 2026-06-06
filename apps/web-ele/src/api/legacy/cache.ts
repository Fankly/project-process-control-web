const LEGACY_CACHE_PREFIX = 'v1@';
const LEGACY_TOKEN_KEY = 'CacheToken';
const LEGACY_PERMISSION_KEY = 'permissions';

type LegacyTokenPayload = {
  token?: string;
  [key: string]: unknown;
};

function prefixedKey(key: string) {
  return `${LEGACY_CACHE_PREFIX}${key}`;
}

function safeJsonParse<T>(value: null | string, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getLegacyToken() {
  const payload = safeJsonParse<LegacyTokenPayload | string | null>(
    sessionStorage.getItem(prefixedKey(LEGACY_TOKEN_KEY)),
    null,
  );

  if (typeof payload === 'string') return payload;

  return typeof payload?.token === 'string' ? payload.token : null;
}

export function setLegacyToken(payload: LegacyTokenPayload | string) {
  const normalized =
    typeof payload === 'string' ? { token: payload } : payload;

  sessionStorage.setItem(
    prefixedKey(LEGACY_TOKEN_KEY),
    JSON.stringify(normalized),
  );
}

export function getLegacyPermissionFlag() {
  const raw =
    sessionStorage.getItem(LEGACY_PERMISSION_KEY) ??
    sessionStorage.getItem(prefixedKey(LEGACY_PERMISSION_KEY));

  return raw === 'true';
}

export function setLegacyPermissionFlag(value: boolean | string) {
  const normalized = String(value);

  sessionStorage.setItem(LEGACY_PERMISSION_KEY, normalized);
  sessionStorage.setItem(prefixedKey(LEGACY_PERMISSION_KEY), normalized);
}

export function clearLegacyAuthCache() {
  sessionStorage.removeItem(prefixedKey(LEGACY_TOKEN_KEY));
  sessionStorage.removeItem(LEGACY_PERMISSION_KEY);
  sessionStorage.removeItem(prefixedKey(LEGACY_PERMISSION_KEY));
}

export type { LegacyTokenPayload };
