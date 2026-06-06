import { describe, expect, it } from 'vitest';

import {
  buildLegacyLoginPayload,
  normalizeLegacyUserInfo,
  resolveLegacyAccessToken,
} from './auth';

function decodeBase64(value: string) {
  return globalThis.atob(value);
}

describe('legacy auth adapter', () => {
  it('builds the encoded /login payload expected by the old backend', () => {
    const payload = buildLegacyLoginPayload({
      captcha: 'CODE',
      password: 'secret',
      username: 'admin',
    });

    expect(decodeBase64(payload.a)).toBe('admin');
    expect(decodeBase64(payload.b)).toBe('secret');
    expect(decodeBase64(payload.captcha)).toBe('CODE');
    expect(decodeBase64(payload.u)).toHaveLength(36);
  });

  it('uses the old universal captcha when vben captcha is a boolean flag', () => {
    const payload = buildLegacyLoginPayload({
      captcha: true,
      password: 'admin',
      username: 'admin',
    });

    expect(decodeBase64(payload.captcha)).toBe('HE_YUE_11_22_33');
  });

  it('resolves the access token from legacy login data', () => {
    expect(resolveLegacyAccessToken({ token: 'abc' })).toBe('abc');
    expect(resolveLegacyAccessToken('raw-token')).toBe('raw-token');
  });

  it('normalizes old user fields to vben user info', () => {
    expect(
      normalizeLegacyUserInfo({
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
