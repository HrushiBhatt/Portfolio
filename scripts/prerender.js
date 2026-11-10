// Bakes the rendered app into dist/index.html so the page paints before any
// JavaScript loads; React then hydrates it. Runs after the client + SSR builds.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const ssrDir = new URL('../dist-ssr/', import.meta.url);
const indexFile = new URL('../dist/index.html', import.meta.url);

const { render, projects } = await import(new URL('entry-server.js', ssrDir));
const html = await readFile(indexFile, 'utf8');
const placeholder = '<div id="root"></div>';

if (!html.includes(placeholder)) throw new Error(`${placeholder} not found in dist/index.html`);

const page = html.replace(placeholder, `<div id="root">${render()}</div>`);
await writeFile(indexFile, page);

// GitHub Pages has no rewrites, so each /<slug> link gets its own copy of the page.
for (const { slug } of projects) {
  const dir = new URL(`../dist/${slug}/`, import.meta.url);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL('index.html', dir), page);
}

await rm(ssrDir, { recursive: true, force: true });
console.log('✓ prerendered dist/index.html');
