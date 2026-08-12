import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '../..');
const source = fs.readFileSync(path.join(ROOT, 'functions/_middleware.js'), 'utf8');
const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'xos-230-middleware-'));
const modulePath = path.join(tempDirectory, '_middleware.mjs');
fs.writeFileSync(modulePath, source);

const { onRequest } = await import(pathToFileURL(modulePath));

const markdownBodies = {
  '/llms.txt': '# Anand Vallamsetla\n\nPublic profile.\n',
  '/AGENTS.md': '# Agent guide\n\nPublic routes.\n',
  '/pricing.md': '# Engagement pricing\n\nPublic rates.\n',
};

function contextFor(pathname, accept, method = 'GET') {
  let fellThrough = false;
  const context = {
    request: new Request(`https://thewhyman.com${pathname}`, {
      method,
      headers: accept ? { Accept: accept } : {},
    }),
    env: {
      ASSETS: {
        async fetch(request) {
          const body = markdownBodies[new URL(request.url).pathname];
          return body
            ? new Response(method === 'HEAD' ? null : body, { status: 200 })
            : new Response('missing', { status: 404 });
        },
      },
    },
    async next() {
      fellThrough = true;
      return new Response('<!doctype html><html><body>HTML</body></html>', {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    },
  };
  return { context, didFallThrough: () => fellThrough };
}

async function check(name, run) {
  try {
    await run();
    console.log(`PASS  ${name}`);
  } catch (error) {
    console.error(`FAIL  ${name}  <- ${error.message}`);
    process.exitCode = 1;
  }
}

await check('preferred text/markdown returns markdown content-type and body', async () => {
  const test = contextFor('/', 'text/html;q=0.4, text/markdown;q=0.9');
  const response = await onRequest(test.context);
  assert.match(response.headers.get('Content-Type') || '', /^text\/markdown\b/);
  assert.match(await response.text(), /^# Anand Vallamsetla/m);
  assert.equal(test.didFallThrough(), false);
  assert.ok(response.headers.get('Last-Modified'));
});

await check('route mapping serves pricing and agent-guide markdown', async () => {
  const meet = await onRequest(contextFor('/meet', 'text/markdown').context);
  const resources = await onRequest(contextFor('/resources', 'text/markdown').context);
  assert.match(await meet.text(), /^# Engagement pricing/m);
  assert.match(await resources.text(), /^# Agent guide/m);
});

await check('text/markdown;q=0 is rejected', async () => {
  const test = contextFor('/', 'text/markdown;q=0, text/html;q=1');
  const response = await onRequest(test.context);
  assert.equal(test.didFallThrough(), true);
  assert.match(response.headers.get('Content-Type') || '', /^text\/html\b/);
  assert.match(await response.text(), /<!doctype html>/i);
});

await check('equal preference and ordinary browser Accept fall through', async () => {
  for (const accept of ['text/markdown, text/html', 'text/html,application/xhtml+xml,*/*;q=0.8']) {
    const test = contextFor('/', accept);
    const response = await onRequest(test.context);
    assert.equal(test.didFallThrough(), true);
    assert.match(await response.text(), /<!doctype html>/i);
    assert.ok(response.headers.get('Last-Modified'));
  }
});

fs.rmSync(tempDirectory, { recursive: true, force: true });
