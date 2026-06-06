import { describe, expect, it } from 'vitest';

import { getServiceClient } from './service-clients';

describe('service clients', () => {
  it('keeps legacy microservice keys centralized', () => {
    expect(getServiceClient('common').service).toBeUndefined();
    expect(getServiceClient('budget').service).toBe('budget');
    expect(getServiceClient('expense').service).toBe('otherOperatingCose');
    expect(getServiceClient('fullProcess').service).toBe('fullProcess');
    expect(getServiceClient('project').service).toBe('project');
    expect(getServiceClient('targetBudget').service).toBe('targetBudget');
  });
});
