import { afterEach, describe, expect, it } from 'vitest';

import {
  clearBackendAuthCache,
  getBackendPermissionFlag,
  getBackendToken,
  setBackendPermissionFlag,
  setBackendToken,
} from './cache';

describe('backend auth cache', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('keeps token compatible with the old v1@CacheToken session key', () => {
    setBackendToken({ token: 'abc' });

    expect(sessionStorage.getItem('v1@CacheToken')).toBe('{"token":"abc"}');
    expect(getBackendToken()).toBe('abc');
  });

  it('keeps permission flag compatible with backend session keys', () => {
    setBackendPermissionFlag(true);

    expect(sessionStorage.getItem('permissions')).toBe('true');
    expect(sessionStorage.getItem('v1@permissions')).toBe('true');
    expect(getBackendPermissionFlag()).toBe(true);
  });

  it('clears backend auth cache keys together', () => {
    setBackendToken({ token: 'abc' });
    setBackendPermissionFlag(true);

    clearBackendAuthCache();

    expect(getBackendToken()).toBeNull();
    expect(sessionStorage.getItem('permissions')).toBeNull();
    expect(sessionStorage.getItem('v1@permissions')).toBeNull();
  });
});
