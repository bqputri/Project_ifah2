// Endpoint Serverless Vercel & Express: Kirim Masukan / Laporan Bug via Gmail (Nodemailer)
require('dotenv').config();
const nodemailer = require('nodemailer');

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

        const cleanName = (name && typeof name === 'string') 
            ? name.trim().slice(0, 100) 
            : 'Pengguna TypePaws (Anonim)';

        const cleanEmail = (email && typeof email === 'string' && email.trim().length > 0)
            ? email.trim().slice(0, 120)
            : null;

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

        // 3. Periksa Konfigurasi Gmail di Environment Variables
        const gmailUser = process.env.GMAIL_USER;
        const gmailPass = process.env.GMAIL_APP_PASSWORD;
        const gmailReceiver = process.env.GMAIL_RECEIVER || gmailUser;

        if (!gmailUser || !gmailPass || gmailUser === 'YOUR_GMAIL_ADDRESS@gmail.com') {
            console.warn('[FEEDBACK] GMAIL_USER atau GMAIL_APP_PASSWORD belum dikonfigurasi di file .env / Vercel.');
            return res.status(503).json({
                success: false,
                configured: false,
                message: 'Layanan email belum dikonfigurasi di server. Silakan hubungi pemilik website atau isi GMAIL_USER & GMAIL_APP_PASSWORD di Vercel.'
            });
        }

        // 4. Inisialisasi Transporter Nodemailer (Gmail SMTP)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailUser,
                pass: gmailPass.replace(/\s+/g, '') // hilangkan spasi dari Google App Password jika ada
            }
        });

        // 5. Format Konten Email (HTML & Teks)
        const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
        const safeMessageHtml = message
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>');

        const subjectTag = cleanCategory === 'Laporan Bug / Error' ? '🐛 [BUG REPORT]' :
                           cleanCategory === 'Komplain' ? '⚠️ [KOMPLAIN]' :
                           cleanCategory === 'Saran Fitur' ? '💡 [SARAN FITUR]' : '📬 [MASUKAN]';

        const subject = `${subjectTag} dari ${cleanName} - TypePaws`;

        const mailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFFDF0; border: 2px solid #F59E0B; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #F59E0B, #EC4899); padding: 24px 20px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">🐾 TypePaws - Masukan Baru</h1>
                <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.95;">Ada pesan atau laporan baru yang masuk dari pengguna aplikasi web TypePaws</p>
            </div>

            <!-- Body Content -->
            <div style="padding: 24px 20px; color: #4A3B32;">
                <!-- Ringkasan Info -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                    <tr>
                        <td style="padding: 8px 0; color: #8C786C; width: 120px; font-weight: bold;">Kategori</td>
                        <td style="padding: 8px 0;">
                            <span style="background-color: #FEF3C7; color: #92400E; padding: 4px 12px; border-radius: 12px; font-weight: bold; font-size: 12px; border: 1px solid #FDE68A;">
                                ${cleanCategory}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #8C786C; font-weight: bold;">Nama Pengirim</td>
                        <td style="padding: 8px 0; font-weight: bold; color: #1F2937;">${cleanName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #8C786C; font-weight: bold;">Email Balasan</td>
                        <td style="padding: 8px 0;">
                            ${cleanEmail ? `<a href="mailto:${cleanEmail}" style="color: #EC4899; text-decoration: underline; font-weight: bold;">${cleanEmail}</a>` : '<span style="color: #9CA3AF; font-style: italic;">Tidak dicantumkan (Anonim)</span>'}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #8C786C; font-weight: bold;">Waktu Kirim</td>
                        <td style="padding: 8px 0; color: #4B5563;">${timestamp} WIB</td>
                    </tr>
                    ${deviceInfo ? `
                    <tr>
                        <td style="padding: 8px 0; color: #8C786C; font-weight: bold;">Info Perangkat</td>
                        <td style="padding: 8px 0; color: #6B7280; font-size: 12px;">${deviceInfo}</td>
                    </tr>` : ''}
                </table>

                <!-- Isi Pesan -->
                <div style="background-color: #FFFFFF; border: 2px solid #FED7AA; border-radius: 16px; padding: 18px; margin-top: 15px;">
                    <h3 style="margin-top: 0; margin-bottom: 10px; color: #EA580C; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Detail Pesan:</h3>
                    <div style="font-size: 15px; line-height: 1.6; color: #374151; word-wrap: break-word;">
                        ${safeMessageHtml}
                    </div>
                </div>

                ${cleanEmail ? `
                <div style="margin-top: 20px; text-align: center;">
                    <a href="mailto:${cleanEmail}?subject=Re: Masukan TypePaws - ${encodeURIComponent(cleanCategory)}" style="display: inline-block; background-color: #EC4899; color: white; padding: 10px 22px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 13px;">
                        ✉️ Balas Pesan Pengguna
                    </a>
                </div>
                ` : ''}
            </div>

            <!-- Footer -->
            <div style="background-color: #FEF3C7; padding: 14px 20px; text-align: center; font-size: 12px; color: #92400E; border-top: 1px solid #FDE68A;">
                Email ini dikirim secara otomatis oleh backend serverless <strong>TypePaws</strong>.
            </div>
        </div>
        `;

        const mailOptions = {
            from: `"TypePaws Feedback" <${gmailUser}>`,
            to: gmailReceiver,
            replyTo: cleanEmail || gmailUser,
            subject: subject,
            text: `[TypePaws Masukan Baru]\n\nKategori: ${cleanCategory}\nNama: ${cleanName}\nEmail: ${cleanEmail || 'Tidak dicantumkan'}\nWaktu: ${timestamp}\n\nPesan:\n${message}\n\nInfo Perangkat: ${deviceInfo || 'Tidak tersedia'}`,
            html: mailHtml
        };

        // 6. Eksekusi Pengiriman Email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'Masukan berhasil dikirim! Terima kasih banyak atas bantuan dan saranmu untuk TypePaws. 💖'
        });

    } catch (err) {
        console.error('[FEEDBACK ERROR]', err);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengirim email masukan. Pastikan koneksi internet stabil atau coba sesaat lagi.',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};
