const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const root = path.resolve(process.argv[2]);
const mode = process.argv[3] || 'list';
const ts = require(path.join(root, 'node_modules/typescript'));

const files = execSync('git ls-files', { cwd: root }).toString().split('\n')
  .filter(f => /\.(ts|tsx|js|mjs|cjs|css)$/.test(f) && !/^(posts|docs|public|\.agro|tasks)\//.test(f));

const DIRECTIVE = /eslint-disable|eslint-enable|@ts-expect-error|@ts-ignore|@ts-nocheck|^\/\/\/\s*<reference|prettier-ignore|webpack[A-Z]|@vite-ignore|istanbul|c8 ignore|@refresh|@jsx|@type\b|stylelint|@license|@preserve/;

function scriptKind(f) {
  if (f.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (f.endsWith('.ts')) return ts.ScriptKind.TS;
  return ts.ScriptKind.JS;
}

function comments(f) {
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  const out = [];
  if (f.endsWith('.css')) {
    const re = /\/\*[\s\S]*?\*\//g;
    let m;
    while ((m = re.exec(src))) out.push({ pos: m.index, text: m[0] });
    return { src, out };
  }
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, scriptKind(f));
  const seen = new Set();
  const add = ranges => (ranges || []).forEach(r => {
    if (seen.has(r.pos)) return;
    seen.add(r.pos);
    out.push({ pos: r.pos, text: src.slice(r.pos, r.end) });
  });
  (function walk(n) {
    add(ts.getLeadingCommentRanges(src, n.getFullStart()));
    add(ts.getTrailingCommentRanges(src, n.getEnd()));
    if (n.kind === ts.SyntaxKind.JsxExpression && !n.expression) {
      const inner = src.slice(n.getStart(sf) + 1, n.getEnd() - 1);
      const re = /\/\*[\s\S]*?\*\/|\/\/[^\n]*/g;
      let m;
      while ((m = re.exec(inner))) add([{ pos: n.getStart(sf) + 1 + m.index, end: n.getStart(sf) + 1 + m.index + m[0].length }]);
    }
    n.getChildren(sf).forEach(walk);
  })(sf);
  add(ts.getLeadingCommentRanges(src, sf.endOfFileToken.getFullStart()));
  out.sort((a, b) => a.pos - b.pos);
  return { src, out };
}

function tokens(f) {
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  if (f.endsWith('.css')) return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, scriptKind(f));
  const toks = [];
  (function walk(n) {
    if (n.kind === ts.SyntaxKind.JsxExpression && !n.expression) return;
    const kids = n.getChildren(sf);
    if (!kids.length) {
      const t = n.getText(sf);
      if (n.kind === ts.SyntaxKind.JsxText) {
        const s = t.replace(/\s+/g, ' ').trim();
        if (s) toks.push(s);
      } else if (t) toks.push(t);
    } else kids.forEach(walk);
  })(sf);
  return toks.join('\u0001');
}

if (mode === 'tokens') {
  for (const f of files) console.log(f + '\t' + crypto.createHash('sha256').update(tokens(f)).digest('hex'));
  process.exit(0);
}

let total = 0;
const kept = [];
const per = {};
for (const f of files) {
  const { src, out } = comments(f);
  for (const c of out) {
    const line = src.slice(0, c.pos).split('\n').length;
    total++;
    per[f] = (per[f] || 0) + 1;
    if (DIRECTIVE.test(c.text)) kept.push(`${f}:${line}: ${c.text.split('\n')[0].slice(0, 120)}`);
    if (mode === 'full') console.log(`${f}:${line}: ${c.text.replace(/\n/g, ' | ').slice(0, 200)}`);
  }
}
console.log('SCANNED', files.length, 'TOTAL', total, 'FILES', Object.keys(per).length, 'DIRECTIVES', kept.length);
kept.forEach(k => console.log('KEEP', k));
if (mode === 'list') Object.entries(per).sort((a, b) => b[1] - a[1]).forEach(([f, n]) => console.log(n, f));
