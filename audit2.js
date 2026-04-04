const fs = require('fs'), path = require('path');
function findHTML(dir, depth) {
  depth = depth || 0;
  if (depth > 6) return [];
  let r = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    try {
      const s = fs.statSync(p);
      if (s.isDirectory() && !['_next','node_modules','.git','web'].includes(f))
        r = r.concat(findHTML(p, depth+1));
      else if (f === 'index.html') r.push(p);
    } catch {}
  }
  return r;
}
const root = 'c:/developments/mamapato';
const htmlFiles = findHTML(root);
const issues = [];

for (const f of htmlFiles) {
  const c = fs.readFileSync(f,'utf8');
  const rel = path.relative(root, f);
  if (c.includes('TIENDA_IDS'))    issues.push('TIENDA_IDS ref: ' + rel);
  if (c.includes('getProductById')) issues.push('getProductById: ' + rel);
}

// Check active product slugs have tienda pages
const dataRaw = fs.readFileSync(root + '/js/data.js','utf8');
const prodRows = dataRaw.match(/\{ id:'p\d+'[^}]+\}/g) || [];
for (const row of prodRows) {
  const statusMatch = row.match(/status:'([^']+)'/);
  const slugMatch   = row.match(/slug:'([^']+)'/);
  if (statusMatch && slugMatch && statusMatch[1] === 'active') {
    const pg = root + '/tienda/productos/' + slugMatch[1] + '/index.html';
    if (!fs.existsSync(pg)) issues.push('No tienda page: ' + slugMatch[1]);
  }
}

// Check active birth lists have public pages
const listRows = dataRaw.match(/\{ id:'\d+'[\s\S]*?slug:'[^']+'/g) || [];
for (const row of listRows) {
  const idMatch     = row.match(/id:'(\d+)'/);
  const statusMatch = row.match(/status:'([^']+)'/);
  const slugMatch   = row.match(/slug:'([^']+)'/);
  if (idMatch && statusMatch && slugMatch && statusMatch[1] === 'active') {
    const pg = root + '/lista/' + slugMatch[1] + '/index.html';
    if (!fs.existsSync(pg)) issues.push('No lista page: ' + slugMatch[1] + ' (id=' + idMatch[1] + ')');
  }
}

if (issues.length === 0) console.log('AUDIT PASSED — ' + htmlFiles.length + ' HTML pages, 0 issues');
else { issues.forEach(i => console.log('ISSUE:', i)); process.exit(1); }
