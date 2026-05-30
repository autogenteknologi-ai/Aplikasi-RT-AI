/* ════════════════════════════════════════════════════════════════
   RukunApp — Server Relay Realtime + Hosting App (1 file, 1 perintah)
   ----------------------------------------------------------------
   Server kecil ini melakukan 2 hal sekaligus:
     1) Menyajikan aplikasi (rukunapp.html) lewat web   → buka di HP warga
     2) Menjadi "relay" Gun.js di alamat /gun           → sinkron realtime

   Karena app + relay berada di SATU alamat yang sama, RUKUN_CONFIG di
   dalam rukunapp.html cukup di-set 'SAME' (sudah default) — langsung jalan.

   Cara pakai (lokal):
       npm install
       npm start
   lalu buka  http://localhost:8765

   Deploy online (Render/Railway/VPS): lihat PANDUAN.md
   ════════════════════════════════════════════════════════════════ */

const Gun  = require('gun');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 8765;

// Gun.serve menyajikan file statis dari folder ini DAN menangani /gun.
const serveStatic = Gun.serve(__dirname);

const server = http.createServer((req, res) => {
  // Buka root ('/') → tampilkan aplikasi
  if (req.url === '/' || req.url === '') req.url = '/rukunapp.html';
  // Header agar warga selalu dapat versi terbaru saat ada update
  res.setHeader('Cache-Control', 'no-cache');
  return serveStatic(req, res);
});

// radisk:true → data warga disimpan ke disk (folder ./radata) supaya tidak
// hilang saat server restart. File ini aman, tidak perlu disentuh.
Gun({ web: server, radisk: true });

server.listen(PORT, '0.0.0.0', () => {
  console.log('═══════════════════════════════════════════════');
  console.log('  ✅ RukunApp aktif');
  console.log('  📱 App   : http://localhost:' + PORT + '/');
  console.log('  🌐 Relay : http://localhost:' + PORT + '/gun');
  console.log('═══════════════════════════════════════════════');
  console.log('  Tekan Ctrl+C untuk berhenti.');
});
