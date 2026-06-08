import { describe, expect, it } from 'vitest';

import { toBackendErrorMessage, unwrapBackendResponse } from './response';

describe('backend response adapter', () => {
  it('returns data when backend envelope uses code 0', () => {
    expect(
      unwrapBackendResponse({
        code: 0,
        data: { id: 1, name: 'demo' },
        msg: 'ok',
        success: true,
      }),
    ).toEqual({ id: 1, name: 'demo' });
  });

  it('returns data when backend envelope uses success true without code', () => {
    expect(
      unwrapBackendResponse({
        data: ['a', 'b'],
        success: true,
      }),
    ).toEqual(['a', 'b']);
  });

  it('throws explicit error for backend business failure', () => {
    expect(() =>
      unwrapBackendResponse({
        code: 500,
        data: null,
        msg: '保存失败',
        success: false,
      }),
    ).toThrow('保存失败');
  });

  it('preserves non-envelope payloads', () => {
    expect(unwrapBackendResponse({ rows: [], total: 0 })).toEqual({
      rows: [],
      total: 0,
    });
  });

  it('extracts a stable error message from known backend fields', () => {
    expect(toBackendErrorMessage({ message: 'message field' })).toBe(
      'message field',
    );
    expect(toBackendErrorMessage({ msg: 'msg field' })).toBe('msg field');
    expect(toBackendErrorMessage({ error: 'error field' })).toBe('error field');
  });
});
