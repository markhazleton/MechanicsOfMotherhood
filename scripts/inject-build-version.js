// Inject build version (timestamp + short hash) into index.html for cache busting
// This script runs after Vite build completes (hook via package.json script modification)
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const root = path.resolve(process.cwd());
const distIndex = path.join(root, 'dist', 'public', 'index.html');

function run() {
  if (!fs.existsSync(distIndex)) {
    console.error('[inject-build-version] index.html not found at', distIndex);
    process.exit(0); // not fatal for static build variants
  }

  const content = fs.readFileSync(distIndex, 'utf-8');
  const buildTime = new Date().toISOString();
  const hash = crypto.createHash('md5').update(buildTime).digest('hex').slice(0, 10);
  const version = `${buildTime}-${hash}`;

  // Add <meta name="app-build" content="version" /> if missing
  let updated = content;
  if (!content.includes('name="app-build"')) {
    updated = updated.replace('</title>', '</title>\n    <meta name="app-build" content="'+version+'" />');
  } else {
    updated = updated.replace(/<meta name="app-build" content="[^"]*"\s*\/>/, `<meta name="app-build" content="${version}" />`);
  }

  // Append ?v=hash to all asset js/css references to break caches each build
  updated = updated.replace(/(src=\"\/assets\/[^"]+?\.js)(\")/g, `$1?v=${hash}$2`);
  updated = updated.replace(/(href=\"\/assets\/[^"]+?\.(css|js))(\")/g, `$1?v=${hash}$3`);

  fs.writeFileSync(distIndex, updated, 'utf-8');
  fs.writeFileSync(path.join(root, 'dist', 'public', 'build-version.json'), JSON.stringify({ version, hash, buildTime }, null, 2));
  console.log('[inject-build-version] Applied version', version);
}

run();
