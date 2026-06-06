export interface LegacyEnvelope<T = unknown> {
  code?: number | string;
  data?: T;
  error?: string;
  message?: string;
  msg?: string;
  success?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasLegacyEnvelopeShape(value: Record<string, unknown>) {
  return (
    'code' in value ||
    'success' in value ||
    ('data' in value && ('msg' in value || 'message' in value || 'error' in value))
  );
}

function isSuccessCode(code: LegacyEnvelope['code']) {
  return code === undefined || code === 0 || code === '0';
}

export function toLegacyErrorMessage(payload: unknown, fallback = '请求失败') {
  if (!isRecord(payload)) return fallback;

  return (
    [payload.msg, payload.message, payload.error].find(
      (value): value is string => typeof value === 'string' && value.length > 0,
    ) ?? fallback
  );
}

export function normalizeLegacyResponse<T = unknown>(payload: unknown): T {
  if (!isRecord(payload) || !hasLegacyEnvelopeShape(payload)) {
    return payload as T;
  }

  const response = payload as LegacyEnvelope<T>;
  const success =
    response.success === true ||
    (response.success === undefined && isSuccessCode(response.code));

  if (success) {
    return response.data as T;
  }

  throw new Error(toLegacyErrorMessage(response));
}
