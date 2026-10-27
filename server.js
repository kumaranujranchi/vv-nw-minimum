const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const PORT = process.env.PORT || 3000;
const REMOTE_HOST = 'https://www.lntrealty.com';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=UTF-8'
};

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

const INJECTED_HELPER = `
<!-- RealHome Local Enhancements -->
<style>
  .realhome-toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
    color: #f9fafb;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 215, 0, 0.3);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    display: flex;
    align-items: center;
    gap: 12px;
    transform: translateY(120%);
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .realhome-toast.show {
    transform: translateY(0);
  }
  .realhome-badge {
    background: #cd2653;
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
</style>
<div id="realhome-toast" class="realhome-toast">
  <span class="realhome-badge">Enquiry Sent</span>
  <span id="realhome-toast-msg">Thank you for your interest! A property specialist will connect with you soon.</span>
</div>
<script>
  window.showRealHomeToast = function(msg) {
    const t = document.getElementById('realhome-toast');
    if (!t) return;
    if (msg) document.getElementById('realhome-toast-msg').textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 5000);
  };

  document.addEventListener('submit', function(e) {
    if (e.target && (e.target.classList.contains('wpcf7-form') || e.target.closest('form'))) {
      e.preventDefault();
      window.showRealHomeToast('Thank you! Your inquiry has been submitted successfully.');
      e.target.reset();
    }
  }, true);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){};
  window.mfe = window.mfe || function(){};
</script>
`;

function transformHtml(content) {
  let transformed = content.replace(/<\?\/\=\s*get_images_path\(\)\s*\?>/g, '/assets/images');
  transformed = transformed.replace(/https:\/\/www\.lntrealty\.com\//g, '/');
  transformed = transformed.replace(/https:\/\/www\.lntrealty\.com/g, '');

  if (transformed.includes('</body>')) {
    transformed = transformed.replace('</body>', `${INJECTED_HELPER}\n</body>`);
  } else {
    transformed += INJECTED_HELPER;
  }
  return transformed;
}

function handleStaticFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  if (ext === '.html') {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Internal Server Error');
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(transformHtml(data));
    });
  } else {
    const stat = fs.statSync(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': 'public, max-age=86400'
    });
    fs.createReadStream(filePath).pipe(res);
  }
}

function proxyAndCacheAsset(urlPath, res, req) {
  const cleanPath = urlPath.split('?')[0].split('#')[0];
  let localFile = path.join(__dirname, cleanPath);

  // If pointing to wp-content/themes/lntrealty/assets, map to assets/
  if (cleanPath.startsWith('/wp-content/themes/lntrealty/assets/')) {
    const assetSub = cleanPath.replace('/wp-content/themes/lntrealty/assets/', '');
    const assetCandidate = path.join(__dirname, 'assets', assetSub);
    if (fs.existsSync(assetCandidate) && fs.statSync(assetCandidate).size > 0) {
      return handleStaticFile(assetCandidate, res);
    }
  }

  if (fs.existsSync(localFile) && fs.statSync(localFile).size > 0) {
    return handleStaticFile(localFile, res);
  }

  const remoteUrl = `${REMOTE_HOST}${urlPath}`;
  const clientReq = https.get(remoteUrl, {
    lookup: customLookup,
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': req.headers.accept || '*/*',
      'Referer': REMOTE_HOST
    },
    timeout: 12000
  }, (proxyRes) => {
    if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
      proxyRes.resume();
      return proxyAndCacheAsset(proxyRes.headers.location, res, req);
    }

    if (proxyRes.statusCode !== 200) {
      proxyRes.resume();
      res.writeHead(proxyRes.statusCode, { 'Content-Type': 'text/plain' });
      return res.end(`Asset not found (${proxyRes.statusCode})`);
    }

    const contentType = proxyRes.headers['content-type'] || MIME_TYPES[path.extname(cleanPath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400'
    });

    fs.mkdirSync(path.dirname(localFile), { recursive: true });
    const writeStream = fs.createWriteStream(localFile);
    proxyRes.pipe(writeStream);
    proxyRes.pipe(res);

    writeStream.on('error', () => {
      try { fs.unlinkSync(localFile); } catch(e) {}
    });
  });

  clientReq.on('timeout', () => {
    clientReq.destroy();
    if (!res.headersSent) {
      res.writeHead(504, { 'Content-Type': 'text/plain' });
      res.end('Gateway Timeout');
    }
  });

  clientReq.on('error', (err) => {
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end(`Proxy Error: ${err.message}`);
    }
  });
}

// Route resolver: maps clean URLs to proper page files
function resolvePageRoute(pathname) {
  let clean = pathname.replace(/^\/+|\/+$/g, ''); // strip leading/trailing slashes
  if (!clean) return path.join(__dirname, 'index.html');

  // Direct matches in root or pages/
  const possiblePaths = [
    path.join(__dirname, clean),
    path.join(__dirname, clean + '.html'),
    path.join(__dirname, 'pages', clean),
    path.join(__dirname, 'pages', clean + '.html')
  ];

  // Also check category subfolders: e.g. /residences/the-gateway -> pages/residences/the-gateway.html
  const parts = clean.split('/');
  if (parts.length === 2) {
    possiblePaths.push(path.join(__dirname, 'pages', parts[0], parts[1] + '.html'));
    possiblePaths.push(path.join(__dirname, 'pages', parts[0], parts[1]));
  }
  if (parts[0] === 'news_media' && parts.length === 2) {
    possiblePaths.push(path.join(__dirname, 'pages', 'news', parts[1] + '.html'));
  }

  for (const p of possiblePaths) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      return p;
    }
  }

  return null;
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. Mock APIs
  if (pathname.includes('/wp-json/') || pathname.includes('/admin-ajax.php')) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return res.end(JSON.stringify({
      status: 'mail_sent',
      message: 'Thank you! Your message has been sent successfully.',
      into: '#wpcf7-local'
    }));
  }

  // 2. Direct assets/ directory
  if (pathname.startsWith('/assets/')) {
    const localAsset = path.join(__dirname, pathname);
    if (fs.existsSync(localAsset) && fs.statSync(localAsset).isFile()) {
      return handleStaticFile(localAsset, res);
    }
  }

  // 3. WP content / includes (check assets/ first, then wp-content, then proxy)
  if (pathname.startsWith('/wp-content/') || pathname.startsWith('/wp-includes/')) {
    if (pathname.startsWith('/wp-content/themes/lntrealty/assets/')) {
      const mappedPath = pathname.replace('/wp-content/themes/lntrealty/assets/', '/assets/');
      const candidate = path.join(__dirname, mappedPath);
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return handleStaticFile(candidate, res);
      }
    }

    const localWp = path.join(__dirname, pathname);
    if (fs.existsSync(localWp) && fs.statSync(localWp).isFile() && fs.statSync(localWp).size > 0) {
      return handleStaticFile(localWp, res);
    }

    return proxyAndCacheAsset(req.url, res, req);
  }

  // 4. HTML Page Routing
  const resolvedPage = resolvePageRoute(pathname);
  if (resolvedPage) {
    return handleStaticFile(resolvedPage, res);
  }

  // 5. 404 handler
  res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
  res.end(`<!DOCTYPE html>
<html>
<head>
  <title>Page Not Found - RealHome</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0b0f19; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .card { background: #1a2234; padding: 40px; border-radius: 12px; border: 1px solid #334155; max-width: 480px; }
    h1 { color: #f59e0b; margin-top: 0; }
    a { display: inline-block; margin-top: 20px; background: #cd2653; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h1>404 - Page Not Found</h1>
    <p>The page <code>${pathname}</code> is not available.</p>
    <a href="/">Return to Homepage</a>
  </div>
</body>
</html>`);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`  🌟 RealHome Local Server is LIVE!`);
  console.log(`  🔗 Localhost URL: http://localhost:${PORT}`);
  console.log(`  📁 Clean Architecture: pages/ & assets/`);
  console.log(`======================================================\n`);
});

process.on('SIGINT', () => {
  console.log('\nStopping RealHome server...');
  server.close(() => process.exit(0));
});
