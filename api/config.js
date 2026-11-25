// Endpoint untuk menyediakan konfigurasi publik klien (seperti Firebase Web Config & Supabase)
// Kunci rahasia server seperti GEMINI_API_KEY tetap terlindungi di server dan TIDAK PERNAH dikirim ke endpoint ini.

require('dotenv').config();

module.exports = function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 1. Firebase Web Configuration
    let firebaseConfig = null;
    if (process.env.FIREBASE_CONFIG) {
        try {
            firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
        } catch (e) {}
    }

    if (!firebaseConfig && process.env.FIREBASE_API_KEY && process.env.FIREBASE_API_KEY !== 'YOUR_FIREBASE_API_KEY') {
        firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN || `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
            appId: process.env.FIREBASE_APP_ID || '',
            databaseURL: process.env.FIREBASE_DATABASE_URL || (process.env.FIREBASE_PROJECT_ID ? `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com` : '')
        };
    }

    const firebaseConfigured = Boolean(
        firebaseConfig && 
        firebaseConfig.apiKey && 
        firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
        firebaseConfig.projectId &&
        firebaseConfig.projectId !== 'YOUR_FIREBASE_PROJECT_ID'
    );

    // 2. Supabase Configuration (Opsional legacy)
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

    // 3. Web3Forms Access Key untuk Formulir Masukan
    const web3formsAccessKey = process.env.WEB3FORMS_ACCESS_KEY || 'c09d558c-49ea-43b1-94a7-ed9540d0efcd';

    return res.status(200).json({
        success: true,
        web3formsAccessKey: web3formsAccessKey,
        firebaseConfigured: firebaseConfigured,
        firebaseConfig: firebaseConfigured ? firebaseConfig : null,
        supabaseConfigured: Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'),
        supabaseUrl: supabaseUrl && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' ? supabaseUrl : '',
        supabaseAnonKey: supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' ? supabaseAnonKey : ''
    });
};
