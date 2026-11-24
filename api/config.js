// Endpoint untuk menyediakan konfigurasi publik klien (seperti Supabase URL & Anon Key)
// Kunci rahasia seperti GEMINI_API_KEY tetap terlindungi di server dan TIDAK PERNAH dikirim ke endpoint ini.

require('dotenv').config();

module.exports = function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

    return res.status(200).json({
        success: true,
        supabaseConfigured: Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'),
        supabaseUrl: supabaseUrl && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' ? supabaseUrl : '',
        supabaseAnonKey: supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' ? supabaseAnonKey : ''
    });
};
