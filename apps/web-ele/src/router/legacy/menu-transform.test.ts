import { describe, expect, it } from 'vitest';

import { transformLegacyMenusToRoutes } from './menu-transform';

describe('legacy menu transform', () => {
  it('maps ordinary server menus to vben route records', () => {
    const routes = transformLegacyMenusToRoutes([
      {
        icon: 'setting',
        id: 10,
        name: '系统管理',
        openStyle: 0,
        order: 1,
        outsideMenu: 'sys',
        url: '/sys/user',
      },
    ]);

    expect(routes).toEqual([
      {
        component: '/sys/user/index',
        meta: {
          icon: 'setting',
          keepAlive: true,
          legacyUrl: '/sys/user',
          menuId: 10,
          openStyle: 0,
          order: 1,
          outsideMenu: 'sys',
          title: '系统管理',
        },
        name: 'legacy_sys_user_10',
        path: '/sys/user',
      },
    ]);
  });

  it('keeps parent menu as BasicLayout when it has children', () => {
    const routes = transformLegacyMenusToRoutes([
      {
        children: [
          {
            id: 12,
            name: '用户管理',
            url: '/sys/user',
          },
        ],
        id: 11,
        name: '系统',
        url: '/sys',
      },
    ]);

    expect(routes[0]?.component).toBe('BasicLayout');
    expect(routes[0]?.children?.[0]?.component).toBe('/sys/user/index');
  });

  it('maps iframe menus to IFrameView and keeps frame source', () => {
    const routes = transformLegacyMenusToRoutes([
      {
        frameSrc: 'https://example.com/report',
        id: 20,
        isFrame: true,
        name: '外部报表',
        url: '/report/frame',
      },
    ]);

    expect(routes[0]).toMatchObject({
      component: 'IFrameView',
      meta: {
        frameSrc: 'https://example.com/report',
        iframeSrc: 'https://example.com/report',
      },
    });
  });

  it('marks openStyle 1 or external links as new window routes', () => {
    const routes = transformLegacyMenusToRoutes([
      {
        id: 30,
        name: '供应商门户',
        openStyle: 1,
        url: 'https://example.com/supplier',
      },
    ]);

    expect(routes[0]?.path).toBe('/external/legacy_30');
    expect(routes[0]?.meta).toMatchObject({
      isLink: 'https://example.com/supplier',
      isNewWindow: true,
    });
  });
});
