import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

import { normalizeLegacyUserInfo } from '../legacy/auth';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  const userInfo = await requestClient.get<Record<string, unknown>>(
    '/sys/getUserInfo',
  );

  return normalizeLegacyUserInfo(userInfo) as UserInfo;
}
