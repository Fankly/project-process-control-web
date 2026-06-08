import { describe, expect, it } from 'vitest';

import {
  buildBackendLoginPayload,
  normalizeBackendUserInfo,
  resolveBackendAccessToken,
} from './auth';

function decodeBase64(value: string) {
  return globalThis.atob(value);
}

describe('backend auth adapter', () => {
  it('builds the encoded /login payload expected by the backend', () => {
    const payload = buildBackendLoginPayload({
      captcha: 'CODE',
      password: 'secret',
      username: 'admin',
    });

    expect(decodeBase64(payload.a)).toBe('admin');
    expect(decodeBase64(payload.b)).toBe('secret');
    expect(decodeBase64(payload.captcha)).toBe('CODE');
    expect(decodeBase64(payload.u)).toHaveLength(36);
  });

  it('uses the backend universal captcha when vben captcha is a boolean flag', () => {
    const payload = buildBackendLoginPayload({
      captcha: true,
      password: 'admin',
      username: 'admin',
    });

    expect(decodeBase64(payload.captcha)).toBe('HE_YUE_11_22_33');
  });

  it('resolves the access token from backend login data', () => {
    expect(resolveBackendAccessToken({ token: 'abc' })).toBe('abc');
    expect(resolveBackendAccessToken('raw-token')).toBe('raw-token');
  });

  it('normalizes old user fields to vben user info', () => {
    expect(
      normalizeBackendUserInfo({
        fullName: '张三',
        id: 9,
        name: 'zhangsan',
        permissions: ['A', 'B'],
      }),
    ).toEqual({
      avatar: '',
      desc: '',
      homePath: '/dashboard/workspace',
      realName: '张三',
      roles: ['A', 'B'],
      token: '',
      userId: '9',
      username: 'zhangsan',
    });
  });
});
