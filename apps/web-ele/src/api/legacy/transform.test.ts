import { describe, expect, it } from 'vitest';

import {
  normalizeLegacyResponse,
  toLegacyErrorMessage,
} from './transform';

describe('legacy response transform', () => {
  it('returns data when legacy envelope uses code 0', () => {
    expect(
      normalizeLegacyResponse({
        code: 0,
        data: { id: 1, name: 'demo' },
        msg: 'ok',
        success: true,
      }),
    ).toEqual({ id: 1, name: 'demo' });
  });

  it('returns data when legacy envelope uses success true without code', () => {
    expect(
      normalizeLegacyResponse({
        data: ['a', 'b'],
        success: true,
      }),
    ).toEqual(['a', 'b']);
  });

  it('throws explicit error for legacy business failure', () => {
    expect(() =>
      normalizeLegacyResponse({
        code: 500,
        data: null,
        msg: '保存失败',
        success: false,
      }),
    ).toThrow('保存失败');
  });

  it('preserves non-envelope payloads', () => {
    expect(normalizeLegacyResponse({ rows: [], total: 0 })).toEqual({
      rows: [],
      total: 0,
    });
  });

  it('extracts a stable error message from known legacy fields', () => {
    expect(toLegacyErrorMessage({ message: 'message field' })).toBe(
      'message field',
    );
    expect(toLegacyErrorMessage({ msg: 'msg field' })).toBe('msg field');
    expect(toLegacyErrorMessage({ error: 'error field' })).toBe('error field');
  });
});
