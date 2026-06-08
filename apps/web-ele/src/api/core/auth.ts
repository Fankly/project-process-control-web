import { requestClient } from '#/api/request';

import {
  buildBackendLoginPayload,
  resolveBackendAccessToken,
} from '../backend/auth';
import {
  clearBackendAuthCache,
  getBackendPermissionFlag,
  setBackendPermissionFlag,
  setBackendToken,
} from '../backend/cache';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    captcha?: boolean | string;
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  const tokenPayload = await requestClient.post<unknown>(
    '/login',
    buildBackendLoginPayload(data),
  );
  const accessToken = resolveBackendAccessToken(tokenPayload);

  setBackendToken(
    typeof tokenPayload === 'object' && tokenPayload !== null
      ? (tokenPayload as Record<string, unknown>)
      : accessToken,
  );

  return { accessToken };
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  throw new Error('当前后端未提供 refreshToken 接口');
}

/**
 * 退出登录
 */
export async function logoutApi() {
  clearBackendAuthCache();
  return requestClient.get<string>('/sys/logout', {
    params: {
      redirUrl: globalThis.location?.href?.split('?')[0] ?? '',
    },
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  if (getBackendPermissionFlag()) {
    return ['backend:system:access'];
  }

  const hasPermission = await requestClient.get<boolean>(
    '/sysMenu/hasPermission',
  );
  setBackendPermissionFlag(hasPermission);

  return hasPermission ? ['backend:system:access'] : [];
}
