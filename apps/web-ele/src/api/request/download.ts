import type { RequestClientConfig } from '@vben/request';

import { requestClient } from './index';

export function resolveBackendDownloadFilename(
  headers: Record<string, any>,
  fallback?: string,
) {
  const disposition = String(headers['content-disposition'] ?? '');
  const match = disposition.match(
    /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i,
  );
  const encodedName = match?.[1] ?? match?.[2];

  return encodedName ? decodeURIComponent(encodedName) : fallback;
}

export async function downloadBackendFile(
  url: string,
  config: RequestClientConfig = {},
  fallbackFilename?: string,
) {
  const response = await requestClient.get<any>(url, {
    ...config,
    responseReturn: 'raw',
    responseType: 'blob',
  });
  const filename = resolveBackendDownloadFilename(
    response.headers,
    fallbackFilename,
  );
  const blobUrl = URL.createObjectURL(response.data);
  const link = document.createElement('a');

  link.href = blobUrl;
  link.download = filename ?? `${Date.now()}`;
  link.click();
  URL.revokeObjectURL(blobUrl);
}
