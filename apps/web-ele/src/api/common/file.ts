import type { RequestClientConfig } from '@vben/request';

import { requestClient } from '#/api/request';
import { downloadBackendFile } from '#/api/request/download';

export interface FileResource {
  fileName?: string;
  name?: string;
  resourceId?: number | string;
  url?: string;
  [key: string]: unknown;
}

export function uploadCommonFile(
  data: FormData,
  config: RequestClientConfig = {},
) {
  return requestClient.post<FileResource>('/common/file/upload', data, {
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'multipart/form-data;charset=utf-8',
    },
  });
}

export function getCommonFileName(resourceId: number | string) {
  return requestClient.get<string>(`/common/file/getFileName/${resourceId}`);
}

export function downloadCommonFile(
  resourceId: number | string,
  fallbackFilename?: string,
) {
  return downloadBackendFile(
    `/common/file/download/${resourceId}`,
    {},
    fallbackFilename,
  );
}

export function getProcessDownloadUrl(params: Record<string, unknown>) {
  return requestClient.get<string>('/processFile/getDownloadUrl', {
    params,
  });
}

export function uploadProcessFile(data: FormData) {
  return requestClient.post<FileResource>('/processFile/uploadFile', data, {
    headers: {
      'Content-Type': 'multipart/form-data;charset=utf-8',
    },
  });
}
