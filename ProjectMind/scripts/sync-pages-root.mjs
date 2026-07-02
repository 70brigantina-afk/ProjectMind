import { cpSync, writeFileSync } from 'node:fs';

cpSync('dist/index.dev.html', 'dist/index.html');
cpSync('dist/index.dev.html', 'index.html');
cpSync('dist/assets', 'assets', { recursive: true });
writeFileSync('.nojekyll', '');
