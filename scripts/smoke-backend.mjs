const baseURL =
  process.env.PROJECT_PROCESS_API_BASE ??
  'http://localhost:10027/budget-process';

const checks = [
  { method: 'GET', path: '/sys/menu/nav' },
  { method: 'GET', path: '/sys/getUserInfo' },
  { method: 'GET', path: '/sysMenu/hasPermission' },
  { method: 'POST', path: '/login', statusOnly: true },
];

for (const check of checks) {
  const response = await fetch(`${baseURL}${check.path}`, {
    method: check.method,
  });
  const text = await response.text();
  const okStatus = response.status >= 200 && response.status < 500;

  if (!okStatus) {
    throw new Error(
      `${check.method} ${check.path} returned HTTP ${response.status}`,
    );
  }

  if (!check.statusOnly) {
    const payload = JSON.parse(text);
    if (!('code' in payload) || !('success' in payload)) {
      throw new Error(`${check.method} ${check.path} is not backend envelope`);
    }
  }

  console.log(`${check.method} ${check.path} -> HTTP ${response.status}`);
}
