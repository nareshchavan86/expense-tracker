const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Performance
app.use(cors());
app.use(compression());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'", "https://script.google.com", "https://script.googleusercontent.com"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https:", "data:"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// Cache static files
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    etag: true,
    setHeaders: (res, filePath) => {
        // Don't cache HTML (always get latest)
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
        // Cache icons longer
        if (filePath.endsWith('.png') || filePath.endsWith('.ico')) {
            res.setHeader('Cache-Control', 'public, max-age=604800');
        }
    }
}));

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║   💰 Expense Tracker Server Running   ║
    ║   🌐 http://localhost:${PORT}            ║
    ╚════════════════════════════════════════╝
    `);
});