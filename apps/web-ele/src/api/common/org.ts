import { requestClient } from '#/api/request';

export interface BizOrgTreeParams {
  bmid?: string;
  dwId?: string;
  nodeType?: string;
  parentId?: string;
  roleCode?: string;
}

export interface BizOrgNode {
  children?: BizOrgNode[];
  code?: string;
  id?: number | string;
  label?: string;
  name?: string;
  parentId?: number | string;
  value?: number | string;
  [key: string]: unknown;
}

export function getBizOrgTree(params?: BizOrgTreeParams) {
  return requestClient.get<BizOrgNode[]>('/bizOrgTree/getBizOrgTree', {
    params,
  });
}

export function getBizOrgTreeNoPermission(params?: BizOrgTreeParams) {
  return requestClient.get<BizOrgNode[]>(
    '/bizOrgTree/getBizOrgTreeNoPermission',
    {
      params,
    },
  );
}

export function getBizOrgXzTree(params?: BizOrgTreeParams) {
  return requestClient.get<BizOrgNode[]>('/bizOrgTree/getBizOrgXzTree', {
    params,
  });
}

export function getBizOrgXzTreeExcludeBm(params?: BizOrgTreeParams) {
  return requestClient.get<BizOrgNode[]>(
    '/bizOrgTree/getBizOrgXzTreeExcludeBm',
    {
      params,
    },
  );
}

export function getSysOrgByCurrentUser(params?: Record<string, unknown>) {
  return requestClient.post<BizOrgNode[]>(
    '/bizOrgTree/getSysOrgByCurrentUser',
    params,
  );
}
