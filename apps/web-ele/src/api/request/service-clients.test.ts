import { describe, expect, it } from 'vitest';

import { getServiceClient, withBackendService } from './service-clients';

describe('service clients', () => {
  it('keeps backend microservice keys centralized', () => {
    expect(getServiceClient('common').service).toBeUndefined();
    expect(getServiceClient('budget').service).toBe('budget');
    expect(getServiceClient('expense').service).toBe('otherOperatingCose');
    expect(getServiceClient('fullProcess').service).toBe('fullProcess');
    expect(getServiceClient('project').service).toBe('project');
    expect(getServiceClient('targetBudget').service).toBe('targetBudget');
  });

  it('injects service routing without changing existing request config', () => {
    expect(
      withBackendService('project', {
        params: { id: 1 },
        responseReturn: 'body',
      }),
    ).toEqual({
      params: { id: 1 },
      responseReturn: 'body',
      service: 'project',
    });
  });

  it('does not inject service routing for common requests', () => {
    expect(withBackendService('common', { params: { id: 1 } })).toEqual({
      params: { id: 1 },
    });
  });
});
