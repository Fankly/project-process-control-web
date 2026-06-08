import { requestClient } from '#/api/request';

export interface CommonCodeNode {
  children?: CommonCodeNode[];
  code?: string;
  id?: number | string;
  label?: string;
  name?: string;
  parentCode?: string;
  value?: number | string;
  [key: string]: unknown;
}

export function getCommonCode(params: { codes: string[] }) {
  return requestClient.post<CommonCodeNode[]>(
    '/commonCode/getCommonCode',
    params,
  );
}

export function getCommonCodeByParentCode(params: {
  code: string;
  parentCode?: string;
}) {
  return requestClient.get<CommonCodeNode[]>(
    '/commonCode/getCommonCodeByParentCode',
    {
      params,
    },
  );
}

export function getCommonDataByCode(code: string) {
  return requestClient.get<CommonCodeNode[]>('/commonCode/getData', {
    params: { code },
  });
}

export function getCommonDataByParent(code: string) {
  return requestClient.get<CommonCodeNode[]>('/commonCode/getDataByParent', {
    params: { code },
  });
}
