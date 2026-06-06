import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

import type { LegacyMenu } from '#/router/legacy/menu-transform';

import { transformLegacyMenusToRoutes } from '#/router/legacy/menu-transform';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  const menus = await requestClient.get<LegacyMenu[]>('/sys/menu/nav');

  return transformLegacyMenusToRoutes(menus) as RouteRecordStringComponent[];
}
