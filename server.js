const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

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

const INJECTED_HELPER = `
<!-- RealHome Pure HTML/CSS/JS Helpers -->
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

  // Vanilla JavaScript Contact Form Handler
  document.addEventListener('submit', function(e) {
    if (e.target && e.target.tagName === 'FORM') {
      e.preventDefault();
      window.showRealHomeToast('Thank you! Your inquiry has been submitted successfully.');
      e.target.reset();
    }
  }, true);

  // Clean console for local dev
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){};
  window.mfe = window.mfe || function(){};
</script>
`;

function transformHtml(content) {
  if (content.includes('</body>')) {
    return content.replace('</body>', `${INJECTED_HELPER}\n</body>`);
  }
  return content + INJECTED_HELPER;
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

function resolvePageRoute(pathname) {
  let clean = pathname.replace(/^\/+|\/+$/g, '');
  if (!clean) return path.join(__dirname, 'index.html');

  const possiblePaths = [
    path.join(__dirname, clean),
    path.join(__dirname, clean + '.html'),
    path.join(__dirname, 'pages', clean),
    path.join(__dirname, 'pages', clean + '.html')
  ];

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

  // 1. API Endpoints
  if (pathname.startsWith('/api/')) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return res.end(JSON.stringify({
      status: 'success',
      message: 'Request received successfully.'
    }));
  }

  // 2. Static Assets
  if (pathname.startsWith('/assets/')) {
    const localAsset = path.join(__dirname, pathname);
    if (fs.existsSync(localAsset) && fs.statSync(localAsset).isFile()) {
      return handleStaticFile(localAsset, res);
    }
  }

  // 3. HTML Pages
  const resolvedPage = resolvePageRoute(pathname);
  if (resolvedPage) {
    return handleStaticFile(resolvedPage, res);
  }

  // 4. 404 Handler
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
  console.log(`  🌟 RealHome Pure HTML/CSS/JS Server is LIVE!`);
  console.log(`  🔗 Localhost URL: http://localhost:${PORT}`);
  console.log(`  📁 Pure Architecture: pages/ & assets/`);
  console.log(`  🚫 Zero WordPress Components`);
  console.log(`======================================================\n`);
});

process.on('SIGINT', () => {
  console.log('\nStopping RealHome server...');
  server.close(() => process.exit(0));
});
