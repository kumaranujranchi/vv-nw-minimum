const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const BASE_URL = 'https://www.lntrealty.com';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const customLookup = (hostname, opts, cb) => {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  dns.resolve4(hostname, (err, addrs) => {
    if (err || !addrs || addrs.length === 0) {
      dns.lookup(hostname, opts, cb);
      return;
    }
    if (opts.all) return cb(null, addrs.map(a => ({ address: a, family: 4 })));
    cb(null, addrs[0], 4);
  });
};

function downloadFile(urlPath) {
  return new Promise((resolve) => {
    // Clean path
    const cleanPath = urlPath.split('?')[0].split('#')[0];
    const localFile = path.join(__dirname, cleanPath);

    if (fs.existsSync(localFile) && fs.statSync(localFile).size > 0) {
      return resolve({ status: 'already_exists', path: cleanPath });
    }

    const fullUrl = urlPath.startsWith('http') ? urlPath : `${BASE_URL}${urlPath}`;
    const parsed = new URL(fullUrl);

    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.get(fullUrl, {
      lookup: customLookup,
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': '*/*',
        'Referer': 'https://www.lntrealty.com/'
      },
      timeout: 10000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, fullUrl).toString();
        }
        res.resume();
        return resolve(downloadFile(redirectUrl));
      }

      if (res.statusCode !== 200) {
        res.resume();
        return resolve({ status: 'error', code: res.statusCode, path: cleanPath });
      }

      fs.mkdirSync(path.dirname(localFile), { recursive: true });
      const fileStream = fs.createWriteStream(localFile);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve({ status: 'downloaded', path: cleanPath });
      });

      fileStream.on('error', (err) => {
        try { fs.unlinkSync(localFile); } catch(e) {}
        resolve({ status: 'file_error', error: err.message, path: cleanPath });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 'timeout', path: cleanPath });
    });

    req.on('error', (err) => {
      resolve({ status: 'req_error', error: err.message, path: cleanPath });
    });
  });
}

async function extractUrlsFromHtml(fileList) {
  const assetUrls = new Set();
  const re = /(?:src|href|content)=["\x27](https?:\/\/www\.lntrealty\.com)?(\/(?:wp-content|wp-includes)\/[^"\x27\s>]+)["\x27]/g;

  for (const file of fileList) {
    if (!fs.existsSync(file)) continue;
    try {
      const content = fs.readFileSync(file, 'utf8');
      let m;
      while ((m = re.exec(content)) !== null) {
        const p = m[2];
        if (!p.includes('<?') && !p.includes('${')) {
          assetUrls.add(p);
        }
      }
    } catch (e) {
      // ignore
    }
  }
  return Array.from(assetUrls);
}

async function extractFontAndBgUrlsFromCss() {
  const cssUrls = new Set();
  const fontRe = /url\((?:["\x27]?)([^)"\x27]+)(?:["\x27]?)\)/g;

  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        scanDir(full);
      } else if (ent.name.endsWith('.css')) {
        try {
          const css = fs.readFileSync(full, 'utf8');
          let m;
          while ((m = fontRe.exec(css)) !== null) {
            let u = m[1].trim();
            if (u.startsWith('data:') || u.startsWith('#')) continue;
            // resolve relative to css file
            if (u.startsWith('/')) {
              cssUrls.add(u);
            } else {
              const relDir = path.relative(__dirname, dir);
              const resolved = '/' + path.normalize(path.join(relDir, u));
              cssUrls.add(resolved);
            }
          }
        } catch (e) {}
      }
    }
  }

  scanDir(path.join(__dirname, 'wp-content'));
  return Array.from(cssUrls);
}

async function runPrefetch() {
  console.log('--- Starting RealHome Asset Prefetch ---');

  // Find HTML files
  const htmlFiles = ['index.html'];
  const dirs = ['about-us', 'residences', 'offices', 'careers', 'news-blogs', 'events', 'csr', 'buyers-guide'];
  for (const d of dirs) {
    const f = path.join(d, 'index.html');
    if (fs.existsSync(f)) htmlFiles.push(f);
  }

  console.log(`Scanning ${htmlFiles.length} key HTML files for assets...`);
  const urls = await extractUrlsFromHtml(htmlFiles);
  console.log(`Found ${urls.length} unique assets in HTML files.`);

  // Download with concurrency limit
  const concurrency = 8;
  let successCount = 0;
  let alreadyCount = 0;
  let errorCount = 0;

  async function downloadBatch(batchUrls) {
    let index = 0;
    const workers = Array(concurrency).fill(null).map(async () => {
      while (index < batchUrls.length) {
        const u = batchUrls[index++];
        const res = await downloadFile(u);
        if (res.status === 'downloaded') {
          successCount++;
          process.stdout.write('+');
        } else if (res.status === 'already_exists') {
          alreadyCount++;
          process.stdout.write('.');
        } else {
          errorCount++;
          process.stdout.write('x');
        }
      }
    });
    await Promise.all(workers);
  }

  console.log('Downloading assets: (. = cached, + = downloaded, x = failed)');
  await downloadBatch(urls);
  console.log(`\nHTML Batch Complete: ${successCount} downloaded, ${alreadyCount} existing, ${errorCount} errors.`);

  // Second pass: CSS fonts/backgrounds
  console.log('Scanning downloaded CSS files for fonts and background images...');
  const fontUrls = await extractFontAndBgUrlsFromCss();
  console.log(`Found ${fontUrls.length} assets referenced inside CSS files.`);
  if (fontUrls.length > 0) {
    await downloadBatch(fontUrls);
    console.log(`\nCSS Assets Batch Complete.`);
  }

  console.log('=== Prefetch Finished Successfully ===');
}

if (require.main === module) {
  runPrefetch().catch(console.error);
}

module.exports = { downloadFile, customLookup };
