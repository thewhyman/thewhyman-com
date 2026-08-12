import { test } from 'node:test';
import assert from 'node:assert/strict';
import { serializeJsonLd } from '../../src/lib/serializeJsonLd.mjs';

// Feeds HOSTILE input through the real serializer. Asserting only on the built
// HTML is vacuous — the real data contains no '<', so such a check passes even
// with the escaping removed (proven by mutation).

test('a </script> in the data cannot terminate the JSON-LD element', () => {
  const out = serializeJsonLd({ bio: 'ends here </script><script>alert(1)</script>' });
  assert.ok(!/<\/script/i.test(out), 'raw </script> survived into the block body');
  assert.ok(out.includes('\\u003c/script>'), 'the closing tag was not escaped');
});

test('no raw < survives, and the result is still valid JSON', () => {
  const data = { a: '<b>', b: '<<<', c: 'a < b' };
  const out = serializeJsonLd(data);
  assert.ok(!out.includes('<'), 'a raw < survived');
  assert.deepEqual(JSON.parse(out), data, 'escaping changed the parsed values');
});

test('U+2028 and U+2029 are escaped but round-trip intact', () => {
  const data = { sep: 'before\u2028middle\u2029after' };
  const out = serializeJsonLd(data);
  assert.ok(!out.includes('\u2028'), 'raw U+2028 survived');
  assert.ok(!out.includes('\u2029'), 'raw U+2029 survived');
  assert.ok(out.includes('\\u2028') && out.includes('\\u2029'));
  assert.deepEqual(JSON.parse(out), data);
});
