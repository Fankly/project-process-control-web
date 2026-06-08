import type { RouteRecordStringComponent } from '@vben/types';

import type { BackendMenu } from '#/router/backend/menu-transform';

import { requestClient } from '#/api/request';
import { transformBackendMenusToRoutes } from '#/router/backend/menu-transform';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  const menus = await requestClient.get<BackendMenu[]>('/sys/menu/nav');

  return transformBackendMenusToRoutes(menus) as RouteRecordStringComponent[];
}
