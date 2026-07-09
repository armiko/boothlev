export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-bg-light pt-24 pb-12 px-5 md:px-10">
      <div className="max-w-3xl mx-auto bg-white brutal-border brutal-shadow-lg p-8 md:p-12">
        <h1 className="font-archivo text-4xl uppercase mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 font-medium text-gray-800 leading-relaxed">
          <p>Terakhir diperbarui: 9 Juli 2026</p>
          
          <h2 className="font-archivo text-2xl uppercase mt-8">1. Pengumpulan Data</h2>
          <p>
            Di Boothlev, privasi Anda adalah prioritas utama kami. Sebagian besar fitur kami dirancang untuk berjalan sepenuhnya di perangkat Anda (Client-Side), sehingga tidak ada data yang dikumpulkan.
          </p>

          <h2 className="font-archivo text-2xl uppercase mt-8">2. Kamera dan Foto</h2>
          <p>
            Boothlev meminta izin akses kamera murni untuk menampilkan pratinjau dan mengambil foto di peramban Anda. Foto-foto ini disimpan secara lokal menggunakan memori peramban Anda (Local Storage / IndexedDB). Kami tidak pernah mengunggah, melihat, atau membagikan foto-foto hasil jepretan Anda ke server mana pun.
          </p>

          <h2 className="font-archivo text-2xl uppercase mt-8">3. Fitur AI Background Removal</h2>
          <p>
            Pengecualian berlaku untuk fitur "Upload AI". Jika Anda menggunakan fitur ini, foto yang Anda pilih akan dikirim melalui koneksi terenkripsi ke server kami untuk diproses oleh Artificial Intelligence.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Foto hanya ada di server kami selama sepersekian detik saat sedang diproses.</li>
            <li>Setelah hasil didapatkan, foto asli dan hasil potongannya langsung dihancurkan/dihapus secara otomatis dari memori server.</li>
            <li>Kami tidak menyimpan log, metadata, atau *cache* dari foto apa pun.</li>
          </ul>

          <h2 className="font-archivo text-2xl uppercase mt-8">4. Analitik</h2>
          <p>
            Kami mungkin menggunakan analitik anonim pihak ketiga (seperti Vercel Analytics) murni untuk mengetahui jumlah pengunjung halaman. Tidak ada data identifikasi pribadi yang dilacak.
          </p>

          <h2 className="font-archivo text-2xl uppercase mt-8">5. Hubungi Kami</h2>
          <p>
            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi tim kami di PT Lembur Demi Waifu.
          </p>
        </div>
      </div>
    </main>
  );
}
