/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { RequestClientOptions } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { ElMessage } from 'element-plus';

import { useAuthStore } from '#/store';

import { refreshTokenApi } from './core';
import { getLegacyToken } from './legacy/cache';
import {
  normalizeLegacyResponse,
  toLegacyErrorMessage,
} from './legacy/transform';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
  });

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken(): Promise<string> {
    await refreshTokenApi();
    throw new Error('当前后端未提供 refreshToken 接口');
  }

  function formatToken(token: null | string) {
    return token;
  }

  function createLegacySignature() {
    const timeStamp = Date.now();
    const random = globalThis.crypto?.getRandomValues
      ? (globalThis.crypto.getRandomValues(new Uint32Array(1))[0] ?? 0) /
        0x1_0000_0000
      : Math.random();
    const sign = globalThis.btoa(`${random}-${timeStamp}`);

    return { random, sign, timeStamp };
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();
      const token = getLegacyToken() ?? accessStore.accessToken;
      const signature = createLegacySignature();

      if (token) {
        config.headers.token = token;
      }
      config.headers['Accept-Language'] = preferences.app.locale;
      config.headers['Request-Start'] = Date.now();
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      config.headers.random = signature.random;
      config.headers.sign = signature.sign;
      config.headers.timeStamp = signature.timeStamp;

      if (config.method?.toUpperCase() === 'GET') {
        config.params = { ...config.params, _t: Date.now() };
      }

      return config;
    },
  });

  // 处理返回的响应数据格式
  client.addResponseInterceptor({
    fulfilled: async (response) => {
      const { config, data, status } = response;

      if (config.responseReturn === 'raw') {
        return response;
      }

      if (status >= 200 && status < 400) {
        if (data?.code === 401 || data?.code === '401') {
          await doReAuthenticate();
          throw new Error(toLegacyErrorMessage(data, '未授权，请登录'));
        }

        return config.responseReturn === 'body'
          ? data
          : normalizeLegacyResponse(data);
      }

      throw Object.assign({}, response, { response });
    },
  });

  // token过期的处理
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
      formatToken,
    }),
  );

  // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      // 这里可以根据业务进行定制,你可以拿到 error 内的信息进行定制化处理，根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
      // 当前mock接口返回的错误字段是 error 或者 message
      const responseData = error?.response?.data ?? {};
      const errorMessage = toLegacyErrorMessage(responseData, '');
      // 如果没有错误信息，则会根据状态码进行提示
      ElMessage.error(errorMessage || msg);
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL, {
  responseReturn: 'data',
});

export const baseRequestClient = new RequestClient({ baseURL: apiURL });
