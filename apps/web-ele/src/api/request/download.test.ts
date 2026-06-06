import { describe, expect, it } from 'vitest';

import { resolveLegacyDownloadFilename } from './download';

describe('legacy download helper', () => {
  it('reads RFC 5987 filename from content-disposition', () => {
    expect(
      resolveLegacyDownloadFilename({
        'content-disposition': "attachment; filename*=UTF-8''%E6%A8%A1%E6%9D%BF.xlsx",
      }),
    ).toBe('模板.xlsx');
  });

  it('reads plain filename from content-disposition', () => {
    expect(
      resolveLegacyDownloadFilename({
        'content-disposition': 'attachment; filename="report.xlsx"',
      }),
    ).toBe('report.xlsx');
  });

  it('falls back when no filename exists', () => {
    expect(resolveLegacyDownloadFilename({}, 'fallback.xlsx')).toBe(
      'fallback.xlsx',
    );
  });
});
