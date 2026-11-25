// Run with node scripts/test-csv.mjs; uses the project's existing TypeScript dependency.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = fs.readFileSync(new URL('../src/lib/csv.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const moduleExports = {};
vm.runInNewContext(compiled, { exports: moduleExports });
const parse = input => JSON.parse(JSON.stringify(moduleExports.csvToRecords(input)));

assert.deepEqual(parse('name,note\r\nAda,"Hello, world"\r\nSam,"Said ""hello"""\r\n'), [
  { name: 'Ada', note: 'Hello, world' }, { name: 'Sam', note: 'Said "hello"' },
]);
assert.deepEqual(parse('\uFEFFname,note\nAda,"line 1\nline 2"\n\n'), [{ name: 'Ada', note: 'line 1\nline 2' }]);
assert.deepEqual(parse('a,b\n,\n'), [{ a: '', b: '' }]);
assert.deepEqual(parse('a,b\n  plain  ,"  spaced  "'), [{ a: 'plain', b: '  spaced  ' }]);
assert.deepEqual(parse('value\n""'), [{ value: '' }]);
assert.equal(parse('__proto__,constructor\nx,y')[0].__proto__, 'x');
for (const input of ['a,b\n1', 'a,b\n1,2,3', 'a,a\n1,2', ',b\n1,2', 'a\n"unfinished', 'a\n"x"oops', 'a\nab"cd', 'header', 'x'.repeat(200001)]) {
  assert.throws(() => parse(input), undefined, `Expected rejection for ${input.slice(0,30)}`);
}
console.log('CSV checks passed: quoted commas, escapes, multiline/CRLF/BOM, empty fields, safe keys, and invalid inputs.');
