import TipTapEditor from "@/components/editor/TipTapEditor";

const DUMMY_HTML = `
  <h1>Modul Ajar: Sistem Tata Surya</h1>
  <hr />
  
  <h2>I. Informasi Umum</h2>
  <p><strong>Nama Guru:</strong> Pak Andi<br>
  <strong>Sekolah:</strong> SMPN 1 Jakarta<br>
  <strong>Mata Pelajaran:</strong> Ilmu Pengetahuan Alam (IPA)<br>
  <strong>Fase / Kelas:</strong> Fase D / Kelas 7<br>
  <strong>Tahun Ajaran:</strong> 2026/2027<br>
  <strong>Model Pembelajaran:</strong> Project-Based Learning (PjBL)</p>
  
  <h3>Kompetensi Awal</h3>
  <p>Peserta didik sudah memahami bahwa Bumi adalah salah satu planet di alam semesta, namun belum mengetahui karakteristik planet lain dan susunan tata surya.</p>
  
  <hr />
  <h2>II. Komponen Inti</h2>
  
  <h3>Tujuan Pembelajaran</h3>
  <ul>
    <li>Peserta didik dapat mengidentifikasi komponen-komponen tata surya dengan benar.</li>
    <li>Peserta didik dapat merancang dan membuat purwarupa (diorama) tata surya menggunakan bahan daur ulang.</li>
  </ul>
  
  <h3>Pemahaman Bermakna</h3>
  <p>Alam semesta memiliki keteraturan yang luar biasa. Memahami tata surya membantu kita menyadari posisi Bumi di ruang angkasa dan fenomena alam seperti siang-malam serta pergantian musim.</p>
  
  <h3>Kegiatan Pembelajaran (PjBL)</h3>
  <ol>
    <li><strong>Penentuan Pertanyaan Mendasar:</strong> Guru bertanya, "Mengapa planet tidak bertabrakan?"</li>
    <li><strong>Mendesain Perencanaan Proyek:</strong> Siswa berkelompok merencanakan pembuatan diorama tata surya.</li>
    <li><strong>Menyusun Jadwal:</strong> Menentukan target penyelesaian proyek dalam 2 pertemuan.</li>
    <li><strong>Memonitor Peserta Didik:</strong> Guru membimbing pembuatan purwarupa.</li>
    <li><strong>Menguji Hasil:</strong> Siswa mempresentasikan diorama mereka.</li>
    <li><strong>Evaluasi Pengalaman:</strong> Refleksi kelompok mengenai kesulitan yang dihadapi.</li>
  </ol>
  
  <hr />
  <h2>III. Lampiran</h2>
  
  <h3>Lembar Kerja Peserta Didik (LKPD)</h3>
  <blockquote>
    Petunjuk: Buatlah sketsa tata surya lengkap dengan orbitnya di selembar kertas A4 sebelum mulai membuat diorama 3D!
  </blockquote>
  
  <h3>Glosarium</h3>
  <ul>
    <li><strong>Orbit:</strong> Jalur yang dilalui oleh benda angkasa saat mengelilingi benda angkasa lain.</li>
    <li><strong>Planet Terestrial:</strong> Planet yang permukaannya berupa batuan padat (Merkurius, Venus, Bumi, Mars).</li>
  </ul>
`;

export default function EditorPage() {
  return (
    <div className="flex-1 bg-surface-dark text-on-dark min-h-[calc(100vh-56px)] pb-[64px]">
      {/* Fake Toolbar */}
      <div className="bg-surface-dark-elevated border-b border-surface-dark-soft h-[56px] flex items-center px-6 sticky top-[56px] z-40">
        <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
          <span className="text-[13px] text-muted-soft flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            Tersimpan otomatis
          </span>
          <div className="flex gap-3">
            <button className="text-[13px] border border-surface-dark-soft rounded-md px-4 py-2 hover:bg-surface-dark-soft transition-colors bg-surface-dark-elevated">
              Download PDF
            </button>
            <button className="text-[13px] border border-surface-dark-soft rounded-md px-4 py-2 hover:bg-surface-dark-soft transition-colors bg-surface-dark-elevated">
              Download Word
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        {/* AI Disclaimer Banner */}
        <div className="bg-accent-amber-light border-l-[3px] border-accent-amber rounded-r-md p-4 mb-8">
          <p className="text-[13px] text-body">
            <strong>Perhatian:</strong> Konten ini dihasilkan oleh AI dan mungkin mengandung ketidakakuratan. Guru bertanggung jawab meninjau dan menyesuaikan sebelum digunakan di kelas.
          </p>
        </div>

        {/* Editor Area */}
        <TipTapEditor initialContent={DUMMY_HTML} />
      </div>
    </div>
  );
}
