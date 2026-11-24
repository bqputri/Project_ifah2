const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const generateHandler = require('./api/generate');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sajikan file statis (index.html, aset, dll) dari folder proyek
app.use(express.static(path.join(__dirname)));

// Endpoint API Gemini
app.post('/api/generate', (req, res) => {
    generateHandler(req, res);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'TypePaws Backend Server berjalan normal',
        geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE')
    });
});

// Fallback untuk SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`🐾 TypePaws Server aktif di http://localhost:${PORT}`);
    console.log(`✨ Endpoint AI siap: POST http://localhost:${PORT}/api/generate`);
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        console.warn('⚠️  Peringatan: GEMINI_API_KEY belum diisi di file .env.');
    } else {
        console.log('🔑 GEMINI_API_KEY terdeteksi dan siap digunakan.');
    }
});
