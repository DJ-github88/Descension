const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const buildDir = path.resolve(__dirname, '../../build');
const MIME_TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' };

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, 'http://127.0.0.1:4202');
  let filePath = path.join(buildDir, decodeURIComponent(parsedUrl.pathname));
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(buildDir, 'index.html');
  }
  const ext = path.extname(filePath).toLowerCase();
  res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(res);
});

server.listen(4202, '127.0.0.1', async () => {
  try {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 960 } });
    const page = await context.newPage();

    page.on('console', msg => console.log('[Console]', msg.text()));

    await page.goto('http://127.0.0.1:4202/');
    await page.waitForTimeout(2000);

    const loginBtn = page.getByRole('button', { name: /login/i }).or(page.getByText('Login', { exact: true })).first();
    console.log('Login button count:', await loginBtn.count());
    if (await loginBtn.count() > 0) {
      await loginBtn.click();
      await page.waitForTimeout(1500);

      const guestBtn = page.getByRole('button', { name: /continue as guest/i }).or(page.getByText('Continue as Guest')).first();
      console.log('Guest button count:', await guestBtn.count());
      if (await guestBtn.count() > 0) {
        await guestBtn.click();
        await page.waitForTimeout(4000);
        console.log('After guest click URL:', page.url());
      }
    }

    await browser.close();
  } catch(e) {
    console.error('Error:', e);
  } finally {
    server.close();
  }
});
