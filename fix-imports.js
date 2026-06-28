const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function fixPath(importPath) {
  const dir = path.dirname(importPath);
  const base = path.basename(importPath);
  const lowerBase = base.toLowerCase();
  if (base !== lowerBase) {
    return dir === '.' ? lowerBase : `${dir}/${lowerBase}`;
  }
  return null;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix: import ... from './Path'
  content = content.replace(/from\s+(['"])(\.\.?\/[^'"]+)\1/g, (match, quote, importPath) => {
    const fixed = fixPath(importPath);
    if (fixed) {
      changed = true;
      return `from ${quote}${fixed}${quote}`;
    }
    return match;
  });

  // Fix: require('./Path')
  content = content.replace(/require\s*\(\s*(['"])(\.\.?\/[^'"]+)\1\s*\)/g, (match, quote, importPath) => {
    const fixed = fixPath(importPath);
    if (fixed) {
      changed = true;
      return `require(${quote}${fixed}${quote})`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Fixed:', path.relative(process.cwd(), filePath));
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file !== 'node_modules') walk(full);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fixFile(full);
    }
  });
}

walk(srcDir);
console.log('\n🎉 Sab files theek ho gayi! Ab "npm start" chalao.');