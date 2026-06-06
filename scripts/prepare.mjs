import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const isCI = process.env.CI === 'true' || process.env.CI === '1';
const isGitRepository = existsSync(join(process.cwd(), '.git'));

if (isCI || !isGitRepository) {
  process.exit(0);
}

execFileSync('pnpm', ['exec', 'lefthook', 'install'], {
  stdio: 'inherit',
});
