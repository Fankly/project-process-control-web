import type { RequestClient } from '@vben/request';

import { requestClient } from './index';

type ServiceKey =
  | 'budget'
  | 'expense'
  | 'fullProcess'
  | 'project'
  | 'targetBudget'
  | 'common';

interface ServiceClient {
  client: RequestClient;
  service?: string;
}

const serviceMap: Record<ServiceKey, ServiceClient> = {
  budget: { client: requestClient, service: 'budget' },
  common: { client: requestClient },
  expense: { client: requestClient, service: 'otherOperatingCose' },
  fullProcess: { client: requestClient, service: 'fullProcess' },
  project: { client: requestClient, service: 'project' },
  targetBudget: { client: requestClient, service: 'targetBudget' },
};

export function getServiceClient(service: ServiceKey = 'common') {
  return serviceMap[service];
}

export type { ServiceKey, ServiceClient };
