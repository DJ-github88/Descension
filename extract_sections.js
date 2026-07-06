// Extract narrative sections from each class data file for internal consistency audit
const fs = require('fs');
const path = require('path');
const classDir = 'D:\\VTT\\vtt-react\\src\\data\\classes';

const files = fs.readdirSync(classDir).filter(f => f.endsWith('Data.js'));

function extractField(content, fieldName, startIdx) {
  const re = new RegExp('\\b' + fieldName + '\\s*:', 'g');
  re.lastIndex = startIdx;
  const m = re.exec(content);
  if (!m) return null;
  let i = m.index + m[0].length;
  while (i < content.length && /\s/.test(content[i])) i++;
  if (content[i] === '`') {
    const start = i + 1;
    let j = start;
    while (j < content.length) {
      if (content[j] === '\\') { j += 2; continue; }
      if (content[j] === '`') break;
      j++;
    }
    return { kind: 'string', value: content.slice(start, j), start: m.index, end: j + 1 };
  } else if (content[i] === '\'' || content[i] === '"') {
    const q = content[i];
    const start = i + 1;
    let j = start;
    while (j < content.length) {
      if (content[j] === '\\') { j += 2; continue; }
      if (content[j] === q) break;
      j++;
    }
    return { kind: 'string', value: content.slice(start, j), start: m.index, end: j + 1 };
  } else if (content[i] === '{' || content[i] === '[') {
    const open = content[i];
    const close = open === '{' ? '}' : ']';
    let depth = 1;
    const start = i;
    let j = i + 1;
    while (j < content.length && depth > 0) {
      if (content[j] === '`') {
        j++;
        while (j < content.length) {
          if (content[j] === '\\') { j += 2; continue; }
          if (content[j] === '`') break;
          j++;
        }
      } else if (content[j] === '\'' || content[j] === '"') {
        const q = content[j];
        j++;
        while (j < content.length) {
          if (content[j] === '\\') { j += 2; continue; }
          if (content[j] === q) break;
          j++;
        }
      } else if (content[j] === open) {
        depth++;
      } else if (content[j] === close) {
        depth--;
      }
      j++;
    }
    return { kind: 'block', value: content.slice(start, j), start: m.index, end: j };
  }
  return null;
}

function lineOf(content, idx) {
  let n = 1;
  for (let k = 0; k < idx; k++) if (content[k] === '\n') n++;
  return n;
}

function strip(s) {
  if (s == null) return '';
  return String(s).replace(/<LoreLink[^>]*>([^<]*)<\/LoreLink>/g, '$1').replace(/\*\*/g, '').replace(/[#>*_`]/g, '');
}

for (const file of files) {
  const full = path.join(classDir, file);
  const content = fs.readFileSync(full, 'utf8');
  const out = [];
  out.push('=== FILE: ' + file + ' ===');
  out.push('');

  function dump(name) {
    const r = extractField(content, name, 0);
    if (!r) { out.push('-- ' + name + ': <NOT FOUND>'); out.push(''); return; }
    out.push('-- ' + name + ' (line ' + lineOf(content, r.start) + '):');
    if (r.kind === 'string') {
      out.push(strip(r.value));
    } else {
      const block = r.value;
      const itemRe = /(\w+)\s*:\s*[`'"]([\s\S]*?)[`'"]/g;
      let m2;
      const seen = new Set();
      let count = 0;
      while ((m2 = itemRe.exec(block)) && count < 80) {
        const key = m2[1];
        const val = strip(m2[2]).slice(0, 800);
        if (/^(id|locationId|region|status)$/.test(key)) continue;
        out.push('  [' + key + '] ' + val);
        count++;
      }
    }
    out.push('');
  }

  ['livingOrder','worldFriction','specializations','notableFigures','subraceVariants'].forEach(dump);

  const ov = extractField(content, 'overview', 0);
  if (ov) {
    out.push('-- overview nested fields (line ' + lineOf(content, ov.start) + '):');
    const block = ov.value;
    ['originStory','currentCrisis','philosophy','signatureQuote','roleplayIdentity'].forEach(n => {
      const inner = extractField(block, n, 0);
      if (inner) {
        out.push('  [' + n + '] ' + strip(inner.value).slice(0, 2000));
      }
    });
    out.push('');
  }

  const outFile = path.join('C:\\Users\\Daniel\\AppData\\Local\\Temp\\opencode\\audit_' + file.replace('.js','') + '.txt');
  fs.writeFileSync(outFile, out.join('\n'));
  console.log('Wrote ' + outFile + ' (' + out.join('\n').length + ' bytes)');
}
