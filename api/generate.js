// Endpoint Backend / Serverless Function untuk Generate Teks Latihan via Gemini API
// API Key disimpan aman di server (process.env.GEMINI_API_KEY) dan tidak pernah terekspos ke frontend.

require('dotenv').config();

/**
 * Serverless Handler untuk Vercel / Express
 */
module.exports = async function handler(req, res) {
    // Set header CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Metode HTTP tidak diizinkan. Gunakan POST.'
        });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        return res.status(500).json({
            success: false,
            message: 'GEMINI_API_KEY belum dikonfigurasi di file .env server. Silakan isi API key Anda terlebih dahulu.'
        });
    }

    try {
        const { topic = 'Kucing lucu dan petualangannya', difficulty = 'medium' } = req.body || {};

        let lengthInstruction = '2 sampai 3 kalimat yang seru dan mengalir lancar';
        if (difficulty === 'easy') {
            lengthInstruction = '1 kalimat singkat dan mudah';
        } else if (difficulty === 'hard') {
            lengthInstruction = '1 paragraf lengkap dan menantang';
        }

        const promptText = `
Tulis teks kalimat latihan mengetik dalam bahasa Indonesia dengan topik: "${topic}".

Ketentuan Wajib:
1. Panjang: ${lengthInstruction}.
2. Langsung berikan teks kalimat ceritanya saja tanpa kata pengantar, tanpa tanda kutip, tanpa penomoran kata/angka, dan tanpa format markdown.
3. Gunakan ejaan dan tanda baca bahasa Indonesia yang baik, seru, dan nyaman untuk latihan mengetik.
        `.trim();

        // Model Gemini aktif yang didukung (diurutkan berdasarkan model paling stabil & responsif)
        const models = [
            'gemini-3-flash-preview',
            'gemini-3.5-flash-lite',
            'gemini-3.5-flash',
            'gemini-3.8-flash',
            'gemini-flash-latest'
        ];
        let generatedText = '';
        let lastError = null;

        for (const model of models) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: 'user',
                                parts: [{ text: promptText }]
                            }
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 1000
                        }
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error?.message || `HTTP ${response.status} saat memanggil model ${model}`);
                }

                if (data.candidates && data.candidates[0]?.content?.parts) {
                    // Cari part yang berisi teks respons aktual (bukan internal thinking)
                    const textPart = data.candidates[0].content.parts.find(p => p.text && !p.thought);
                    if (textPart && textPart.text) {
                        generatedText = textPart.text;
                        break;
                    }
                }
            } catch (err) {
                lastError = err;
            }
        }

        if (!generatedText) {
            throw lastError || new Error('Gagal mendapatkan teks dari Gemini API.');
        }

        // Pembersihan teks ekstra (strip markdown, kutip, spasi ganda)
        generatedText = generatedText
            .replace(/^["'`]+|["'`]+$/g, '') // Hapus kutip di awal dan akhir
            .replace(/[*_#`~]/g, '')         // Hapus karakter markdown
            .replace(/\s+/g, ' ')           // Rapikan spasi ganda
            .trim();

        return res.status(200).json({
            success: true,
            topic,
            difficulty,
            text: generatedText
        });

    } catch (error) {
        console.error('Error saat generate text latihan:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Terjadi kesalahan saat menghubungi Gemini API.'
        });
    }
};
