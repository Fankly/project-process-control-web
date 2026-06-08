import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

import { normalizeBackendUserInfo } from '../backend/auth';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  const userInfo =
    await requestClient.get<Record<string, unknown>>('/sys/getUserInfo');

  return normalizeBackendUserInfo(userInfo) as UserInfo;
}
