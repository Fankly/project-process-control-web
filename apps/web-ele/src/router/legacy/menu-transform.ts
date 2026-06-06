import type { RouteRecordStringComponent } from '@vben/types';

interface LegacyMenu {
  children?: LegacyMenu[];
  frameSrc?: string;
  icon?: string;
  id?: number | string;
  isFrame?: boolean | number | string;
  name?: string;
  openStyle?: number | string;
  order?: number;
  outsideMenu?: string;
  redirect?: string;
  url?: string;
}

function isExternalUrl(url: string) {
  return /^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

function normalizePath(url: string, id?: LegacyMenu['id']) {
  const [path] = url.split(/[?#]/);

  if (!path) return `/legacy/${id ?? 'empty'}`;
  if (isExternalUrl(path)) return `/external/legacy_${id ?? hashRouteName(path)}`;

  return path.startsWith('/') ? path : `/${path}`;
}

function toComponentPath(path: string) {
  const normalized = path.replace(/^\/+/, '').replace(/\/+$/, '');

  return normalized ? `/${normalized}/index` : '/dashboard/workspace/index';
}

function hashRouteName(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
}

function toRouteName(path: string, id?: LegacyMenu['id']) {
  const suffix = id === undefined || id === '' ? hashRouteName(path) : id;
  const normalized = path
    .replace(/^\//, '')
    .replace(/[^\da-z]+/gi, '_')
    .replace(/^_+|_+$/g, '');

  return `legacy_${normalized || 'route'}_${suffix}`;
}

function isTruthyFlag(value: unknown) {
  return value === true || value === 1 || value === '1' || value === 'true';
}

function transformMenu(menu: LegacyMenu): RouteRecordStringComponent {
  const sourceUrl = menu.url ?? '';
  const path = normalizePath(sourceUrl, menu.id);
  const children = menu.children
    ?.filter((child) => child.url || child.children?.length)
    .map(transformMenu);
  const hasChildren = Boolean(children?.length);
  const frameSrc = menu.frameSrc || (isTruthyFlag(menu.isFrame) ? sourceUrl : '');
  const isFrame = Boolean(frameSrc);
  const isNewWindow = menu.openStyle === 1 || menu.openStyle === '1';
  const external = isExternalUrl(sourceUrl);

  return {
    component: isFrame
      ? 'IFrameView'
      : hasChildren
        ? 'BasicLayout'
        : toComponentPath(path),
    ...(hasChildren ? { children } : {}),
    ...(menu.redirect ? { redirect: menu.redirect } : {}),
    meta: {
      icon: menu.icon,
      ...(external ? { isLink: sourceUrl } : {}),
      ...(isFrame ? { frameSrc, iframeSrc: frameSrc } : {}),
      ...(isNewWindow || external ? { isNewWindow: true } : {}),
      keepAlive: true,
      legacyUrl: sourceUrl,
      menuId: menu.id,
      openStyle: menu.openStyle,
      order: menu.order,
      outsideMenu: menu.outsideMenu,
      title: menu.name ?? path,
    },
    name: toRouteName(path, menu.id),
    path,
  };
}

export function transformLegacyMenusToRoutes(
  menus: LegacyMenu[] = [],
): RouteRecordStringComponent[] {
  return menus.filter((menu) => menu.url || menu.children?.length).map(transformMenu);
}

export type { LegacyMenu };
