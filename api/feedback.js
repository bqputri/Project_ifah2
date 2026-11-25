// Endpoint Serverless Vercel & Express: Kirim Masukan / Laporan Bug via Web3Forms API
require('dotenv').config();

module.exports = async function handler(req, res) {
    // 1. Pengaturan Header CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Metode HTTP tidak diizinkan. Gunakan POST.'
        });
    }

    try {
        const { name, email, category, message, deviceInfo } = req.body || {};

        // 2. Validasi Input Dasar & Anti-Spam
        if (!message || typeof message !== 'string' || message.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message: 'Pesan masukan wajib diisi (minimal 5 karakter).'
            });
        }

        if (message.length > 4000) {
            return res.status(400).json({
                success: false,
                message: 'Pesan terlalu panjang (maksimal 4.000 karakter).'
            });
        }

        const cleanName = (name && typeof name === 'string' && name.trim().length > 0) 
            ? name.trim().slice(0, 100) 
            : 'Pengguna TypePaws (Anonim)';

        const cleanEmail = (email && typeof email === 'string' && email.trim().length > 0)
            ? email.trim().slice(0, 120)
            : '';

        if (cleanEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(cleanEmail)) {
                return res.status(400).json({
                    success: false,
                    message: 'Format alamat email tidak valid.'
                });
            }
        }

        const validCategories = ['Saran Fitur', 'Laporan Bug / Error', 'Komplain', 'Pertanyaan', 'Lainnya'];
        const cleanCategory = validCategories.includes(category) ? category : 'Masukan Umum';

        // 3. Ambil Web3Forms Access Key dari Environment Variable
        const accessKey = process.env.WEB3FORMS_ACCESS_KEY || 'c09d558c-49ea-43b1-94a7-ed9540d0efcd';

        if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
            return res.status(503).json({
                success: false,
                configured: false,
                message: 'Kunci akses Web3Forms belum dikonfigurasi di file .env / Vercel.'
            });
        }

        // 4. Format Subjek & Pesan untuk Web3Forms
        const subjectTag = cleanCategory === 'Laporan Bug / Error' ? '🐛 [BUG REPORT]' :
                           cleanCategory === 'Komplain' ? '⚠️ [KOMPLAIN]' :
                           cleanCategory === 'Saran Fitur' ? '💡 [SARAN FITUR]' : '📬 [MASUKAN]';

        const subject = `${subjectTag} dari ${cleanName} - TypePaws`;
        const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

        const web3formsPayload = {
            access_key: accessKey,
            subject: subject,
            from_name: `TypePaws App (${cleanName})`,
            name: cleanName,
            email: cleanEmail || 'no-reply@typepaws.app',
            category: cleanCategory,
            message: message,
            device_info: deviceInfo || 'Tidak tersedia',
            timestamp: `${timestamp} WIB`
        };

        // 5. Kirim ke Web3Forms API
        const web3Response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TypePaws/1.0'
            },
            body: JSON.stringify(web3formsPayload)
        });

        const result = await web3Response.json();

        if (web3Response.ok && result.success) {
            return res.status(200).json({
                success: true,
                message: 'Masukan berhasil dikirim! Terima kasih banyak atas bantuan dan saranmu untuk TypePaws. 💖'
            });
        } else {
            console.error('[WEB3FORMS ERROR]', result);
            return res.status(web3Response.status || 500).json({
                success: false,
                message: result.message || 'Gagal mengirim pesan melalui Web3Forms.'
            });
        }

    } catch (err) {
        console.error('[FEEDBACK ERROR]', err);
        return res.status(500).json({
            success: false,
            message: 'Gagal terhubung ke layanan pengiriman. Pastikan koneksi internet stabil atau coba sesaat lagi.'
        });
    }
};
