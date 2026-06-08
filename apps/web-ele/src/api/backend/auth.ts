import type { UserInfo } from '@vben/types';

import type { BackendTokenPayload } from './cache';

interface BackendLoginParams {
  captcha?: boolean | string;
  password?: string;
  username?: string;
}

interface BackendUserInfoRaw {
  avatar?: string;
  fullName?: string;
  id?: number | string;
  name?: string;
  permissions?: string[];
  roles?: string[];
  username?: string;
}

interface BackendLoginPayload {
  a: string;
  b: string;
  captcha: string;
  u: string;
}

function encodeBase64(value: string) {
  return globalThis.btoa(value);
}

function createUuid() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;

    return value.toString(16);
  });
}

export function buildBackendLoginPayload(
  params: BackendLoginParams,
): BackendLoginPayload {
  return {
    a: encodeBase64(params.username ?? ''),
    b: encodeBase64(params.password ?? ''),
    captcha: encodeBase64(
      typeof params.captcha === 'string' ? params.captcha : 'HE_YUE_11_22_33',
    ),
    u: encodeBase64(createUuid()),
  };
}

export function resolveBackendAccessToken(payload: unknown) {
  if (typeof payload === 'string') return payload;
  if (!payload || typeof payload !== 'object') return '';

  const data = payload as BackendTokenPayload & {
    accessToken?: string;
    data?: BackendTokenPayload | string;
  };

  if (typeof data.token === 'string') return data.token;
  if (typeof data.accessToken === 'string') return data.accessToken;

  return resolveBackendAccessToken(data.data);
}

export function normalizeBackendUserInfo(raw: BackendUserInfoRaw): UserInfo {
  const userId = raw.id === undefined ? '' : String(raw.id);
  const username = raw.username ?? raw.name ?? '';
  const roles = raw.roles ?? raw.permissions ?? [];

  return {
    avatar: raw.avatar ?? '',
    desc: '',
    homePath: '/dashboard/workspace',
    realName: raw.fullName ?? raw.name ?? username,
    roles,
    token: '',
    userId,
    username,
  };
}

export type { BackendLoginParams, BackendLoginPayload, BackendUserInfoRaw };
