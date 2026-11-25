const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const generateHandler = require('./api/generate');
const roomsHandler = require('./api/rooms');
const configHandler = require('./api/config');
const feedbackHandler = require('./api/feedback');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sajikan file statis (index.html, aset, dll) dari folder proyek
app.use(express.static(path.join(__dirname)));

// Endpoint API Gemini AI
app.post('/api/generate', (req, res) => {
    generateHandler(req, res);
});

// Endpoint API Multiplayer Race Rooms
app.all('/api/rooms', (req, res) => {
    roomsHandler(req, res);
});

// Endpoint API Config Publik (Supabase, dll)
app.get('/api/config', (req, res) => {
    configHandler(req, res);
});

// Endpoint API Feedback / Laporkan Masalah (Web3Forms API)
app.post('/api/feedback', (req, res) => {
    feedbackHandler(req, res);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'TypePaws Backend Server berjalan normal',
        geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE'),
        firebaseConfigured: Boolean(process.env.FIREBASE_API_KEY && process.env.FIREBASE_API_KEY !== 'YOUR_FIREBASE_API_KEY'),
        supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY'),
        web3formsConfigured: Boolean(process.env.WEB3FORMS_ACCESS_KEY && process.env.WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY')
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
    console.log(`🏁 Endpoint Balapan Online: /api/rooms`);
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        console.warn('⚠️  Peringatan: GEMINI_API_KEY belum diisi di file .env.');
    } else {
        console.log('🔑 GEMINI_API_KEY terdeteksi dan siap digunakan.');
    }
});
