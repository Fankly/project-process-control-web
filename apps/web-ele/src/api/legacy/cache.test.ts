import { afterEach, describe, expect, it } from 'vitest';

import {
  clearLegacyAuthCache,
  getLegacyPermissionFlag,
  getLegacyToken,
  setLegacyPermissionFlag,
  setLegacyToken,
} from './cache';

describe('legacy auth cache', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('keeps token compatible with the old v1@CacheToken session key', () => {
    setLegacyToken({ token: 'abc' });

    expect(sessionStorage.getItem('v1@CacheToken')).toBe('{"token":"abc"}');
    expect(getLegacyToken()).toBe('abc');
  });

  it('keeps permission flag compatible with old keys', () => {
    setLegacyPermissionFlag(true);

    expect(sessionStorage.getItem('permissions')).toBe('true');
    expect(sessionStorage.getItem('v1@permissions')).toBe('true');
    expect(getLegacyPermissionFlag()).toBe(true);
  });

  it('clears legacy auth cache keys together', () => {
    setLegacyToken({ token: 'abc' });
    setLegacyPermissionFlag(true);

    clearLegacyAuthCache();

    expect(getLegacyToken()).toBeNull();
    expect(sessionStorage.getItem('permissions')).toBeNull();
    expect(sessionStorage.getItem('v1@permissions')).toBeNull();
  });
});
