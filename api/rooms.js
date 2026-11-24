// Room Manager untuk Balapan Mengetik Online (Multiplayer Typing Race)
// Bekerja langsung di server lokal maupun Vercel Serverless tanpa perlu konfigurasi tambahan.

const rooms = new Map();

// Bersihkan room yang sudah lebih dari 2 jam tidak aktif
function cleanExpiredRooms() {
    const now = Date.now();
    for (const [code, room] of rooms.entries()) {
        if (now - room.updatedAt > 2 * 60 * 60 * 1000) {
            rooms.delete(code);
        }
    }
}

function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

const DEFAULT_RACE_TEXTS = {
    id: [
        "Kucing oranye yang lincah itu melompat melewati pagar kayu sambil mengejar kupu-kupu warna-warni di taman bunga yang indah.",
        "Matahari pagi bersinar hangat saat burung-burung kecil berkicau merdu di dahan pohon rindang dekat jendela kamarku.",
        "Semangat pantang menyerah adalah kunci utama dalam mencapai impian besar dan meraih kesuksesan di masa depan.",
        "Sepiring nasi goreng hangat dengan telur mata sapi dan teh manis melengkapi sarapan yang nikmat di hari Minggu."
    ],
    en: [
        "The quick brown fox jumps gracefully over the lazy dog while sweet morning birds sing on the green branches.",
        "Small positive actions practiced consistently every single day create extraordinary achievements in life.",
        "A cute fluffy kitten chased a glowing butterfly through the sunny flower garden with great joy and excitement.",
        "Technology brings people together from all around the world to learn, collaborate, and share happiness."
    ]
};

module.exports = function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    cleanExpiredRooms();

    // GET: Ambil status room
    if (req.method === 'GET') {
        const code = (req.query?.code || '').toUpperCase().trim();
        if (!code || !rooms.has(code)) {
            return res.status(404).json({ success: false, message: 'Room tidak ditemukan.' });
        }
        const room = rooms.get(code);
        return res.status(200).json({ success: true, room });
    }

    // POST: Aksi Room
    if (req.method === 'POST') {
        const { action, code, playerName, mascot = '🐱', targetText, lang = 'id', playerId, progress, wpm, isFinished } = req.body || {};

        // 1. Buat Room Baru
        if (action === 'create') {
            let newCode = generateRoomCode();
            while (rooms.has(newCode)) {
                newCode = generateRoomCode();
            }

            const texts = DEFAULT_RACE_TEXTS[lang] || DEFAULT_RACE_TEXTS.id;
            const chosenText = targetText || texts[Math.floor(Math.random() * texts.length)];

            const newPlayerId = 'p_' + Math.random().toString(36).substr(2, 9);
            const hostPlayer = {
                id: newPlayerId,
                name: (playerName || 'Player 1').slice(0, 16),
                mascot: mascot || '🐱',
                progress: 0,
                wpm: 0,
                isReady: true,
                isFinished: false,
                finishRank: null,
                finishTime: null,
                lastSeen: Date.now()
            };

            const room = {
                code: newCode,
                hostId: newPlayerId,
                status: 'waiting', // 'waiting', 'countdown', 'racing', 'finished'
                countdown: 5,
                startTime: null,
                targetText: chosenText,
                lang: lang || 'id',
                players: [hostPlayer],
                finishedCount: 0,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            rooms.set(newCode, room);

            return res.status(200).json({
                success: true,
                message: 'Room berhasil dibuat.',
                code: newCode,
                playerId: newPlayerId,
                room
            });
        }

        // 2. Gabung ke Room
        if (action === 'join') {
            const cleanCode = (code || '').toUpperCase().trim();
            if (!rooms.has(cleanCode)) {
                return res.status(404).json({ success: false, message: 'Kode room tidak valid atau sudah kedaluwarsa.' });
            }

            const room = rooms.get(cleanCode);
            if (room.status === 'racing') {
                return res.status(400).json({ success: false, message: 'Balapan di room ini sudah dimulai!' });
            }

            if (room.players.length >= 6) {
                return res.status(400).json({ success: false, message: 'Room sudah penuh (maksimal 6 pemain).' });
            }

            const newPlayerId = 'p_' + Math.random().toString(36).substr(2, 9);
            const newPlayer = {
                id: newPlayerId,
                name: (playerName || `Player ${room.players.length + 1}`).slice(0, 16),
                mascot: mascot || '🐰',
                progress: 0,
                wpm: 0,
                isReady: true,
                isFinished: false,
                finishRank: null,
                finishTime: null,
                lastSeen: Date.now()
            };

            room.players.push(newPlayer);
            room.updatedAt = Date.now();

            return res.status(200).json({
                success: true,
                message: 'Berhasil bergabung ke room.',
                code: cleanCode,
                playerId: newPlayerId,
                room
            });
        }

        // 3. Mulai Balapan (Hanya Host)
        if (action === 'start') {
            const cleanCode = (code || '').toUpperCase().trim();
            if (!rooms.has(cleanCode)) return res.status(404).json({ success: false, message: 'Room tidak ditemukan.' });

            const room = rooms.get(cleanCode);
            if (room.hostId !== playerId) {
                return res.status(403).json({ success: false, message: 'Hanya host yang bisa memulai balapan.' });
            }

            room.status = 'countdown';
            room.countdown = 3;
            room.updatedAt = Date.now();

            return res.status(200).json({ success: true, room });
        }

        // 4. Update Status Balapan (Countdown selesai -> racing)
        if (action === 'set_racing') {
            const cleanCode = (code || '').toUpperCase().trim();
            if (rooms.has(cleanCode)) {
                const room = rooms.get(cleanCode);
                room.status = 'racing';
                room.startTime = Date.now();
                room.updatedAt = Date.now();
                return res.status(200).json({ success: true, room });
            }
            return res.status(404).json({ success: false });
        }

        // 5. Update Progres Pemain (Live Progress & WPM)
        if (action === 'update_progress') {
            const cleanCode = (code || '').toUpperCase().trim();
            if (!rooms.has(cleanCode)) return res.status(404).json({ success: false, message: 'Room tidak ditemukan.' });

            const room = rooms.get(cleanCode);
            const player = room.players.find(p => p.id === playerId);
            if (!player) return res.status(404).json({ success: false, message: 'Pemain tidak ditemukan.' });

            player.progress = Math.min(100, Math.max(0, Number(progress) || 0));
            player.wpm = Math.max(0, Number(wpm) || 0);
            player.lastSeen = Date.now();

            if (isFinished && !player.isFinished) {
                player.isFinished = true;
                room.finishedCount = (room.finishedCount || 0) + 1;
                player.finishRank = room.finishedCount;
                player.finishTime = Date.now();

                // Jika semua pemain sudah selesai, ubah status room ke 'finished'
                if (room.players.every(p => p.isFinished)) {
                    room.status = 'finished';
                }
            }

            room.updatedAt = Date.now();
            return res.status(200).json({ success: true, room });
        }

        // 6. Reset Balapan untuk Main Lagi
        if (action === 'rematch') {
            const cleanCode = (code || '').toUpperCase().trim();
            if (!rooms.has(cleanCode)) return res.status(404).json({ success: false, message: 'Room tidak ditemukan.' });

            const room = rooms.get(cleanCode);
            const texts = DEFAULT_RACE_TEXTS[room.lang] || DEFAULT_RACE_TEXTS.id;
            room.targetText = texts[Math.floor(Math.random() * texts.length)];
            room.status = 'waiting';
            room.finishedCount = 0;
            room.players.forEach(p => {
                p.progress = 0;
                p.wpm = 0;
                p.isFinished = false;
                p.finishRank = null;
                p.finishTime = null;
            });
            room.updatedAt = Date.now();
            return res.status(200).json({ success: true, room });
        }

        return res.status(400).json({ success: false, message: 'Aksi tidak dikenal.' });
    }

    return res.status(405).json({ success: false, message: 'Metode HTTP tidak diizinkan.' });
};
