const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://accounts.google.com",
        "https://apis.google.com",
        "https://www.gstatic.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://accounts.google.com",
        "https://fonts.googleapis.com"
      ],
      connectSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://www.googleapis.com",
        "https://sheets.googleapis.com",
        "https://oauth2.googleapis.com",
        "https://content-sheets.googleapis.com",
        "https://content.googleapis.com"
      ],
      frameSrc: [
        "https://accounts.google.com",
        "https://content-sheets.googleapis.com"
      ],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https:", "data:"]
    }
  },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  crossOriginEmbedderPolicy: false
}));

app.use(express.static(path.join(__dirname, 'www'), {
  maxAge: '1d',
  etag: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
    if (filePath.endsWith('.png') || filePath.endsWith('.ico')) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
    if (filePath.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Service-Worker-Allowed', '/');
    }
  }
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║ Expense Tracker Running                    ║
║ http://localhost:${PORT}                   ║
║                                            ║
║ Setup Steps:                               ║
║ 1. Enable Sheets API & Drive API           ║
║ 2. Create OAuth 2.0 Web Client             ║
║ 3. Add Render URL as redirect URI          ║
║ 4. Add localhost as origin                 ║
╚════════════════════════════════════════════╝
  `);
});