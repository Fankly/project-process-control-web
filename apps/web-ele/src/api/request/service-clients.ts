import type { RequestClient, RequestClientConfig } from '@vben/request';

import { requestClient } from './index';

type ServiceKey =
  | 'budget'
  | 'common'
  | 'expense'
  | 'fullProcess'
  | 'project'
  | 'targetBudget';

interface ServiceClient {
  client: RequestClient;
  service?: string;
}

type ServiceRequestConfig = RequestClientConfig & {
  service?: string;
};

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

export function withBackendService(
  service: ServiceKey,
  config: RequestClientConfig = {},
): ServiceRequestConfig {
  const serviceClient = getServiceClient(service);

  if (!serviceClient.service) {
    return config;
  }

  return {
    ...config,
    service: serviceClient.service,
  };
}

export type { ServiceClient, ServiceKey, ServiceRequestConfig };
