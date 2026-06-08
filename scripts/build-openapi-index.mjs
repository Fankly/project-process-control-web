import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const methods = new Set(['delete', 'get', 'patch', 'post', 'put']);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultInput =
  process.env.CORE_ADMIN_OPENAPI ??
  '/Users/fan/developer/core-admin/docs/openapi.json';
const defaultOutput = resolve(
  repoRoot,
  'apps/web-ele/src/api/openapi/index.json',
);

const input = resolve(process.argv[2] ?? defaultInput);
const output = resolve(process.argv[3] ?? defaultOutput);
const openapi = JSON.parse(readFileSync(input, 'utf8'));
const operations = [];

for (const [path, item] of Object.entries(openapi.paths ?? {})) {
  for (const [method, operation] of Object.entries(item)) {
    if (!methods.has(method)) continue;

    const responseContent = operation.responses?.['200']?.content ?? {};
    const schemaText = JSON.stringify(responseContent);

    operations.push({
      deprecated: Boolean(operation.deprecated),
      download:
        schemaText.includes('application/octet-stream') ||
        schemaText.includes('format":"binary') ||
        /download|export|template|file/i.test(
          `${path} ${operation.summary ?? ''}`,
        ),
      method: method.toUpperCase(),
      operationId: operation.operationId,
      path,
      summary: operation.summary,
      tags: operation.tags ?? [],
    });
  }
}

const index = {
  generatedAt: new Date().toISOString(),
  info: openapi.info,
  operationCount: operations.length,
  operations,
  pathCount: Object.keys(openapi.paths ?? {}).length,
};

writeFileSync(output, `${JSON.stringify(index, null, 2)}\n`);
console.log(`Wrote ${operations.length} operations to ${output}`);
