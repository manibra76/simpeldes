import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, FileText, Printer, Home, Plus, Edit, Trash, 
  Check, ArrowRight, ArrowLeft, Search, Save, AlertCircle, FileDown,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, X,
  Shield, Database, Upload, Download, Settings, RefreshCw, LayoutDashboard,
  Table as TableIcon, Key, UserCheck, Lock, Unlock, LogOut, CheckSquare, Layers,
  Bell, Volume2, MonitorPlay, Power, PieChart, Activity, UserMinus
} from 'lucide-react';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

const playTingTong = () => {
  return new Promise((resolve) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return resolve();
    const ctx = new AudioContext();
    const playNote = (frequency, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.6, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    const now = ctx.currentTime;
    playNote(800, now, 0.8);
    playNote(600, now + 0.5, 1.2);
    setTimeout(() => resolve(), 1500); 
  });
};

const initialDatabase = {
  appConfig: {
    themeColor: 'indigo',
    fontFamily: 'font-sans',
    landingTitle: 'Portal Layanan Administrasi Desa',
    landingSubtitle: 'Sistem Terpadu Pelayanan Surat dan Kependudukan Cepat & Efisien',
    landingAbout: 'Aplikasi resmi desa untuk memudahkan warga dalam mengurus berbagai keperluan administrasi surat-menyurat secara transparan dan akuntabel.',
    landingLogo: '',
    landingLayout: 'center',
    superUser: 'superadmin',
    superPass: 'superpassword'
  },
  desas: [
    { 
      id: 'desa_1', 
      namaDesa: 'Huntu Selatan', 
      namaKecamatan: 'Bulango Selatan', 
      namaKabupaten: 'Bone Bolango', 
      namaProvinsi: 'Gorontalo', 
      jabatanKades: 'Kepala Desa', 
      namaKades: 'H. Suhendra, S.Sos', 
      nipKades: '',
      logoDesa: '', 
      ttdKades: '', 
      isPendudukLocked: false,
      isAntrianEnabled: true,
      isActive: true,
      antrianCurrent: 0,
      antrianCalled: 0,
      lastAntrianDate: new Date().toDateString(),
      voiceURI: '', 
      kioskTitle: 'Selamat Datang',
      kioskSubtitle: 'Silakan ambil nomor antrean untuk mendapatkan pelayanan.',
      kioskTheme: 'indigo',
      kioskLayout: 'center',
      kioskTextColor: '',
      kioskRunningText: 'Selamat datang di Pusat Pelayanan Terpadu Desa Huntu Selatan. Silakan ambil nomor antrean Anda.',
      features: ['surat', 'penduduk', 'template', 'operator', 'pengaturan']
    }
  ],
  users: [
    { id: 'u_super', username: 'superadmin', password: 'superpassword', role: 'superadmin', desaId: null, nama: 'Sistem Administrator' },
    { id: 'u_admin1', username: 'admin', password: 'adminhs', role: 'admin', desaId: 'desa_1', nama: 'Admin Huntu Selatan' }
    // Operator dikosongkan agar Admin yang input sendiri
  ],
  registerSurat: [],
  penduduk: [
    { id: 1, desaId: 'desa_1', noKk: '7503153001010001', nik: '7503153003920002', nama: 'Rahman Ibrahim', ttl: 'Gorontalo, 30-03-1992', jk: 'Laki-laki', agama: 'Islam', pekerjaan: 'Perangkat Desa', alamat: 'Dusun I', shdk: 'Kepala Keluarga', statusMutasi: 'Aktif' },
    { id: 2, desaId: 'desa_1', noKk: '7503153001010001', nik: '7503157002950001', nama: 'Siti Aminah', ttl: 'Bone Bolango, 02-02-1995', jk: 'Perempuan', agama: 'Islam', pekerjaan: 'Mengurus Rumah Tangga', alamat: 'Dusun I', shdk: 'Istri', statusMutasi: 'Aktif' }
  ],
  templates: [
    {
      id: 't_1',
      desaId: 'desa_1',
      nama: 'Surat Keterangan Domisili',
      formFields: [
        { id: 'tujuan', label: 'Tujuan Surat', type: 'text', placeholder: 'Contoh: Bank BRI' },
        { id: 'keperluan', label: 'Keperluan', type: 'textarea', placeholder: 'Keperluan mengurus...' }
      ],
      konten: `<div style="text-align: center;"><strong>PEMERINTAH KABUPATEN {{KABUPATEN_UPPER}}</strong><br><strong>KECAMATAN {{KECAMATAN_UPPER}}</strong><br><strong>DESA {{NAMA_DESA_UPPER}}</strong><br>______________________________________________________________________</div><br><div style="text-align: center;"><strong><u>SURAT KETERANGAN DOMISILI</u></strong><br>Nomor: {{NOMOR_SURAT}}</div><br><p style="text-align: justify;">Yang bertanda tangan di bawah ini {{JABATAN_KADES}} {{NAMA_DESA}} Kecamatan {{KECAMATAN}} Kabupaten {{KABUPATEN}}, menerangkan bahwa:</p><table style="width: 100%;"><tbody><tr><td style="width: 25%;">Nama Lengkap</td><td>: <strong>{{NAMA_UPPER}}</strong></td></tr><tr><td>No. KK</td><td>: {{NO_KK}}</td></tr><tr><td>NIK</td><td>: {{NIK}}</td></tr><tr><td>Tempat, Tgl Lahir</td><td>: {{TTL}}</td></tr><tr><td>Jenis Kelamin</td><td>: {{JK}}</td></tr><tr><td>Agama</td><td>: {{AGAMA}}</td></tr><tr><td>Pekerjaan</td><td>: {{PEKERJAAN}}</td></tr><tr><td>Alamat</td><td>: {{ALAMAT}}</td></tr></tbody></table><br><p style="text-align: justify;">Orang tersebut di atas adalah benar-benar warga yang berdomisili di Desa {{NAMA_DESA}}. Surat keterangan ini dibuat untuk keperluan: <strong>{{KEPERLUAN}}</strong> dan ditujukan kepada <strong>{{TUJUAN}}</strong>.</p><p style="text-align: justify;">Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.</p><br><table style="width: 100%;"><tr><td style="width: 60%;"></td><td style="text-align: center;">{{NAMA_DESA}}, {{TANGGAL}}<br>{{JABATAN_KADES}}<br><br><br><br><strong><u>{{NAMA_KADES}}</u></strong><br>NIP. {{NIP_KADES}}</td></tr></table>`
    },
    {
      id: 't_2',
      desaId: 'desa_1',
      nama: 'Surat Keterangan Usaha (SKU)',
      formFields: [
        { id: 'nama_usaha', label: 'Nama Usaha', type: 'text', placeholder: 'Contoh: Toko Berkah' },
        { id: 'jenis_usaha', label: 'Jenis/Bidang Usaha', type: 'text', placeholder: 'Contoh: Sembako' },
        { id: 'alamat_usaha', label: 'Alamat Usaha', type: 'textarea', placeholder: 'Alamat lengkap lokasi usaha' },
        { id: 'tujuan', label: 'Tujuan Surat', type: 'text', placeholder: 'Contoh: Pengajuan KUR BRI' }
      ],
      konten: `<div style="text-align: center;"><strong>PEMERINTAH KABUPATEN {{KABUPATEN_UPPER}}</strong><br><strong>KECAMATAN {{KECAMATAN_UPPER}}</strong><br><strong>DESA {{NAMA_DESA_UPPER}}</strong><br>______________________________________________________________________</div><br><div style="text-align: center;"><strong><u>SURAT KETERANGAN USAHA</u></strong><br>Nomor: {{NOMOR_SURAT}}</div><br><p style="text-align: justify;">Yang bertanda tangan di bawah ini {{JABATAN_KADES}} {{NAMA_DESA}} Kecamatan {{KECAMATAN}} Kabupaten {{KABUPATEN}}, menerangkan bahwa:</p><table style="width: 100%; margin-bottom: 10px;"><tbody><tr><td style="width: 25%;">Nama Lengkap</td><td>: <strong>{{NAMA_UPPER}}</strong></td></tr><tr><td>NIK</td><td>: {{NIK}}</td></tr><tr><td>Tempat, Tgl Lahir</td><td>: {{TTL}}</td></tr><tr><td>Jenis Kelamin</td><td>: {{JK}}</td></tr><tr><td>Alamat</td><td>: {{ALAMAT}}</td></tr></tbody></table><p style="text-align: justify;">Adalah benar warga kami yang berdomisili di alamat tersebut dan berdasarkan pantauan kami yang bersangkutan benar memiliki usaha:</p><table style="width: 100%; margin-top: 10px; margin-bottom: 10px;"><tbody><tr><td style="width: 25%;">Nama Usaha</td><td>: <strong>{{NAMA_USAHA_UPPER}}</strong></td></tr><tr><td>Bidang Usaha</td><td>: {{JENIS_USAHA_TITLE}}</td></tr><tr><td>Alamat Usaha</td><td>: {{ALAMAT_USAHA}}</td></tr></tbody></table><p style="text-align: justify;">Surat keterangan ini diberikan kepada yang bersangkutan untuk keperluan <strong>{{TUJUAN}}</strong>.</p><p style="text-align: justify;">Demikian Surat Keterangan Usaha ini dibuat agar dapat dipergunakan sebagaimana mestinya oleh pihak yang berkepentingan.</p><br><table style="width: 100%;"><tr><td style="width: 60%;"></td><td style="text-align: center;">{{NAMA_DESA}}, {{TANGGAL}}<br>{{JABATAN_KADES}}<br><br><br><br><strong><u>{{NAMA_KADES}}</u></strong><br>NIP. {{NIP_KADES}}</td></tr></table>`
    },
    {
      id: 't_3',
      desaId: 'desa_1',
      nama: 'Surat Keterangan Tidak Mampu (SKTM)',
      formFields: [
        { id: 'nama_anak', label: 'Nama Anak / Tanggungan', type: 'text', placeholder: 'Isi jika untuk keperluan sekolah anak' },
        { id: 'tujuan', label: 'Tujuan Surat', type: 'text', placeholder: 'Contoh: Beasiswa Universitas' }
      ],
      konten: `<div style="text-align: center;"><strong>PEMERINTAH KABUPATEN {{KABUPATEN_UPPER}}</strong><br><strong>KECAMATAN {{KECAMATAN_UPPER}}</strong><br><strong>DESA {{NAMA_DESA_UPPER}}</strong><br>______________________________________________________________________</div><br><div style="text-align: center;"><strong><u>SURAT KETERANGAN TIDAK MAMPU</u></strong><br>Nomor: {{NOMOR_SURAT}}</div><br><p style="text-align: justify;">Yang bertanda tangan di bawah ini {{JABATAN_KADES}} {{NAMA_DESA}} Kecamatan {{KECAMATAN}} Kabupaten {{KABUPATEN}}, menerangkan dengan sebenarnya bahwa:</p><table style="width: 100%; margin-bottom: 10px;"><tbody><tr><td style="width: 25%;">Nama Lengkap</td><td>: <strong>{{NAMA_UPPER}}</strong></td></tr><tr><td>NIK</td><td>: {{NIK}}</td></tr><tr><td>Tempat, Tgl Lahir</td><td>: {{TTL}}</td></tr><tr><td>Pekerjaan</td><td>: {{PEKERJAAN}}</td></tr><tr><td>Alamat</td><td>: {{ALAMAT}}</td></tr></tbody></table><p style="text-align: justify;">Berdasarkan data dan sepengetahuan kami, yang bersangkutan benar adalah warga Desa {{NAMA_DESA}} dan tergolong dalam keluarga <strong>Kurang Mampu / Pra-Sejahtera</strong>.</p><p style="text-align: justify;">Surat keterangan ini dibuat untuk keperluan pengurusan <strong>{{TUJUAN}}</strong> atas nama tanggungan/anak: <strong>{{NAMA_ANAK_UPPER}}</strong>.</p><p style="text-align: justify;">Demikian Surat Keterangan Tidak Mampu (SKTM) ini dibuat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.</p><br><table style="width: 100%;"><tr><td style="width: 60%;"></td><td style="text-align: center;">{{NAMA_DESA}}, {{TANGGAL}}<br>{{JABATAN_KADES}}<br><br><br><br><strong><u>{{NAMA_KADES}}</u></strong><br>NIP. {{NIP_KADES}}</td></tr></table>`
    }
  ]
};

const RichTextEditor = ({ value, onChange, customFields = [] }) => {
  const editorRef = useRef(null);
  const [inTable, setInTable] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const checkTableSelection = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    let node = selection.anchorNode;
    while (node && node !== editorRef.current) {
      if (node.nodeName === 'TABLE') {
        setInTable(true);
        return;
      }
      node = node.parentNode;
    }
    setInTable(false);
  };

  const execCmd = (command, val = null) => {
    document.execCommand(command, false, val);
    editorRef.current.focus();
    handleInput();
  };

  const insertAdvancedTable = () => {
    const tableHtml = `<table border="1" style="width:100%; border-collapse: collapse; margin: 10px 0;">
      <tbody>
        <tr><th style="border: 1px solid black; padding: 6px; background: #f1f5f9;">No</th><th style="border: 1px solid black; padding: 6px; background: #f1f5f9;">Kolom 1</th><th style="border: 1px solid black; padding: 6px; background: #f1f5f9;">Kolom 2</th></tr>
        <tr><td style="border: 1px solid black; padding: 6px;">1</td><td style="border: 1px solid black; padding: 6px;">Isi Data 1</td><td style="border: 1px solid black; padding: 6px;">Isi Data 2</td></tr>
      </tbody>
    </table><p><br></p>`;
    execCmd('insertHTML', tableHtml);
  };

  const modifyTable = (action) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    let cell = selection.anchorNode;
    while (cell && cell.nodeName !== 'TD' && cell.nodeName !== 'TH') {
      cell = cell.parentNode;
    }
    if (!cell) return;
    const row = cell.parentNode;
    const table = row.parentNode.parentNode;

    if (action === 'addRowAfter') {
      const newRow = row.cloneNode(true);
      row.parentNode.insertBefore(newRow, row.nextSibling);
    } else if (action === 'addRowBefore') {
      const newRow = row.cloneNode(true);
      row.parentNode.insertBefore(newRow, row);
    } else if (action === 'deleteRow') {
      if (table.rows.length > 1) row.parentNode.removeChild(row);
    } else if (action === 'addColAfter') {
      for (let i = 0; i < table.rows.length; i++) {
        const r = table.rows[i];
        const x = r.insertCell(cell.cellIndex + 1);
        x.style.border = '1px solid black';
        x.style.padding = '6px';
        x.innerHTML = 'Sel Baru';
      }
    } else if (action === 'deleteCol') {
      const colIdx = cell.cellIndex;
      if (table.rows[0].cells.length > 1) {
        for (let i = 0; i < table.rows.length; i++) {
          table.rows[i].deleteCell(colIdx);
        }
      }
    }
    handleInput();
  };

  const insertVariableGroup = (type, varName) => {
    let code = `{{${varName}}}`;
    if (type === 'upper') code = `{{${varName}_UPPER}}`;
    if (type === 'title') code = `{{${varName}_TITLE}}`;
    if (type === 'lower') code = `{{${varName}_LOWER}}`;
    document.execCommand('insertText', false, code);
  };

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden flex flex-col bg-white h-full min-h-[400px]">
      <div className="bg-slate-100 border-b border-slate-300 p-2 flex flex-wrap gap-2 items-center">
        <div className="flex gap-1 border-r pr-2 border-slate-300">
          <button type="button" onClick={() => execCmd('bold')} className="p-1.5 hover:bg-slate-200 rounded text-slate-700" title="Bold"><Bold size={16}/></button>
          <button type="button" onClick={() => execCmd('italic')} className="p-1.5 hover:bg-slate-200 rounded text-slate-700" title="Italic"><Italic size={16}/></button>
          <button type="button" onClick={() => execCmd('underline')} className="p-1.5 hover:bg-slate-200 rounded text-slate-700" title="Underline"><Underline size={16}/></button>
        </div>
        <div className="flex gap-1 border-r pr-2 border-slate-300">
          <button type="button" onClick={() => execCmd('justifyLeft')} className="p-1.5 hover:bg-slate-200 rounded text-slate-700" title="Align Left"><AlignLeft size={16}/></button>
          <button type="button" onClick={() => execCmd('justifyCenter')} className="p-1.5 hover:bg-slate-200 rounded text-slate-700" title="Align Center"><AlignCenter size={16}/></button>
          <button type="button" onClick={() => execCmd('justifyRight')} className="p-1.5 hover:bg-slate-200 rounded text-slate-700" title="Align Right"><AlignRight size={16}/></button>
          <button type="button" onClick={() => execCmd('justifyFull')} className="p-1.5 hover:bg-slate-200 rounded text-slate-700" title="Justify"><AlignJustify size={16}/></button>
        </div>
        <div className="flex gap-1 border-r pr-2 border-slate-300">
          <button type="button" onClick={insertAdvancedTable} className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-1 text-slate-700"><TableIcon size={14}/> + Tabel Word</button>
        </div>

        <select onChange={(e) => { const [t, v] = e.target.value.split('|'); if(v) insertVariableGroup(t, v); e.target.value=''; }} className="text-xs border-slate-300 rounded p-1.5 bg-white outline-none font-medium text-slate-700">
          <option value="">+ Sisipkan Variabel</option>
          <optgroup label="Variabel Wilayah & Pejabat">
            <option value="upper|KABUPATEN">Kabupaten (KAPITAL)</option>
            <option value="upper|KECAMATAN">Kecamatan (KAPITAL)</option>
            <option value="upper|NAMA_DESA">Nama Desa (KAPITAL)</option>
            <option value="std|JABATAN_KADES">Jabatan Pimpinan</option>
            <option value="std|NAMA_KADES">Nama Pimpinan</option>
          </optgroup>
          <optgroup label="Huruf Besar Semua (CAPSLOCK)">
            <option value="upper|NAMA">Nama Warga (KAPITAL)</option>
            <option value="upper|ALAMAT">Alamat (KAPITAL)</option>
            <option value="upper|PEKERJAAN">Pekerjaan (KAPITAL)</option>
          </optgroup>
          <optgroup label="Awal Huruf Besar (Title Case)">
            <option value="title|NAMA">Nama Warga (Awal Kapital)</option>
            <option value="title|PEKERJAAN">Pekerjaan (Awal Kapital)</option>
          </optgroup>
          <optgroup label="Variabel Standar Lainnya">
            <option value="std|NO_KK">No. KK</option>
            <option value="std|NIK">NIK</option>
            <option value="std|TTL">Tempat, Tgl Lahir</option>
            <option value="std|JK">Jenis Kelamin</option>
            <option value="std|AGAMA">Agama</option>
            <option value="std|NOMOR_SURAT">Nomor Surat</option>
            <option value="std|TANGGAL">Tanggal Cetak</option>
            <option value="std|NIP_KADES">NIP Kepala Desa</option>
            {customFields.map(f => (
              <option key={f.id} value={`std|${f.id.toUpperCase()}`}>{f.label}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {inTable && (
        <div className="bg-amber-50 border-b border-amber-200 px-3 py-1 flex items-center gap-2 text-xs text-amber-800">
          <span className="font-bold">Kontrol Tabel:</span>
          <button type="button" onClick={() => modifyTable('addRowBefore')} className="bg-white border px-1.5 py-0.5 rounded shadow-sm hover:bg-amber-100">+ Baris Atas</button>
          <button type="button" onClick={() => modifyTable('addRowAfter')} className="bg-white border px-1.5 py-0.5 rounded shadow-sm hover:bg-amber-100">+ Baris Bawah</button>
          <button type="button" onClick={() => modifyTable('addColAfter')} className="bg-white border px-1.5 py-0.5 rounded shadow-sm hover:bg-amber-100">+ Kolom Kanan</button>
          <button type="button" onClick={() => modifyTable('deleteRow')} className="bg-white border px-1.5 py-0.5 rounded shadow-sm text-red-600 hover:bg-red-50">Hapus Baris</button>
          <button type="button" onClick={() => modifyTable('deleteCol')} className="bg-white border px-1.5 py-0.5 rounded shadow-sm text-red-600 hover:bg-red-50">Hapus Kolom</button>
        </div>
      )}

      <div 
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onKeyUp={checkTableSelection}
        onClick={checkTableSelection}
        className="p-6 flex-grow outline-none prose prose-sm max-w-none text-sm font-serif leading-relaxed overflow-y-auto"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

const Modal = ({ isOpen, title, onClose, children }) => {
  const modalBodyRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50 shrink-0">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200"><X size={20}/></button>
        </div>
        <div ref={modalBodyRef} className="p-6 overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

const CustomDialog = ({ dialog, closeDialog }) => {
  if (!dialog.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className={`p-6 ${dialog.type === 'confirm' ? 'bg-amber-50' : (dialog.isError ? 'bg-red-50' : 'bg-indigo-50')}`}>
           <h3 className={`text-lg font-bold flex items-center gap-2 ${dialog.type === 'confirm' ? 'text-amber-800' : (dialog.isError ? 'text-red-800' : 'text-indigo-800')}`}>
             {dialog.type === 'confirm' ? <AlertCircle size={24}/> : (dialog.isError ? <X size={24}/> : <Check size={24}/>)}
             {dialog.title || 'Perhatian'}
           </h3>
           <p className="mt-3 text-slate-700 text-sm leading-relaxed">{dialog.message}</p>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t flex justify-end gap-3">
           {dialog.type === 'confirm' && (
             <button onClick={closeDialog} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors text-sm">Batal</button>
           )}
           <button 
             onClick={() => {
               if (dialog.onConfirm) dialog.onConfirm();
               closeDialog();
             }} 
             className={`px-5 py-2.5 rounded-xl font-bold text-white shadow transition-colors text-sm ${dialog.type === 'confirm' ? 'bg-amber-600 hover:bg-amber-700' : (dialog.isError ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700')}`}
           >
             {dialog.type === 'confirm' ? 'Ya, Lanjutkan' : 'Mengerti'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [db, setDb] = useState(initialDatabase);
  const [isDbLoading, setIsDbLoading] = useState(true);
  
  const [currentUser, setCurrentUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dialog, setDialog] = useState({ isOpen: false, type: 'alert', message: '', title: '', isError: false, onConfirm: null });

  // MENGAMBIL DATA SAAT APLIKASI DIMUAT
  useEffect(() => {
  const fetchDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('desa_saas')
        .select('data_json')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (
        data &&
        data.data_json &&
        Object.keys(data.data_json).length > 0
      ) {
        setDb(data.data_json);
      } else {
        const { error: saveError } = await supabase
          .from('desa_saas')
          .upsert({
            id: 1,
            data_json: initialDatabase
          });

        if (saveError) throw saveError;

        setDb(initialDatabase);
      }

    } catch (error) {
      console.error('Gagal mengambil database:', error);
      setDb(initialDatabase);
    } finally {
      setIsDbLoading(false);
    }
  };

  fetchDatabase();
}, []);

// MENYIMPAN DATA KE SUPABASE
const saveDb = async (newDb) => {
  // Update tampilan langsung
  setDb(newDb);

  try {
    const { error } = await supabase
      .from('desa_saas')
      .update({
        data_json: newDb
      })
      .eq('id', 1);

    if (error) {
      console.error('Gagal menyimpan ke Supabase:', error);
    }
  } catch (error) {
    console.error('Kesalahan saat menyimpan ke Supabase:', error);
  }
};

  const showDialog = (options) => {
    setDialog({ isOpen: true, ...options });
  };
  const closeDialog = () => setDialog({ ...dialog, isOpen: false });

  if (isDbLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <div className="font-bold text-indigo-900 tracking-wider">MENGHUBUNGKAN KE SERVER...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <LandingAndLogin db={db} saveDb={saveDb} onLogin={(user) => { setCurrentUser(user); setActiveTab('dashboard'); }} />;
  }

  if (currentUser.role === 'kiosk') {
    return (
       <>
         <CustomDialog dialog={dialog} closeDialog={closeDialog} />
         <KioskView db={db} saveDb={saveDb} currentUser={currentUser} onLogout={() => setCurrentUser(null)} showDialog={showDialog} />
       </>
    );
  }

  return (
     <>
       <CustomDialog dialog={dialog} closeDialog={closeDialog} />
       <DashboardLayout db={db} saveDb={saveDb} currentUser={currentUser} onLogout={() => setCurrentUser(null)} activeTab={activeTab} setActiveTab={setActiveTab} showDialog={showDialog} />
     </>
  );
}

function KioskView({ db, saveDb, currentUser, onLogout, showDialog }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentDesa = db.desas.find(d => d.id === currentUser.desaId);
  const loketOperators = db.users.filter(u => u.desaId === currentDesa.id && u.role === 'operator');
  const isAnyLoketOpen = loketOperators.some(op => op.isLoketOpen);

  const themeStyles = {
    indigo: { glow: 'bg-indigo-500', button: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/50 text-white', text: 'text-indigo-400', mainBg: 'bg-slate-900', headerBg: 'bg-slate-800 text-white', boxBg: 'bg-slate-800/80 border-slate-700', titleText: 'text-white', subText: 'text-slate-300', footerBg: 'bg-slate-950 border-slate-800', border: 'border-slate-700', gradient: 'from-slate-950' },
    emerald: { glow: 'bg-emerald-500', button: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/50 text-white', text: 'text-emerald-400', mainBg: 'bg-slate-900', headerBg: 'bg-slate-800 text-white', boxBg: 'bg-slate-800/80 border-slate-700', titleText: 'text-white', subText: 'text-slate-300', footerBg: 'bg-slate-950 border-slate-800', border: 'border-slate-700', gradient: 'from-slate-950' },
    sky: { glow: 'bg-sky-500', button: 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/50 text-white', text: 'text-sky-400', mainBg: 'bg-slate-900', headerBg: 'bg-slate-800 text-white', boxBg: 'bg-slate-800/80 border-slate-700', titleText: 'text-white', subText: 'text-slate-300', footerBg: 'bg-slate-950 border-slate-800', border: 'border-slate-700', gradient: 'from-slate-950' },
    rose: { glow: 'bg-rose-500', button: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/50 text-white', text: 'text-rose-400', mainBg: 'bg-slate-900', headerBg: 'bg-slate-800 text-white', boxBg: 'bg-slate-800/80 border-slate-700', titleText: 'text-white', subText: 'text-slate-300', footerBg: 'bg-slate-950 border-slate-800', border: 'border-slate-700', gradient: 'from-slate-950' },
    amber: { glow: 'bg-amber-500', button: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/50 text-white', text: 'text-amber-400', mainBg: 'bg-slate-900', headerBg: 'bg-slate-800 text-white', boxBg: 'bg-slate-800/80 border-slate-700', titleText: 'text-white', subText: 'text-slate-300', footerBg: 'bg-slate-950 border-slate-800', border: 'border-slate-700', gradient: 'from-slate-950' },
    white: { glow: 'bg-slate-200', button: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30 text-white', text: 'text-indigo-600', mainBg: 'bg-slate-50', headerBg: 'bg-white text-slate-800', boxBg: 'bg-white border-slate-200 shadow-xl', titleText: 'text-slate-900', subText: 'text-slate-600', footerBg: 'bg-white border-slate-200', border: 'border-slate-200', gradient: 'from-white' },
  };
  
  const activeTheme = themeStyles[currentDesa.kioskTheme || 'indigo'] || themeStyles.indigo;
  const layoutType = currentDesa.kioskLayout || 'center';
  const sisaAntrian = (currentDesa.antrianCurrent || 0) - (currentDesa.antrianCalled || 0);
  const runningText = currentDesa.kioskRunningText || 'Selamat datang di Pusat Pelayanan Terpadu Desa. Silakan ambil nomor antrean Anda.';
  const displayTitle = currentDesa.kioskTitle || 'Selamat Datang';
  const displaySubtitle = currentDesa.kioskSubtitle || 'Silakan ambil nomor antrean untuk mendapatkan pelayanan.';
  
  const customColor = currentDesa.kioskTextColor;
  const textStyle = customColor ? { color: customColor } : {};

  const handleTakeTicket = () => {
    if (!isAnyLoketOpen) {
      showDialog({ type: 'alert', title: 'Loket Tutup', message: 'Mohon maaf, semua loket pelayanan sedang ditutup.', isError: true });
      return;
    }
    const newNum = (currentDesa.antrianCurrent || 0) + 1;
    const updatedDesas = db.desas.map(d => d.id === currentDesa.id ? { ...d, antrianCurrent: newNum } : d);
    saveDb({ ...db, desas: updatedDesas });
    
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const titleSubtitleJSX = layoutType !== 'minimalist' ? (
     <div className={`${['split', 'split-reverse'].includes(layoutType) ? 'text-left' : 'text-center'} mb-8`}>
        <h2 className={`text-5xl md:text-6xl font-extrabold mb-4 ${!customColor ? activeTheme.titleText : ''}`} style={textStyle}>{displayTitle}</h2>
        <p className={`text-xl ${!customColor ? activeTheme.subText : ''}`} style={textStyle}>{displaySubtitle}</p>
     </div>
  ) : (
     <div className="mb-4">
        <h2 className={`text-4xl font-extrabold ${!customColor ? activeTheme.titleText : ''}`} style={textStyle}>{displayTitle}</h2>
     </div>
  );

  const ticketBoxJSX = (
     <div className={`${activeTheme.boxBg} backdrop-blur-md ${layoutType === 'minimalist' ? 'p-12 md:p-16' : 'p-10 md:p-12'} rounded-[3rem] border shadow-2xl flex flex-col items-center transition-colors duration-500 w-full`}>
        <div className={`font-bold uppercase tracking-widest mb-4 ${currentDesa.kioskTheme === 'white' ? 'text-slate-500' : 'text-slate-400'}`}>Total Antrian Saat Ini</div>
        <div className={`${layoutType === 'minimalist' ? 'text-9xl md:text-[12rem]' : 'text-8xl md:text-[10rem]'} font-black font-mono leading-none tracking-tighter mb-4 ${!customColor ? activeTheme.text : ''}`} style={textStyle}>
           {String(currentDesa.antrianCurrent || 0).padStart(3, '0')}
        </div>
        
        <div className={`font-medium mb-10 ${activeTheme.mainBg} bg-opacity-50 px-4 py-2 rounded-full border ${activeTheme.border} ${!customColor ? activeTheme.subText : ''}`} style={textStyle}>
            Sisa antrean menunggu: <span className={`font-bold ${!customColor ? activeTheme.titleText : ''}`} style={textStyle}>{sisaAntrian < 0 ? 0 : sisaAntrian} orang</span>
        </div>
        
        <button 
          onClick={handleTakeTicket}
          disabled={!isAnyLoketOpen}
          className={`w-full md:w-auto px-16 py-8 rounded-full font-bold text-3xl md:text-4xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-4 ${isAnyLoketOpen ? activeTheme.button : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
        >
          <Printer size={40}/> {isAnyLoketOpen ? 'AMBIL ANTRIAN' : 'LOKET TUTUP'}
        </button>
     </div>
  );

  const loketListJSX = (
     <div className={`w-full flex ${layoutType === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8' : (['split', 'split-reverse'].includes(layoutType) ? 'flex-col gap-4' : 'justify-center gap-4 flex-wrap mt-12')}`}>
        {['split', 'split-reverse'].includes(layoutType) && <h3 className={`w-full text-2xl font-bold mb-4 border-b pb-4 ${!customColor ? activeTheme.titleText : ''} ${!customColor ? activeTheme.border : 'border-current'}`} style={textStyle}>Status Loket Pelayanan</h3>}
        {loketOperators.map(op => {
           const loketStyle = op.isLoketOpen 
             ? (currentDesa.kioskTheme === 'white' ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-emerald-900/40 border-emerald-500/50 text-emerald-400')
             : (currentDesa.kioskTheme === 'white' ? 'bg-red-100 border-red-300 text-red-800' : 'bg-red-900/40 border-red-500/50 text-red-400');
           return (
           <div key={op.id} className={`px-6 py-4 rounded-2xl border flex items-center gap-4 shadow-lg ${loketStyle} ${['split', 'split-reverse'].includes(layoutType) ? 'w-full text-lg' : ''}`}>
              <div className={`w-4 h-4 rounded-full ${op.isLoketOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="font-bold uppercase tracking-wider">Loket {op.nomorLoket || op.nama}</span>
              {['split', 'split-reverse'].includes(layoutType) && <span className={`ml-auto text-sm ${currentDesa.kioskTheme === 'white' ? 'opacity-80' : 'text-slate-400'}`}>{op.isLoketOpen ? 'BUKA' : 'TUTUP'}</span>}
           </div>
           )
        })}
        {loketOperators.length === 0 && <div className={`${!customColor ? activeTheme.subText : ''} italic w-full text-center mt-4`} style={textStyle}>Belum ada operator loket terdaftar.</div>}
     </div>
  );

  return (
    <div className={`min-h-screen ${activeTheme.mainBg} flex flex-col font-sans transition-colors duration-500`}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-kertas, #print-kertas * { visibility: visible; }
          #print-kertas { position: absolute; left: 0; top: 0; width: 80mm; padding: 10px; font-family: sans-serif; color: black; background: white;}
          .print\\:hidden { display: none !important; }
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
      
      <header className={`${activeTheme.headerBg} p-6 flex justify-between items-center print:hidden shadow-md transition-colors duration-500`}>
        <div className="flex items-center gap-4">
          {currentDesa.logoDesa ? <img src={currentDesa.logoDesa} className="h-12 w-12 bg-white rounded p-1 object-contain shadow-sm" alt="Logo"/> : <div className="h-12 w-12 bg-indigo-600 text-white rounded flex items-center justify-center font-bold text-xl">SD</div>}
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest" style={textStyle}>{currentDesa.namaDesa}</h1>
            <p className="opacity-70 text-sm" style={textStyle}>Mesin Antrian Mandiri</p>
          </div>
        </div>
        
        <div className={`hidden md:block text-center border-l ${activeTheme.border} pl-6 ml-auto mr-6`}>
           <div className="text-xl font-bold font-mono tracking-wider" style={textStyle}>{time.toLocaleTimeString('id-ID')}</div>
           <div className="text-xs uppercase tracking-widest opacity-70" style={textStyle}>{time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>

        <button onClick={onLogout} className={`opacity-60 hover:opacity-100 flex flex-col items-center gap-1 transition-all border-l ${activeTheme.border} pl-6 hover:text-red-500`} style={textStyle}>
           <Power size={24}/> <span className="text-[10px] uppercase font-bold">Keluar</span>
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8 pb-20 print:hidden relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-center items-center">
           <div className={`w-[800px] h-[800px] rounded-full blur-[150px] ${activeTheme.glow}`}></div>
        </div>

        <div className={`z-10 w-full ${['split', 'split-reverse', 'grid'].includes(layoutType) ? 'max-w-7xl' : 'max-w-5xl'}`}>
           {layoutType === 'center' && (
              <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
                 {titleSubtitleJSX}
                 {ticketBoxJSX}
                 {loketListJSX}
              </div>
           )}

           {layoutType === 'split' && (
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                 <div className="w-full md:w-1/2 flex flex-col">
                    {titleSubtitleJSX}
                    {ticketBoxJSX}
                 </div>
                 <div className={`w-full md:w-1/2 border-t md:border-t-0 md:border-l ${activeTheme.border} pt-8 md:pt-0 pl-0 md:pl-12 flex flex-col justify-center`}>
                    {loketListJSX}
                 </div>
              </div>
           )}

           {layoutType === 'split-reverse' && (
              <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12">
                 <div className="w-full md:w-1/2 flex flex-col">
                    {titleSubtitleJSX}
                    {ticketBoxJSX}
                 </div>
                 <div className={`w-full md:w-1/2 border-t md:border-t-0 md:border-r ${activeTheme.border} pt-8 md:pt-0 pr-0 md:pr-12 flex flex-col justify-center`}>
                    {loketListJSX}
                 </div>
              </div>
           )}

           {layoutType === 'grid' && (
              <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
                 {titleSubtitleJSX}
                 <div className="max-w-4xl w-full">{ticketBoxJSX}</div>
                 {loketListJSX}
              </div>
           )}

           {layoutType === 'minimalist' && (
              <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
                 {titleSubtitleJSX}
                 {ticketBoxJSX}
                 {loketListJSX}
              </div>
           )}
        </div>
      </main>

      <footer className={`${activeTheme.footerBg} border-t py-4 overflow-hidden relative print:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-20 transition-colors duration-500`}>
         <div className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r ${activeTheme.gradient} to-transparent z-10`}></div>
         <div className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l ${activeTheme.gradient} to-transparent z-10`}></div>
         <div className="whitespace-nowrap animate-[marquee_25s_linear_infinite] flex items-center">
            <span className={`text-xl font-medium tracking-wide ${!customColor ? activeTheme.text : ''}`} style={textStyle}>◆ {runningText}</span>
            <span className={`text-xl font-medium tracking-wide mx-20 ${!customColor ? activeTheme.text : ''}`} style={textStyle}>◆ {runningText}</span>
         </div>
      </footer>

      <div id="print-kertas" className="hidden">
         <div style={{textAlign: 'center', borderBottom: '2px dashed #000', paddingBottom: '20px', marginBottom: '20px'}}>
           <h2 style={{fontSize: '24px', margin: '0 0 5px 0', textTransform: 'uppercase'}}>{currentDesa.namaDesa}</h2>
           <p style={{fontSize: '12px', margin: 0}}>Layanan Administrasi Terpadu</p>
         </div>
         <div style={{textAlign: 'center', margin: '30px 0'}}>
            <p style={{fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0'}}>NOMOR ANTRIAN ANDA</p>
            <h1 style={{fontSize: '64px', margin: 0, fontFamily: 'monospace'}}>{String(currentDesa.antrianCurrent || 0).padStart(3, '0')}</h1>
         </div>
         <div style={{textAlign: 'center'}}>
           <p style={{fontSize: '12px', marginBottom: '10px'}}>Silakan menunggu hingga<br/>nomor Anda dipanggil.</p>
           <p style={{fontSize: '10px', color: '#666'}}>
             {new Date().toLocaleDateString('id-ID')} {new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}
           </p>
         </div>
      </div>
    </div>
  );
}

function LandingAndLogin({ db, saveDb, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const cfg = db.appConfig;
  const layout = cfg.landingLayout || 'center';

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const found = db.users.find(u => u.username === username && u.password === password);
    if (found) {
      if (found.role !== 'superadmin') {
        const userDesa = db.desas.find(d => d.id === found.desaId);
        if (userDesa && userDesa.isActive === false) {
          setErrorMsg('Akses Ditolak: Layanan desa ini sedang dinonaktifkan sementara (Suspend). Hubungi Superadmin.');
          return;
        }
      }
      onLogin(found);
    } else {
      setErrorMsg('Username atau Password salah! Periksa kembali.');
    }
  };

  return (
    <div className={`min-h-screen ${cfg.fontFamily} bg-slate-50 flex flex-col justify-between text-slate-800`}>
      <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {cfg.landingLogo ? (
            <img src={cfg.landingLogo} alt="Logo" className="w-10 h-10 object-contain rounded" />
          ) : (
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">SD</div>
          )}
          <span className="font-bold text-lg text-slate-900 tracking-tight">{cfg.landingTitle}</span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className={`max-w-5xl w-full ${layout.includes('split') ? 'grid grid-cols-1 md:grid-cols-2 gap-12 items-center' : 'flex flex-col ' + (layout === 'left' ? 'items-start text-left' : 'items-center text-center')}`}>
          
          {layout === 'split-reverse' && cfg.landingLogo && (
            <div className="flex justify-center order-last md:order-first mb-8 md:mb-0">
              <img src={cfg.landingLogo} alt="Ilustrasi Portal" className="max-h-80 object-contain drop-shadow-xl rounded-2xl p-4 bg-white border" />
            </div>
          )}

          <div className="space-y-6 w-full">
            {['center', 'left'].includes(layout) && cfg.landingLogo && (
              <div className={`flex w-full ${layout === 'left' ? 'justify-start' : 'justify-center'} mb-4`}>
                <img src={cfg.landingLogo} alt="Logo Utama" className="h-28 object-contain drop-shadow-md rounded-2xl bg-white p-2 border" />
              </div>
            )}

            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold uppercase tracking-wider">Portal Layanan Resmi Terpadu</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">{cfg.landingTitle}</h1>
            <p className="text-lg text-slate-600 font-medium">{cfg.landingSubtitle}</p>
            <p className="text-slate-500 text-sm leading-relaxed">{cfg.landingAbout}</p>
            
            <div className="pt-6 flex justify-center w-full">
              <button onClick={() => setShowLoginModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
                Masuk Portal <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {layout === 'split' && cfg.landingLogo && (
            <div className="flex justify-center mt-8 md:mt-0">
              <img src={cfg.landingLogo} alt="Ilustrasi Portal" className="max-h-80 object-contain drop-shadow-xl rounded-2xl p-4 bg-white border" />
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t py-4 text-center text-xs text-slate-500">
        &copy; 2026 Sistem Informasi Manajemen Pelayanan Desa. Hak Cipta Dilindungi Undang-Undang. by : Rahman Ibrahim
      </footer>

      <Modal isOpen={showLoginModal} title="Silahkan Login" onClose={() => setShowLoginModal(false)}>
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0" /> {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1 w-fit">Username</label>
            <input required type="text" placeholder="Masukkan username..." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1 w-fit">Password</label>
            <input required type="password" placeholder="Masukkan password..." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="pt-3">
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow transition-all flex justify-center items-center gap-2">
              <Lock size={16} /> Login
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function DashboardLayout({ db, saveDb, currentUser, onLogout, activeTab, setActiveTab, showDialog }) {
  const [impersonateDesaId, setImpersonateDesaId] = useState(null);

  let currentDesa = null;
  if (currentUser.role === 'superadmin') {
    currentDesa = impersonateDesaId ? db.desas.find(d => d.id === impersonateDesaId) : db.desas[0];
  } else {
    currentDesa = db.desas.find(d => d.id === currentUser.desaId) || db.desas[0];
  }

  const cfg = db.appConfig;
  const effectiveRole = currentUser.role;
  const isLockedForOperator = effectiveRole === 'operator' && currentDesa.isPendudukLocked;

  const getTabs = () => {
    if (effectiveRole === 'superadmin') {
      return [
        { id: 'dashboard', label: 'Dashboard Superadmin', icon: LayoutDashboard },
        { id: 'saas_desas', label: 'Manajemen Desa SaaS', icon: Users },
        { id: 'saas_templates', label: 'Distribusi Template', icon: FileText },
        { id: 'saas_settings', label: 'Pengaturan Global', icon: Settings },
        { id: 'saas_db', label: 'Database & Reset', icon: Database },
      ];
    } else if (effectiveRole === 'admin') {
      const adminTabs = [
        { id: 'dashboard', label: 'Dashboard Desa', icon: Home },
        { id: 'buat_surat', label: 'Buat Surat', icon: FileDown },
        { id: 'penduduk', label: 'Data Penduduk', icon: Users },
        { id: 'template', label: 'Manajemen Template', icon: FileText },
        { id: 'operator', label: 'Manajemen Operator', icon: UserCheck },
        { id: 'pengaturan', label: 'Pengaturan Desa', icon: Settings },
      ];
      if (currentDesa.isAntrianEnabled) adminTabs.splice(1, 0, { id: 'antrian', label: 'Sistem Antrian', icon: Bell });
      return adminTabs;
    } else {
      const oprTabs = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'buat_surat', label: 'Buat Surat', icon: FileDown },
        { id: 'penduduk', label: 'Data Penduduk (Lihat)', icon: Users },
      ];
      if (currentDesa.isAntrianEnabled) oprTabs.splice(1, 0, { id: 'antrian', label: 'Sistem Antrian', icon: Bell });
      return oprTabs;
    }
  };

  const tabs = getTabs();

  return (
    <div className={`min-h-screen ${cfg.fontFamily} bg-slate-100 flex flex-col print:bg-white`}>
      <header className="bg-indigo-900 text-white shadow-md print:hidden sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentDesa?.logoDesa ? (
              <img src={currentDesa.logoDesa} alt="Logo" className="w-9 h-9 object-contain bg-white rounded p-0.5" />
            ) : (
              <div className="bg-white/20 p-2 rounded-lg"><FileText size={20} /></div>
            )}
            <div>
              <h1 className="font-bold text-base leading-tight">{cfg.landingTitle}</h1>
              {currentDesa && (
                 <p className="text-xs text-indigo-200">Desa: <strong className="text-white">{currentDesa.namaDesa}</strong> (Kec. {currentDesa.namaKecamatan}, Kab. {currentDesa.namaKabupaten})</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-bold bg-indigo-800 px-3 py-1 rounded-full uppercase tracking-wider text-indigo-100 inline-block">
                Role: {currentUser.role}
              </div>
              <div className="text-xs text-indigo-300 mt-0.5">{currentUser.nama}</div>
            </div>
            <button onClick={onLogout} className="bg-red-600 hover:bg-red-700 p-2 rounded-lg text-white transition-colors" title="Keluar"><LogOut size={18}/></button>
          </div>
        </div>
      </header>

      {currentUser.role === 'superadmin' && currentDesa && (
        <div className="bg-amber-500 text-slate-900 px-6 py-2 text-xs font-bold flex justify-between items-center print:hidden shadow-inner">
          <div className="flex items-center gap-2">
            <AlertCircle size={14}/> <span>Mode Superadmin Mengontrol Desa:</span>
            <select className="bg-white text-slate-800 px-2 py-1 rounded border text-xs font-bold outline-none" value={currentDesa.id} onChange={e => setImpersonateDesaId(e.target.value)}>
              {db.desas.map(d => <option key={d.id} value={d.id}>{d.namaDesa} - {d.namaKabupaten}</option>)}
            </select>
          </div>
          <span>Semua aksi di bawah ini merepresentasikan desa yang dipilih di atas.</span>
        </div>
      )}

      <nav className="bg-white border-b shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-6 flex gap-6 overflow-x-auto">
          {tabs.map((menu) => (
            <button
              key={menu.id}
              onClick={() => setActiveTab(menu.id)}
              className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium transition-colors whitespace-nowrap text-sm ${
                activeTab === menu.id 
                  ? 'border-indigo-600 text-indigo-600 font-bold' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <menu.icon size={16} /> {menu.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl w-full mx-auto p-6 flex-grow print:p-0">
        {activeTab === 'dashboard' && <DashboardView db={db} currentDesa={currentDesa} currentUser={currentUser} />}
        {activeTab === 'antrian' && <AntrianView db={db} saveDb={saveDb} currentDesa={currentDesa} currentUser={currentUser} showDialog={showDialog} />}
        {activeTab === 'buat_surat' && <BuatSuratView db={db} saveDb={saveDb} currentDesa={currentDesa} currentUser={currentUser} />}
        {activeTab === 'penduduk' && <PendudukView db={db} saveDb={saveDb} currentDesa={currentDesa} isLockedForOperator={isLockedForOperator} currentUser={currentUser} showDialog={showDialog} />}
        {activeTab === 'template' && <TemplateView db={db} saveDb={saveDb} currentDesa={currentDesa} showDialog={showDialog} />}
        {activeTab === 'operator' && <OperatorView db={db} saveDb={saveDb} currentDesa={currentDesa} showDialog={showDialog} />}
        {activeTab === 'pengaturan' && <PengaturanDesaView db={db} saveDb={saveDb} currentDesa={currentDesa} currentUser={currentUser} showDialog={showDialog} />}
        
        {activeTab === 'saas_desas' && <SuperDesasView db={db} saveDb={saveDb} showDialog={showDialog} />}
        {activeTab === 'saas_templates' && <SuperTemplatesView db={db} saveDb={saveDb} showDialog={showDialog} />}
        {activeTab === 'saas_settings' && <SuperSettingsView db={db} saveDb={saveDb} showDialog={showDialog} />}
        {activeTab === 'saas_db' && <SuperDatabaseView db={db} saveDb={saveDb} showDialog={showDialog} />}
      </main>
    </div>
  );
}

function DashboardView({ db, currentDesa, currentUser }) {
  if (!currentDesa) return <div>Menunggu data desa...</div>;

  const pendudukCount = db.penduduk.filter(p => p.desaId === currentDesa.id).length;
  const templateCount = db.templates.filter(t => t.desaId === currentDesa.id).length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 text-white p-8 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="bg-indigo-700 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Dashboard Aktif</span>
          <h2 className="text-3xl font-extrabold mt-2">{currentDesa.namaDesa}</h2>
          <p className="text-indigo-200 text-sm mt-1">Kecamatan {currentDesa.namaKecamatan}, Kabupaten {currentDesa.namaKabupaten}, Provinsi {currentDesa.namaProvinsi}</p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl backdrop-blur border border-white/20 text-right">
          <div className="text-xs text-indigo-200 font-semibold">KEPALA DESA / PIMPINAN</div>
          <div className="text-lg font-bold">{currentDesa.namaKades || 'Belum diatur'} ({currentDesa.jabatanKades})</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="bg-indigo-50 p-4 rounded-xl text-indigo-600"><Users size={32} /></div>
          <div><div className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded w-fit mb-1">Total Warga</div><div className="text-2xl font-extrabold text-slate-800">{pendudukCount} Jiwa</div></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600"><FileText size={32} /></div>
          <div><div className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded w-fit mb-1">Template Surat</div><div className="text-2xl font-extrabold text-slate-800">{templateCount} Format</div></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="bg-amber-50 p-4 rounded-xl text-amber-600"><UserCheck size={32} /></div>
          <div><div className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded w-fit mb-1">Status Penguncian</div><div className="text-xl font-bold text-slate-800">{currentDesa.isPendudukLocked ? 'Terkunci (Aman)' : 'Terbuka'}</div></div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 p-6 rounded-2xl flex items-start gap-4">
        <AlertCircle size={24} className="shrink-0 mt-0.5 text-indigo-600" />
        <div>
          <h4 className="font-bold text-base">Panduan Cepat Pelayanan Desa</h4>
          <p className="text-sm mt-1 leading-relaxed">Gunakan menu <strong>Buat Surat</strong> untuk melayani warga dengan cepat. Pilih NIK warga, pilih jenis template surat, isi form inti yang dibutuhkan, lakukan verifikasi, lalu cetak langsung ke printer atau ekspor ke PDF.</p>
        </div>
      </div>
    </div>
  );
}

function AntrianView({ db, saveDb, currentDesa, currentUser, showDialog }) {
  const [adminSelectedLoket, setAdminSelectedLoket] = useState('');

  useEffect(() => {
    const today = new Date().toDateString();
    if (currentDesa.lastAntrianDate !== today) {
      const updatedDesas = db.desas.map(d => d.id === currentDesa.id ? { ...d, antrianCurrent: 0, antrianCalled: 0, lastAntrianDate: today } : d);
      saveDb({ ...db, desas: updatedDesas });
    }
  }, []);

  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superadmin';
  const isOperator = currentUser.role === 'operator';
  const myUser = db.users.find(u => u.id === currentUser.id);

  const updateAntrian = (updates) => {
    const updatedDesas = db.desas.map(d => d.id === currentDesa.id ? { ...d, ...updates } : d);
    saveDb({ ...db, desas: updatedDesas });
  };

  const handleToggleLoket = () => {
    const updatedUsers = db.users.map(u => u.id === currentUser.id ? { ...u, isLoketOpen: !u.isLoketOpen } : u);
    saveDb({ ...db, users: updatedUsers });
  };

  const playPanggilan = (nomor) => {
    playTingTong().then(() => {
      let loketName = '';
      if (isAdmin && adminSelectedLoket) {
        const selectedOpr = db.users.find(u => u.id === adminSelectedLoket);
        loketName = selectedOpr?.nomorLoket ? `, loket, ${selectedOpr.nomorLoket}` : ', loket pelayanan';
      } else {
        loketName = myUser?.nomorLoket ? `, loket, ${myUser.nomorLoket}` : ', loket pelayanan';
      }

      const msg = new SpeechSynthesisUtterance(`Panggilan untuk nomor antrian, ${nomor}, silakan menuju ke${loketName}.`);
      msg.lang = 'id-ID';
      msg.rate = 0.85; 
      
      if (currentDesa.voiceURI) {
        const availableVoices = window.speechSynthesis.getVoices();
        const selectedVoice = availableVoices.find(v => v.voiceURI === currentDesa.voiceURI);
        if (selectedVoice) msg.voice = selectedVoice;
      }

      window.speechSynthesis.speak(msg);
    });
  };

  const handleNext = () => {
    const nextNum = (currentDesa.antrianCalled || 0) + 1;
    if (nextNum > (currentDesa.antrianCurrent || 0)) {
      showDialog({ type: 'alert', title: 'Info Antrian', message: 'Belum ada antrian baru warga yang menunggu.' });
      return;
    }
    updateAntrian({ antrianCalled: nextNum });
    playPanggilan(nextNum);
  };

  const handleAdminTakeTicket = () => {
    const newNum = (currentDesa.antrianCurrent || 0) + 1;
    updateAntrian({ antrianCurrent: newNum });
  };

  const handleReset = () => {
    if (currentDesa.antrianCurrent !== currentDesa.antrianCalled && currentDesa.antrianCurrent > 0) {
      showDialog({ type: 'alert', title: 'Gagal Reset', message: 'Tidak bisa reset antrian: Masih ada warga yang belum dipanggil.', isError: true });
      return;
    }
    showDialog({
       type: 'confirm',
       title: 'Reset Antrian?',
       message: 'Yakin ingin mereset antrian kembali ke nomor 0?',
       onConfirm: () => updateAntrian({ antrianCurrent: 0, antrianCalled: 0 })
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between text-amber-800 text-sm">
         <div className="flex items-center gap-2 font-bold"><MonitorPlay size={18}/> Layar Antrian Terhubung ke Anjungan (Kiosk)</div>
         <div>Pencetakan tiket warga kini dilakukan terpusat di akun Role "Anjungan Kiosk".</div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 print:hidden">
        
        <div className="flex-1 bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center flex flex-col justify-center items-center">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Sedang Dipanggil</h3>
          {isOperator && myUser?.nomorLoket && <div className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full mb-4">Loket {myUser.nomorLoket}</div>}
          {isAdmin && <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-4">Kontrol Penuh Admin Aktif</div>}
          
          <div className="text-8xl md:text-[10rem] font-extrabold text-indigo-700 font-mono tracking-tighter leading-none">
            {String(currentDesa.antrianCalled || 0).padStart(3, '0')}
          </div>
          
          <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-4 w-full max-w-lg">
            {(isOperator || isAdmin) && (
               <div className="flex flex-col items-center gap-3 w-full">
                  {isAdmin && (
                    <div className="flex flex-col items-start gap-1 w-full mb-2">
                      <div className="flex items-center gap-2 w-full">
                        <label className="text-xs font-bold text-slate-500 uppercase shrink-0">Pilih Loket:</label>
                        <select className="flex-1 p-2.5 border border-slate-300 rounded-xl text-sm outline-none bg-white font-bold text-slate-700" value={adminSelectedLoket} onChange={e => setAdminSelectedLoket(e.target.value)}>
                          <option value="">-- Pilih Loket Tujuan --</option>
                          {db.users.filter(u => u.desaId === currentDesa.id && u.role === 'operator' && u.isLoketOpen).map(op => (
                            <option key={op.id} value={op.id}>Loket {op.nomorLoket || op.nama}</option>
                          ))}
                        </select>
                      </div>
                      {db.users.filter(u => u.desaId === currentDesa.id && u.role === 'operator' && u.isLoketOpen).length === 0 && (
                        <div className="text-[10px] text-red-500 font-bold ml-20">Semua loket pelayanan sedang tutup.</div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-4 w-full">
                    <button onClick={handleNext} disabled={(isOperator && !myUser?.isLoketOpen) || (isAdmin && !adminSelectedLoket)} className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-md transition-all ${((isOperator && myUser?.isLoketOpen) || (isAdmin && adminSelectedLoket)) ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}>
                       <Volume2 size={24} /> Panggil Selanjutnya
                    </button>
                    <button onClick={() => playPanggilan(currentDesa.antrianCalled || 0)} disabled={((isOperator && !myUser?.isLoketOpen) || (isAdmin && !adminSelectedLoket)) || currentDesa.antrianCalled === 0} className={`px-6 py-4 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all ${(((isOperator && myUser?.isLoketOpen) || (isAdmin && adminSelectedLoket)) && currentDesa.antrianCalled > 0) ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                       <Bell size={20} /> Panggil Ulang
                    </button>
                  </div>
               </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-80 bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-inner">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Antrian Masuk</h3>
            <div className="text-6xl font-extrabold text-slate-800 font-mono">
              {String(currentDesa.antrianCurrent || 0).padStart(3, '0')}
            </div>
            <p className="text-sm text-slate-500 mt-2">Warga Menunggu: <span className="font-bold text-amber-600 px-2 py-0.5 bg-amber-50 rounded">{(currentDesa.antrianCurrent || 0) - (currentDesa.antrianCalled || 0)} orang</span></p>
          </div>
          
          <div className="mt-8 space-y-4 pt-6 border-t border-slate-100">
            {isAdmin && (
               <>
                 <button onClick={handleAdminTakeTicket} className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-4 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all">
                    <Printer size={18} /> Ambil Antrian Manual
                 </button>
                 <button onClick={handleReset} className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all">
                    <RefreshCw size={18} /> Reset Antrian ke 0
                 </button>
               </>
            )}

            {isOperator && myUser?.canTakeAntrian && (
               <button onClick={handleAdminTakeTicket} className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-4 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all mb-4">
                  <Printer size={18} /> Ambil Antrian Manual
               </button>
            )}

            {isOperator && (
               <button onClick={handleToggleLoket} className={`w-full px-4 py-4 rounded-xl font-bold flex justify-center items-center gap-3 shadow-md transition-all ${myUser?.isLoketOpen ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'}`}>
                  {myUser?.isLoketOpen ? 'TUTUP LOKET SAYA' : 'BUKA LOKET SAYA'}
               </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BuatSuratView({ db, saveDb, currentDesa, currentUser }) {
  const [subTab, setSubTab] = useState('buat'); // Tab: buat, riwayat
  const [viewRiwayat, setViewRiwayat] = useState(null);
  const [suratState, setSuratState] = useState({
    step: 1,
    nik: '',
    templateId: '',
    nomorSurat: '474/' + Math.floor(100 + Math.random() * 900) + '/Desa/' + new Date().getFullYear(),
    formValues: {},
    customContent: '',
    isVerified: false
  });
  const [searchWarga, setSearchWarga] = useState(null);
  
  const riwayatSurat = (db.registerSurat || []).filter(r => r.desaId === currentDesa.id).sort((a,b) => b.timestamp - a.timestamp);
  const villagePenduduk = db.penduduk.filter(p => p.desaId === currentDesa.id && (!p.statusMutasi || p.statusMutasi === 'Aktif'));
  const villageTemplates = db.templates.filter(t => t.desaId === currentDesa.id);
  
  const activeTemplate = villageTemplates.find(t => String(t.id) === String(suratState.templateId));

  const handleNikSearch = (nik) => {
    setSuratState(prev => ({ ...prev, nik }));
    if (nik.length >= 6) {
      const found = villagePenduduk.find(p => p.nik.includes(nik));
      setSearchWarga(found || null);
    } else {
      setSearchWarga(null);
    }
  };

  const handleFormInputChange = (fieldId, val) => {
    setSuratState(prev => ({
      ...prev,
      formValues: { ...prev.formValues, [fieldId]: val }
    }));
  };

  const helperFormatText = (text, type) => {
    if (!text) return '';
    if (type === 'UPPER') return text.toUpperCase();
    if (type === 'LOWER') return text.toLowerCase();
    if (type === 'TITLE') return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    return text;
  };

  const generateDraft = () => {
    if (!searchWarga || !activeTemplate) return;

    let text = activeTemplate.konten;
    
    const simpleReplacements = [
       { tag: 'NAMA', val: searchWarga.nama },
       { tag: 'NO_KK', val: searchWarga.noKk || '-' },
       { tag: 'NIK', val: searchWarga.nik },
       { tag: 'TTL', val: searchWarga.ttl },
       { tag: 'JK', val: searchWarga.jk },
       { tag: 'ALAMAT', val: searchWarga.alamat },
       { tag: 'PEKERJAAN', val: searchWarga.pekerjaan },
       { tag: 'AGAMA', val: searchWarga.agama },
       { tag: 'NOMOR_SURAT', val: suratState.nomorSurat },
       { tag: 'TANGGAL', val: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ];

    simpleReplacements.forEach(r => {
       text = text.replace(new RegExp(`{{${r.tag}}}`, 'g'), r.val);
    });

    const desaVars = [
      { key: 'NAMA_DESA', val: currentDesa.namaDesa },
      { key: 'KECAMATAN', val: currentDesa.namaKecamatan },
      { key: 'KABUPATEN', val: currentDesa.namaKabupaten },
      { key: 'PROVINSI', val: currentDesa.namaProvinsi },
      { key: 'JABATAN_KADES', val: currentDesa.jabatanKades },
      { key: 'NAMA_KADES', val: currentDesa.namaKades },
      { key: 'NIP_KADES', val: currentDesa.nipKades || '-' }
    ];

    desaVars.forEach(v => {
      let rawVal = v.val || '';
      text = text.replace(new RegExp(`{{${v.key}}}`, 'g'), rawVal);
      text = text.replace(new RegExp(`{{${v.key}_UPPER}}`, 'g'), helperFormatText(rawVal, 'UPPER'));
      text = text.replace(new RegExp(`{{${v.key}_TITLE}}`, 'g'), helperFormatText(rawVal, 'TITLE'));
      text = text.replace(new RegExp(`{{${v.key}_LOWER}}`, 'g'), helperFormatText(rawVal, 'LOWER'));
    });

    if (activeTemplate.formFields) {
      activeTemplate.formFields.forEach(f => {
        let val = suratState.formValues[f.id] || '';
        const varUpper = f.id.toUpperCase();
        text = text.replace(new RegExp(`{{${varUpper}}}`, 'g'), val);
        text = text.replace(new RegExp(`{{${varUpper}_UPPER}}`, 'g'), helperFormatText(val, 'UPPER'));
        text = text.replace(new RegExp(`{{${varUpper}_TITLE}}`, 'g'), helperFormatText(val, 'TITLE'));
        text = text.replace(new RegExp(`{{${varUpper}_LOWER}}`, 'g'), helperFormatText(val, 'LOWER'));
      });
    }

    ['NAMA', 'ALAMAT', 'PEKERJAAN'].forEach(varName => {
      let rawVal = searchWarga[varName.toLowerCase()] || '';
      text = text.replace(new RegExp(`{{${varName}_UPPER}}`, 'g'), helperFormatText(rawVal, 'UPPER'));
      text = text.replace(new RegExp(`{{${varName}_TITLE}}`, 'g'), helperFormatText(rawVal, 'TITLE'));
      text = text.replace(new RegExp(`{{${varName}_LOWER}}`, 'g'), helperFormatText(rawVal, 'LOWER'));
    });

    setSuratState(prev => ({ ...prev, customContent: text, step: 3 }));
  };

  const handleCetak = () => {
    const isAlreadyRegistered = riwayatSurat.some(r => r.nomorSurat === suratState.nomorSurat && r.nik === searchWarga?.nik);
    
    if (!isAlreadyRegistered) {
      const newRecord = {
        id: 'reg_' + Date.now(),
        desaId: currentDesa.id,
        nik: searchWarga?.nik,
        namaWarga: searchWarga?.nama,
        jenisSurat: activeTemplate?.nama,
        nomorSurat: suratState.nomorSurat,
        tanggal: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        operator: currentUser.nama,
        kontenSurat: suratState.customContent
      };
      saveDb({ ...db, registerSurat: [...(db.registerSurat || []), newRecord] });
    }

    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="max-w-5xl mx-auto print:max-w-full space-y-6">
      
      <div className="flex gap-2 pb-3 overflow-x-auto print:hidden">
         <button onClick={() => { setSubTab('buat'); setViewRiwayat(null); }} className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${subTab === 'buat' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}><FileDown size={16}/> Proses Buat Surat</button>
         <button onClick={() => { setSubTab('riwayat'); setViewRiwayat(null); }} className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${subTab === 'riwayat' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}><CheckSquare size={16}/> Register Surat Keluar</button>
      </div>

      {subTab === 'riwayat' && (
         <>
         {!viewRiwayat ? (
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <div>
                    <h3 className="font-bold text-slate-800 text-lg">Buku Register Surat Desa</h3>
                    <p className="text-xs text-slate-500 mt-1">Rekapitulasi riwayat pencetakan dan penerbitan surat yang dilakukan oleh operator.</p>
                 </div>
                 <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <FileText size={18}/> Total Terbit: {riwayatSurat.length} Surat
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b text-slate-700 uppercase font-bold text-xs tracking-wider">
                       <tr>
                          <th className="p-4">Tanggal & Waktu</th>
                          <th className="p-4">Nomor & Jenis Surat</th>
                          <th className="p-4">Pemohon</th>
                          <th className="p-4">Operator Bertugas</th>
                          <th className="p-4 text-center">Aksi</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {riwayatSurat.map(r => (
                          <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                             <td className="p-4">
                                <div className="font-bold text-slate-800">{r.tanggal}</div>
                                <div className="text-xs text-slate-500 font-medium">{r.waktu}</div>
                             </td>
                             <td className="p-4">
                                <div className="font-bold text-indigo-700">{r.nomorSurat}</div>
                                <div className="text-xs text-slate-600 font-medium">{r.jenisSurat}</div>
                             </td>
                             <td className="p-4">
                                <div className="font-bold text-slate-800">{r.namaWarga}</div>
                                <div className="text-xs text-slate-500 font-mono">{r.nik}</div>
                             </td>
                             <td className="p-4 text-slate-600 font-medium">
                                <span className="flex items-center gap-2"><UserCheck size={14} className="text-emerald-600"/> {r.operator}</span>
                             </td>
                             <td className="p-4 text-center">
                                <button onClick={() => setViewRiwayat(r)} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors font-bold text-xs flex items-center gap-1.5 mx-auto">
                                   <Printer size={14}/> Cetak Ulang
                                </button>
                             </td>
                          </tr>
                       ))}
                       {riwayatSurat.length === 0 && (
                          <tr><td colSpan={5} className="p-12 text-center text-slate-500 font-medium">Belum ada riwayat pembuatan surat.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
         ) : (
           <div>
              <div className="p-6 bg-slate-50 border-b rounded-t-2xl print:hidden">
                <h3 className="text-lg font-bold text-slate-800 flex justify-between items-center mb-4">
                  Pratinjau Arsip Surat
                  <button onClick={() => setViewRiwayat(null)} className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-semibold"><ArrowLeft size={16}/> Kembali ke Register</button>
                </h3>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                   <div>
                      <div className="text-sm text-indigo-900">Pemohon: <strong>{viewRiwayat.namaWarga}</strong> ({viewRiwayat.nik})</div>
                      <div className="text-xs text-indigo-700 mt-1">Diterbitkan pada {viewRiwayat.tanggal} {viewRiwayat.waktu} oleh {viewRiwayat.operator}</div>
                   </div>
                   <button onClick={() => setTimeout(() => window.print(), 300)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex justify-center items-center gap-2 shadow-sm transition-all whitespace-nowrap">
                     <Printer size={18} /> Cetak Ulang Surat
                   </button>
                </div>
              </div>

              <div className="p-8 md:p-12 print:p-0 bg-slate-200 print:bg-white flex justify-center rounded-b-2xl">
                <div className="bg-white shadow-xl print:shadow-none w-[210mm] min-h-[297mm] p-[20mm] print:p-0 relative">
                  <div 
                    className="prose prose-sm max-w-none text-black leading-relaxed font-serif" 
                    style={{fontFamily: "'Times New Roman', Times, serif", fontSize: '12pt'}}
                    dangerouslySetInnerHTML={{ __html: viewRiwayat.kontenSurat || '<div style="text-align:center; padding:50px; color:#666;">Data arsip cetak belum tersedia untuk surat lama ini.</div>' }}
                  />
                </div>
              </div>
           </div>
         )}
         </>
      )}

      {subTab === 'buat' && (
      <>
      <div className="mb-8 print:hidden">
        <div className="flex items-center justify-between relative max-w-2xl mx-auto">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2"></div>
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white ${suratState.step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-500'} transition-colors duration-300`}>
              {s}
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-2xl mx-auto mt-2 text-xs font-semibold text-slate-500 px-2">
          <span className={suratState.step >= 1 ? 'text-indigo-600' : ''}>1. Warga &amp; Template</span>
          <span className={suratState.step >= 2 ? 'text-indigo-600' : ''}>2. Format &amp; Form Inti</span>
          <span className={suratState.step >= 3 ? 'text-indigo-600' : ''}>3. Pratinjau &amp; Cetak</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none print:bg-transparent relative z-20">
        
        {suratState.step === 1 && (
          <div className="p-8 space-y-6 print:hidden">
            <h3 className="text-xl font-bold text-slate-800 border-b pb-3">Langkah 1: Identitas &amp; Jenis Surat</h3>
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Cari NIK Warga Aktif</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 text-slate-400" size={20} />
                  <input type="text" placeholder="Ketik NIK lengkap..." className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" value={suratState.nik} onChange={(e) => handleNikSearch(e.target.value)} />
                </div>
              </div>

              {searchWarga ? (
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl flex items-start gap-4">
                  <div className="bg-emerald-100 p-2.5 rounded-full text-emerald-600 shrink-0"><Check size={20} /></div>
                  <div>
                    <h4 className="font-bold text-emerald-900 text-base">{searchWarga.nama}</h4>
                    <p className="text-sm text-emerald-700 mt-0.5">NIK: {searchWarga.nik} | No. KK: {searchWarga.noKk || '-'}</p>
                    <p className="text-xs text-emerald-600 mt-1">{searchWarga.ttl} &bull; {searchWarga.alamat}</p>
                  </div>
                </div>
              ) : suratState.nik.length > 3 ? (
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">Warga dengan NIK tersebut tidak ditemukan atau status warga tidak aktif.</div>
              ) : null}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Pilih Jenis Surat</label>
                <select className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white" value={suratState.templateId} onChange={(e) => setSuratState({...suratState, templateId: e.target.value})}>
                  <option value="">-- Pilih Template Surat --</option>
                  {villageTemplates.map(t => <option key={t.id} value={t.id}>{t.nama}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Nomor Surat Resmi</label>
                <input type="text" className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" value={suratState.nomorSurat} onChange={e => setSuratState({...suratState, nomorSurat: e.target.value})} />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t mt-4">
              <button onClick={() => setSuratState(prev => ({ ...prev, step: 2 }))} disabled={!searchWarga || !suratState.templateId} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all shadow-sm">
                Lanjut ke Form Inti <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {suratState.step === 2 && (
          <div className="p-8 space-y-6 print:hidden">
            <h3 className="text-xl font-bold text-slate-800 border-b pb-3 flex justify-between items-center">
              Langkah 2: Isi Format &amp; Form Inti Surat
              <button onClick={() => setSuratState({...suratState, step: 1})} className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-semibold"><ArrowLeft size={16}/> Kembali</button>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Form Dinamis Template</h4>
                <p className="text-xs text-slate-500">Isi kolom di bawah ini sesuai dengan data spesifik permohonan surat warga.</p>
                
                {activeTemplate?.formFields && activeTemplate.formFields.length > 0 ? (
                  activeTemplate.formFields.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded w-fit">{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea rows={3} placeholder={field.placeholder || ''} className="w-full p-3 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={suratState.formValues[field.id] || ''} onChange={e => handleFormInputChange(field.id, e.target.value)} />
                      ) : (
                        <input type="text" placeholder={field.placeholder || ''} className="w-full p-3 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={suratState.formValues[field.id] || ''} onChange={e => handleFormInputChange(field.id, e.target.value)} />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500 italic py-4">Tidak ada form dinamis khusus pada template ini. Lanjutkan ke pratinjau.</div>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-2">Informasi Draf Surat</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Template ini dibuat khusus dengan format resmi desa. Data warga dan form inti yang Anda masukkan akan langsung terintegrasi secara otomatis saat draf digenerate.</p>
                  
                  <div className="mt-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
                    <div className="text-xs text-slate-600"><strong>Pemohon:</strong> {searchWarga?.nama}</div>
                    <div className="text-xs text-slate-600"><strong>NIK:</strong> {searchWarga?.nik}</div>
                    <div className="text-xs text-slate-600"><strong>Nomor Surat:</strong> {suratState.nomorSurat}</div>
                  </div>
                </div>

                <div className="pt-6 border-t mt-6">
                  <button onClick={generateDraft} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow transition-all">
                    Generate Draf &amp; Pratinjau <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {suratState.step === 3 && (
          <div>
            <div className="p-6 bg-slate-50 border-b print:hidden">
              <h3 className="text-lg font-bold text-slate-800 flex justify-between items-center mb-4">
                Langkah 3: Pratinjau &amp; Cetak Resmi
                <button onClick={() => setSuratState({...suratState, step: 2})} className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-semibold"><ArrowLeft size={16}/> Kembali Edit Form</button>
              </h3>

              <label className="flex items-start gap-3 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-xl cursor-pointer group">
                <div className="pt-0.5">
                  <input type="checkbox" className="w-5 h-5 cursor-pointer accent-amber-600" checked={suratState.isVerified} onChange={(e) => setSuratState({...suratState, isVerified: e.target.checked})} />
                </div>
                <div>
                  <span className="font-bold text-amber-900 group-hover:text-amber-700">Saya menyatakan bahwa surat di bawah ini sudah sesuai dan siap dicetak.</span>
                  <p className="text-xs text-amber-700 mt-0.5">Tombol cetak hanya akan aktif setelah Anda mencentang kotak konfirmasi ini. Surat akan otomatis masuk ke Register Surat saat dicetak.</p>
                </div>
              </label>

              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setSuratState({step: 1, nik: '', templateId: '', nomorSurat: '474/' + Math.floor(100 + Math.random() * 900) + '/Desa/' + new Date().getFullYear(), formValues: {}, customContent: '', isVerified: false})} className="px-6 py-2.5 border rounded-xl text-slate-700 hover:bg-slate-100 font-bold text-sm transition-all">Buat Surat Baru</button>
                <button onClick={handleCetak} disabled={!suratState.isVerified} className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm ${suratState.isVerified ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}>
                  <Printer size={18} /> Cetak / Ekspor PDF
                </button>
              </div>
            </div>

            <div className="p-8 md:p-12 print:p-0 bg-slate-200 print:bg-white flex justify-center">
              <div className="bg-white shadow-xl print:shadow-none w-[210mm] min-h-[297mm] p-[20mm] print:p-0 relative">
                <div 
                  className="prose prose-sm max-w-none text-black leading-relaxed font-serif" 
                  style={{fontFamily: "'Times New Roman', Times, serif", fontSize: '12pt'}}
                  dangerouslySetInnerHTML={{ __html: suratState.customContent }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}

function PendudukView({ db, saveDb, currentDesa, isLockedForOperator, currentUser, showDialog }) {
  const [subTab, setSubTab] = useState('data'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(null);

  const villagePenduduk = db.penduduk.filter(p => p.desaId === currentDesa.id);
  const wargaAktif = villagePenduduk.filter(p => !p.statusMutasi || p.statusMutasi === 'Aktif');
  const wargaMutasi = villagePenduduk.filter(p => p.statusMutasi && p.statusMutasi !== 'Aktif');
  
  const tableDataToFilter = subTab === 'mutasi' ? wargaMutasi : wargaAktif;
  const filtered = tableDataToFilter.filter(p => p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || p.nik.includes(searchQuery) || (p.noKk && p.noKk.includes(searchQuery)));

  const kkGroups = {};
  villagePenduduk.forEach(p => {
    if (!p.noKk) return;
    if (!kkGroups[p.noKk]) kkGroups[p.noKk] = [];
    kkGroups[p.noKk].push(p);
  });

  const openModal = (data = null) => {
    setFormData(data || { noKk: '', nik: '', nama: '', ttl: '', jk: 'Laki-laki', agama: '', pekerjaan: '', alamat: '', shdk: 'Kepala Keluarga', statusMutasi: 'Aktif', tanggalMutasi: '', keteranganMutasi: '' });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    let updatedPenduduk = [...db.penduduk];
    if (formData.id) {
      updatedPenduduk = updatedPenduduk.map(p => p.id === formData.id ? { ...formData, desaId: currentDesa.id } : p);
    } else {
      updatedPenduduk.push({ ...formData, id: Date.now(), desaId: currentDesa.id });
    }
    saveDb({ ...db, penduduk: updatedPenduduk });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (isLockedForOperator) return;
    showDialog({
       type: 'confirm',
       title: 'Hapus Data Warga',
       message: 'Yakin ingin menghapus data warga ini secara permanen?',
       onConfirm: () => {
         const updatedPenduduk = db.penduduk.filter(p => p.id !== id);
         saveDb({ ...db, penduduk: updatedPenduduk });
       }
    });
  };

  const handleExportExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `No. KK,NIK,Nama,L/P,TTL,Agama,Pekerjaan,Alamat,Status Keluarga,Status Penduduk\n`;
    filtered.forEach(p => {
      let row = `"${p.noKk || '-'}","${p.nik}","${p.nama}","${p.jk}","${p.ttl}","${p.agama}","${p.pekerjaan}","${p.alamat}","${p.shdk || '-'}","${p.statusMutasi || 'Aktif'}"`;
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Penduduk_${currentDesa.namaDesa}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDownloadTemplate = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `No. KK,NIK,Nama,L/P,TTL,Agama,Pekerjaan,Alamat,Status Keluarga,Status Penduduk\n`;
    csvContent += `"3201010101010001","3201010101900001","Budi Contoh","Laki-laki","Jakarta 01-01-1990","Islam","Wiraswasta","Jl. Merdeka No 1","Kepala Keluarga","Aktif"\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Template_Import_Penduduk.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const newPenduduk = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const row = lines[i].split(',').map(v => v.replace(/^"|"$/g, '').trim());
        if (row.length >= 8) {
           newPenduduk.push({
             id: Date.now() + i,
             desaId: currentDesa.id,
             noKk: row[0] || '', nik: row[1] || '', nama: row[2] || '', jk: row[3] === 'L' || row[3] === 'Laki-laki' ? 'Laki-laki' : 'Perempuan',
             ttl: row[4] || '', agama: row[5] || '', pekerjaan: row[6] || '', alamat: row[7] || '',
             shdk: row[8] || 'Lainnya', statusMutasi: row[9] || 'Aktif'
           });
        }
      }
      if (newPenduduk.length > 0) {
         saveDb({ ...db, penduduk: [...db.penduduk, ...newPenduduk] });
         showDialog({ type: 'alert', title: 'Impor Sukses', message: `Berhasil mengimpor ${newPenduduk.length} data warga dari file CSV!` });
      } else {
         showDialog({ type: 'alert', title: 'Impor Gagal', message: 'Gagal mengimpor. Pastikan format CSV sesuai template (10 kolom utama).', isError: true });
      }
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 pb-3 overflow-x-auto print:hidden">
         <button onClick={() => setSubTab('rekapan')} className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${subTab === 'rekapan' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}><PieChart size={16}/> Rekapan & Dasbor</button>
         <button onClick={() => setSubTab('data')} className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${subTab === 'data' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}><Users size={16}/> Tabel Data Warga</button>
         <button onClick={() => setSubTab('kk')} className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${subTab === 'kk' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}><Layers size={16}/> Arsip Kartu Keluarga</button>
         <button onClick={() => setSubTab('mutasi')} className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${subTab === 'mutasi' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}><Activity size={16}/> Log Mutasi</button>
      </div>

      {subTab === 'rekapan' && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Warga Aktif</div>
               <div className="text-4xl font-extrabold text-slate-800">{wargaAktif.length}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Kepala Keluarga</div>
               <div className="text-4xl font-extrabold text-slate-800">{Object.keys(kkGroups).length}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Laki-laki / Perempuan</div>
               <div className="text-3xl font-extrabold text-slate-800">
                 <span className="text-indigo-600">{wargaAktif.filter(w=>w.jk === 'Laki-laki').length}</span>
                 <span className="text-slate-300 mx-2">/</span>
                 <span className="text-rose-500">{wargaAktif.filter(w=>w.jk === 'Perempuan').length}</span>
               </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Warga Mutasi (Mati/Pindah)</div>
               <div className="text-4xl font-extrabold text-red-600">{wargaMutasi.length}</div>
            </div>
         </div>
      )}

      {(subTab === 'data' || subTab === 'mutasi') && (
      <>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
            <input type="text" placeholder={`Cari NIK / No. KK / Nama (${subTab === 'mutasi' ? 'Log Mutasi' : 'Warga'})...`} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-indigo-500 outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          
          <div className="flex gap-2 flex-wrap w-full md:w-auto">
            {(!isLockedForOperator || currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && subTab === 'data' && (
              <>
                <button onClick={handleDownloadTemplate} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all" title="Unduh Format CSV Warga">
                  <Download size={16} /> Template CSV
                </button>
                <label className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer">
                  <Upload size={16} /> Import CSV
                  <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
                </label>
                <button onClick={handleExportExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all">
                  <TableIcon size={16} /> Excel
                </button>
              </>
            )}

            {!isLockedForOperator ? (
              <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all">
                <Plus size={16} /> Tambah Warga
              </button>
            ) : (
              <div className="bg-amber-50 text-amber-800 text-xs px-3 py-2 rounded-xl font-bold border border-amber-200 flex items-center gap-1.5">
                <Lock size={14} /> Data Penduduk Dikunci
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b text-slate-700 uppercase font-bold text-xs tracking-wider">
              <tr>
                <th className="p-4">No. KK / NIK</th>
                <th className="p-4">Nama Lengkap</th>
                <th className="p-4">Status / SHDK</th>
                <th className="p-4">L/P</th>
                <th className="p-4">Pekerjaan</th>
                {subTab === 'mutasi' && <th className="p-4">Keterangan Mutasi</th>}
                {!isLockedForOperator && <th className="p-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-medium text-slate-800">
                    <div className="font-bold text-slate-900">{p.nik}</div>
                    <div className="text-xs text-slate-500 font-normal">KK: {p.noKk || '-'}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{p.nama}</td>
                  <td className="p-4">
                     <div className={`text-xs font-bold px-2 py-1 inline-block rounded mb-1 ${p.statusMutasi === 'Meninggal' ? 'bg-slate-800 text-white' : p.statusMutasi === 'Pindah Keluar' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {p.statusMutasi || 'Aktif'}
                     </div>
                     <div className="text-xs text-slate-500 font-semibold">{p.shdk || '-'}</div>
                  </td>
                  <td className="p-4 text-slate-600">{p.jk === 'Laki-laki' ? 'L' : 'P'}</td>
                  <td className="p-4 text-slate-600">{p.pekerjaan}</td>
                  {subTab === 'mutasi' && <td className="p-4 text-slate-600 text-xs">{p.tanggalMutasi}<br/>{p.keteranganMutasi}</td>}
                  {!isLockedForOperator && (
                    <td className="p-4 flex justify-center gap-2">
                      <button onClick={() => openModal(p)} className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg transition-colors" title="Edit Data"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors" title="Hapus Permanen"><Trash size={16} /></button>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="p-12 text-center text-slate-500 font-medium">Tidak ada data ditemukan di kategori ini.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </>
      )}

      {subTab === 'kk' && (
         <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-sm text-indigo-900 mb-6">
               Menampilkan warga yang dikelompokkan berdasarkan <strong>Nomor Kartu Keluarga (KK)</strong> yang sama.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(kkGroups).map(kk => {
               const members = kkGroups[kk];
               const head = members.find(m => (m.shdk || '').toLowerCase() === 'kepala keluarga') || members[0];
               return (
                  <div key={kk} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative">
                     <div className="text-xs font-bold text-slate-500 mb-1 tracking-wider uppercase">Nomor KK</div>
                     <div className="text-xl font-bold font-mono text-slate-800">{kk}</div>
                     <div className="text-sm mt-2 text-slate-600"><strong>Kepala Keluarga:</strong> {head?.nama}</div>
                     <div className="text-sm text-slate-600 mb-4"><strong>Alamat:</strong> {head?.alamat}</div>
                     
                     <div className="border-t pt-4 mt-2">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Anggota Keluarga ({members.length})</div>
                        <div className="space-y-2">
                           {members.map(m => (
                              <div key={m.id} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded">
                                 <div>
                                    <div className="font-semibold text-slate-800">{m.nama}</div>
                                    <div className="text-xs text-slate-500">{m.nik}</div>
                                 </div>
                                 <div className={`text-xs px-2 py-1 rounded font-bold ${m.statusMutasi !== 'Aktif' && m.statusMutasi ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'}`}>{m.statusMutasi && m.statusMutasi !== 'Aktif' ? m.statusMutasi : m.shdk || 'Anggota'}</div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )
            })}
            </div>
         </div>
      )}

      <Modal isOpen={showModal} title={formData?.id ? "Edit Data Warga" : "Tambah Warga Baru"} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-slate-50 p-4 border rounded-xl space-y-4">
             <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide border-b pb-2">Status Administrasi Dasar</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1 w-fit">Status Hub. Keluarga (SHDK)</label>
                  <select className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white" value={formData?.shdk || 'Lainnya'} onChange={e => setFormData({...formData, shdk: e.target.value})}>
                    <option value="Kepala Keluarga">Kepala Keluarga</option>
                    <option value="Istri">Istri</option>
                    <option value="Anak">Anak</option>
                    <option value="Menantu">Menantu</option>
                    <option value="Cucu">Cucu</option>
                    <option value="Orang Tua">Orang Tua</option>
                    <option value="Mertua">Mertua</option>
                    <option value="Famili Lain">Famili Lain</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1 w-fit">Status Mutasi Kependudukan</label>
                  <select className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white font-bold" value={formData?.statusMutasi || 'Aktif'} onChange={e => setFormData({...formData, statusMutasi: e.target.value})}>
                    <option value="Aktif">Hidup / Aktif di Desa</option>
                    <option value="Meninggal">Meninggal Dunia</option>
                    <option value="Pindah Keluar">Pindah Keluar (Mutasi)</option>
                  </select>
                </div>
                {(formData?.statusMutasi === 'Meninggal' || formData?.statusMutasi === 'Pindah Keluar') && (
                  <>
                     <div>
                       <label className="block text-xs font-bold uppercase tracking-wider text-red-900 bg-red-100 px-2.5 py-1 rounded mb-1 w-fit">Tanggal Kejadian / Mutasi</label>
                       <input type="date" required className="w-full p-3 border border-slate-300 rounded-xl outline-none text-sm" value={formData?.tanggalMutasi || ''} onChange={e => setFormData({...formData, tanggalMutasi: e.target.value})} />
                     </div>
                     <div>
                       <label className="block text-xs font-bold uppercase tracking-wider text-red-900 bg-red-100 px-2.5 py-1 rounded mb-1 w-fit">Keterangan / Tujuan Pindah</label>
                       <input type="text" required className="w-full p-3 border border-slate-300 rounded-xl outline-none text-sm" value={formData?.keteranganMutasi || ''} onChange={e => setFormData({...formData, keteranganMutasi: e.target.value})} placeholder="Tempat pindah / ket. meninggal..." />
                     </div>
                  </>
                )}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Nomor Kartu Keluarga (KK)</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono" value={formData?.noKk || ''} onChange={e => setFormData({...formData, noKk: e.target.value})} placeholder="16 digit No KK..." />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">NIK Warga</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono" value={formData?.nik || ''} onChange={e => setFormData({...formData, nik: e.target.value})} placeholder="16 digit NIK..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Nama Lengkap Warga</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" value={formData?.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})} placeholder="Nama Sesuai KTP..." />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Tempat, Tanggal Lahir</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={formData?.ttl || ''} onChange={e => setFormData({...formData, ttl: e.target.value})} placeholder="Misal: Jakarta, 01-01-1990" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Jenis Kelamin</label>
              <select className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white" value={formData?.jk || 'Laki-laki'} onChange={e => setFormData({...formData, jk: e.target.value})}>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Agama</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={formData?.agama || ''} onChange={e => setFormData({...formData, agama: e.target.value})} placeholder="Agama..." />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Pekerjaan</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={formData?.pekerjaan || ''} onChange={e => setFormData({...formData, pekerjaan: e.target.value})} placeholder="Pekerjaan..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Alamat Lengkap</label>
              <textarea required rows={2} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={formData?.alamat || ''} onChange={e => setFormData({...formData, alamat: e.target.value})} placeholder="Jalan, RT/RW, Dusun..." />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t mt-4">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all"><Save size={18}/> Simpan Data Warga</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function TemplateView({ db, saveDb, currentDesa, showDialog }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');

  const villageTemplates = db.templates.filter(t => t.desaId === currentDesa.id);

  const openModal = (data = null) => {
    setFormData(data ? JSON.parse(JSON.stringify(data)) : { nama: '', formFields: [], konten: '<p>Ketik draf surat di sini...</p>' });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    let updatedTemplates = [...db.templates];
    if (formData.id) {
      updatedTemplates = updatedTemplates.map(t => t.id === formData.id ? { ...formData, desaId: currentDesa.id } : t);
    } else {
      updatedTemplates.push({ ...formData, id: 't_' + Date.now(), desaId: currentDesa.id });
    }
    saveDb({ ...db, templates: updatedTemplates });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    showDialog({
       type: 'confirm',
       title: 'Hapus Template',
       message: 'Yakin ingin menghapus template ini secara permanen?',
       onConfirm: () => saveDb({ ...db, templates: db.templates.filter(t => t.id !== id) })
    });
  };

  const addField = () => {
    if (!newFieldLabel.trim()) return;
    const fieldId = newFieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
    setFormData(prev => ({
      ...prev,
      formFields: [...(prev.formFields || []), { id: fieldId, label: newFieldLabel, type: newFieldType }]
    }));
    setNewFieldLabel('');
  };

  const removeField = (id) => {
    setFormData(prev => ({
      ...prev,
      formFields: prev.formFields.filter(f => f.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Manajemen Template Surat</h3>
          <p className="text-xs text-slate-500">Buat atau edit format cetak surat resmi untuk layanan desa.</p>
        </div>
        <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all"><Plus size={16} /> Buat Template Baru</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {villageTemplates.map(t => (
          <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col group hover:border-indigo-300 transition-colors">
            <div className="flex items-start gap-4 mb-6 flex-grow">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform"><FileText size={24} /></div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">{t.nama}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">Template ini dilengkapi dengan {t.formFields?.length || 0} form input khusus. Edit untuk menyesuaikan struktur.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t mt-auto">
              <button onClick={() => openModal(t)} className="flex-1 py-2 bg-slate-50 text-slate-700 border hover:bg-slate-100 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-all"><Edit size={16}/> Edit Template</button>
              <button onClick={() => handleDelete(t.id)} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl flex justify-center items-center transition-all"><Trash size={16}/></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} title={formData?.id ? "Edit Template Surat" : "Buat Template Surat"} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Nama / Jenis Surat</label>
            <input required placeholder="Contoh: Surat Pengantar KTP" className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" value={formData?.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})} />
          </div>
          
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Builder Form Input (Untuk Langkah 2)</h4>
              <p className="text-xs text-slate-500 mt-0.5">Tambahkan field spesifik yang harus diisi Operator saat membuat surat ini.</p>
            </div>
            
            <div className="flex gap-2">
              <input type="text" placeholder="Nama Label (Contoh: Nama Anak)" className="flex-grow p-2.5 border border-slate-300 rounded-xl outline-none text-sm" value={newFieldLabel} onChange={e => setNewFieldLabel(e.target.value)} />
              <select className="w-32 p-2.5 border border-slate-300 rounded-xl outline-none text-sm bg-white" value={newFieldType} onChange={e => setNewFieldType(e.target.value)}>
                <option value="text">Teks Singkat</option>
                <option value="textarea">Teks Panjang</option>
              </select>
              <button type="button" onClick={addField} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-sm">Tambah</button>
            </div>

            {formData?.formFields?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                {formData.formFields.map(f => (
                  <div key={f.id} className="flex justify-between items-center p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div>
                      <span className="font-bold text-sm text-slate-700">{f.label}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded ml-2 uppercase">{f.type}</span>
                      <div className="text-[10px] font-mono text-indigo-600 mt-0.5">Kode: {`{{${f.id.toUpperCase()}}}`}</div>
                    </div>
                    <button type="button" onClick={() => removeField(f.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash size={16}/></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-[450px] flex flex-col">
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Desain / Konten Format Surat</label>
            <div className="flex-grow">
              <RichTextEditor 
                value={formData?.konten || ''} 
                onChange={val => setFormData({...formData, konten: val})}
                customFields={formData?.formFields || []}
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t mt-4">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all"><Save size={18}/> Simpan Template</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function OperatorView({ db, saveDb, currentDesa, showDialog }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(null);

  const villageOperators = db.users.filter(u => u.desaId === currentDesa.id && (u.role === 'operator' || u.role === 'kiosk'));

  const openModal = (data = null) => {
    setFormData(data || { username: '', password: '', nama: '', role: 'operator', canTakeAntrian: true });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    let updatedUsers = [...db.users];
    if (formData.id) {
      updatedUsers = updatedUsers.map(u => u.id === formData.id ? { ...formData, desaId: currentDesa.id } : u);
    } else {
      if (updatedUsers.some(u => u.username === formData.username)) {
        showDialog({ type: 'alert', title: 'Username Digunakan', message: 'Username sudah dipakai, gunakan yang lain.', isError: true });
        return;
      }
      updatedUsers.push({ ...formData, id: 'u_opr_' + Date.now(), desaId: currentDesa.id });
    }
    saveDb({ ...db, users: updatedUsers });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    showDialog({
       type: 'confirm',
       title: 'Hapus Akun',
       message: 'Yakin ingin menghapus akun ini secara permanen?',
       onConfirm: () => saveDb({ ...db, users: db.users.filter(u => u.id !== id) })
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Manajemen Akun Operator & Kiosk</h3>
          <p className="text-xs text-slate-500">Kelola staf pelayanan dan layar Anjungan Mandiri di desa ini.</p>
        </div>
        <button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all"><Plus size={16} /> Tambah Akun</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b text-slate-700 uppercase font-bold text-xs tracking-wider">
            <tr>
              <th className="p-4">Nama Lengkap / Alat</th>
              <th className="p-4">Tipe Akun (Role)</th>
              <th className="p-4">Loket</th>
              <th className="p-4">Akses Spesifik</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {villageOperators.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${u.role === 'kiosk' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-600'}`}>
                    {u.role === 'kiosk' ? <MonitorPlay size={16}/> : <UserCheck size={16}/>}
                  </div> 
                  <div>
                    {u.nama}
                    <div className="text-[10px] font-mono font-normal text-slate-500 leading-tight">user: {u.username}</div>
                  </div>
                </td>
                <td className="p-4">
                   {u.role === 'kiosk' ? <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold uppercase">Anjungan Kiosk</span> : <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-bold uppercase">Operator</span>}
                </td>
                <td className="p-4 text-slate-600 font-bold">{u.nomorLoket ? `Loket ${u.nomorLoket}` : '-'}</td>
                <td className="p-4">
                   {u.role === 'operator' && (
                     u.canTakeAntrian ? <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">Bisa Ambil Antrian Manual</span> : <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">Hanya Memanggil</span>
                   )}
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => openModal(u)} className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg transition-colors" title="Edit"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(u.id)} className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors" title="Hapus"><Trash size={16} /></button>
                </td>
              </tr>
            ))}
            {villageOperators.length === 0 && (
              <tr><td colSpan="5" className="p-12 text-center text-slate-500 font-medium">Belum ada akun operator/kiosk yang dibuat.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} title={formData?.id ? "Edit Akun" : "Tambah Akun Baru"} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          
          <div className="mb-4">
             <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1 w-fit">Tipe Akun (Role)</label>
             <select className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white font-bold" value={formData?.role || 'operator'} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="operator">Operator Loket (Bisa Buat Surat & Panggil Antrian)</option>
                <option value="kiosk">Anjungan Kiosk (Khusus Layar Cetak Tiket Depan)</option>
             </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Nama Lengkap / Penempatan</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={formData?.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})} placeholder={formData?.role === 'kiosk' ? "Misal: Kiosk Pintu Utama" : "Nama Pegawai..."} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Nomor Loket</label>
              <input className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={formData?.nomorLoket || ''} onChange={e => setFormData({...formData, nomorLoket: e.target.value})} placeholder="Misal: 1, 2, A..." disabled={formData?.role === 'kiosk'}/>
            </div>
          </div>
          
          {formData?.role === 'operator' && (
             <label className="flex items-center gap-3 p-4 border border-indigo-100 bg-indigo-50/50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors mt-2">
               <input type="checkbox" className="w-5 h-5 accent-indigo-600" checked={formData?.canTakeAntrian ?? true} onChange={e => setFormData({...formData, canTakeAntrian: e.target.checked})} />
               <div>
                  <div className="text-sm font-bold text-indigo-900">Izinkan Operator mengambil nomor antrian (Manual)</div>
                  <div className="text-xs text-indigo-700 mt-0.5">Jika dicentang, operator ini akan memunculkan tombol "Ambil Antrian Manual" di menunya.</div>
               </div>
             </label>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Username</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono" value={formData?.username || ''} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="username_unik" disabled={!!formData?.id} />
              {!!formData?.id && <p className="text-[10px] text-slate-500 mt-1">Username tidak dapat diubah setelah dibuat.</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Password</label>
              <input required type="password" className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={formData?.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Minimal 6 karakter" />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t mt-4">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all"><Save size={18}/> Simpan Akun</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function PengaturanDesaView({ db, saveDb, currentDesa, currentUser, showDialog }) {
  const [formData, setFormData] = useState({ ...currentDesa, isPendudukLocked: currentDesa.isPendudukLocked || false, isAntrianEnabled: currentDesa.isAntrianEnabled || false, kioskTextColor: currentDesa.kioskTextColor || '' });
  const [adminCreds, setAdminCreds] = useState({ username: currentUser.username, password: currentUser.password });
  const [successMsg, setSuccessMsg] = useState('');
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      let availableVoices = window.speechSynthesis.getVoices();
      let idVoices = availableVoices.filter(v => v.lang.includes('id') || v.lang.includes('ID'));
      if(idVoices.length === 0) idVoices = availableVoices.slice(0, 10);
      setVoices(idVoices);
    };
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoDesa: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTtdUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, ttdKades: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    if (adminCreds.username !== currentUser.username) {
      const conflict = db.users.some(u => u.username === adminCreds.username);
      if (conflict) {
        showDialog({ type: 'alert', title: 'Username Error', message: 'Username sudah digunakan oleh akun lain! Gunakan yang lain.', isError: true });
        return;
      }
    }

    const updatedDesas = db.desas.map(d => d.id === currentDesa.id ? formData : d);
    const updatedUsers = db.users.map(u => u.id === currentUser.id ? { ...u, username: adminCreds.username, password: adminCreds.password } : u);
    
    saveDb({ ...db, desas: updatedDesas, users: updatedUsers });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSuccessMsg('Semua perubahan Pengaturan Desa telah berhasil diterapkan!');
    setTimeout(() => setSuccessMsg(''), 4000); 
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl relative">
      
      {successMsg && (
         <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-xl flex items-center gap-3 font-bold shadow-sm animate-pulse">
            <Check size={24} className="shrink-0"/> {successMsg}
         </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Key size={20} className="text-amber-600"/> Keamanan Akun Admin Utama</h3>
          <p className="text-xs text-slate-500 mt-1">Ubah akses login Anda. <strong className="text-amber-600">Perhatian:</strong> Perubahan akses pada akun ini akan tetap terpantau dan dapat diatur ulang oleh Superadmin Pusat.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Username Admin</label>
            <input required className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono" value={adminCreds.username} onChange={e => setAdminCreds({...adminCreds, username: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Password Admin</label>
            <input required className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={adminCreds.password} onChange={e => setAdminCreds({...adminCreds, password: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-xs font-bold px-4 py-1.5 rounded-bl-xl border-b border-l border-amber-200 flex items-center gap-1"><Lock size={12}/> SaaS Protected</div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Identitas Wilayah Desa</h3>
          <p className="text-xs text-slate-500 mt-1">Identitas ini dikunci oleh sistem pusat. Hubungi Superadmin jika ada perubahan nama wilayah.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-70 cursor-not-allowed">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded mb-1.5 w-fit">Nama Desa</label>
            <input readOnly className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-sm font-bold text-slate-700" value={formData.namaDesa} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded mb-1.5 w-fit">Kecamatan</label>
            <input readOnly className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-sm font-bold text-slate-700" value={formData.namaKecamatan} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded mb-1.5 w-fit">Kabupaten</label>
            <input readOnly className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-sm font-bold text-slate-700" value={formData.namaKabupaten} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded mb-1.5 w-fit">Provinsi</label>
            <input readOnly className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-sm font-bold text-slate-700" value={formData.namaProvinsi} />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Kustomisasi Surat & Pejabat</h3>
          <p className="text-xs text-slate-500 mt-1">Data ini akan digunakan untuk Kop Surat dan Kolom Tanda Tangan secara otomatis.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Jabatan Pimpinan</label>
            <select className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white" value={formData.jabatanKades} onChange={e => setFormData({...formData, jabatanKades: e.target.value})}>
              <option value="Kepala Desa">Kepala Desa</option>
              <option value="Pj. Kepala Desa">Pj. Kepala Desa</option>
              <option value="Plt. Kepala Desa">Plt. Kepala Desa</option>
              <option value="Plh. Kepala Desa">Plh. Kepala Desa</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Nama Pimpinan / Kades</label>
            <input required className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" value={formData.namaKades || ''} onChange={e => setFormData({...formData, namaKades: e.target.value})} placeholder="Nama lengkap beserta gelar..." />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">NIP Kepala Desa (Nomor Induk Pegawai)</label>
            <input className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" value={formData.nipKades || ''} onChange={e => setFormData({...formData, nipKades: e.target.value})} placeholder="Kosongkan jika bukan PNS (Contoh: 19800101 201001 1 001)..." />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Upload Logo Kop Surat Desa</label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
            {formData.logoDesa && <img src={formData.logoDesa} alt="Logo" className="mt-3 h-20 object-contain p-2 border rounded-lg bg-slate-50" />}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Upload Tanda Tangan Kades (Opsional)</label>
            <input type="file" accept="image/*" onChange={handleTtdUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
            {formData.ttdKades && <img src={formData.ttdKades} alt="TTD" className="mt-3 h-16 object-contain p-2 border rounded-lg bg-slate-50" />}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Kontrol Fitur & Keamanan</h3>
          <p className="text-xs text-slate-500 mt-1">Nyalakan/matikan fitur spesifik untuk operasional pelayanan desa.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-colors ${formData.isPendudukLocked ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={formData.isPendudukLocked} onChange={e => setFormData({...formData, isPendudukLocked: e.target.checked})} />
              <div className={`block w-12 h-7 rounded-full transition-colors ${formData.isPendudukLocked ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${formData.isPendudukLocked ? 'transform translate-x-5' : ''}`}></div>
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800 flex items-center gap-2">Kunci Master Data Penduduk {formData.isPendudukLocked && <Lock size={14} className="text-amber-600"/>}</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">Jika aktif, Operator TIDAK BISA menambah/menghapus/mengedit data warga. (Disarankan aktif untuk keamanan)</div>
            </div>
          </label>
          
          <label className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-colors ${formData.isAntrianEnabled ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={formData.isAntrianEnabled} onChange={e => setFormData({...formData, isAntrianEnabled: e.target.checked})} />
              <div className={`block w-12 h-7 rounded-full transition-colors ${formData.isAntrianEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${formData.isAntrianEnabled ? 'transform translate-x-5' : ''}`}></div>
            </div>
            <div>
              <div className="font-bold text-sm text-slate-800 flex items-center gap-2">Sistem Nomor Antrian Loket {formData.isAntrianEnabled && <Volume2 size={14} className="text-emerald-600"/>}</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">Aktifkan menu antrian warga. Terdapat fitur pencetak tiket dan pemanggil otomatis berbasis suara.</div>
            </div>
          </label>
        </div>

        {formData.isAntrianEnabled && (
           <div className="pt-4 border-t border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-2 w-fit">Karakter Suara Panggilan Antrean</label>
              <select className="w-full md:w-1/2 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white" value={formData.voiceURI || ''} onChange={e => setFormData({...formData, voiceURI: e.target.value})}>
                 <option value="">-- Suara Bawaan (Default Browser) --</option>
                 {voices.map((v, i) => (
                    <option key={i} value={v.voiceURI}>{v.name} ({v.lang})</option>
                 ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-tight">*Jenis suara bergantung pada mesin sistem operasi/browser yang digunakan pada komputer Operator ini.</p>
           </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Tampilan & Pengumuman Kiosk (Anjungan)</h3>
          <p className="text-xs text-slate-500 mt-1">Ubah judul, tema warna, tata letak, dan teks berjalan (running text) untuk pengumuman pada layar Kiosk Mandiri.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
           <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Judul Utama Layar (Title)</label>
              <input className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" value={formData.kioskTitle || ''} onChange={e => setFormData({...formData, kioskTitle: e.target.value})} placeholder="Contoh: Selamat Datang" />
           </div>
           <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Sub-Judul Instruksi (Subtitle)</label>
              <input className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={formData.kioskSubtitle || ''} onChange={e => setFormData({...formData, kioskSubtitle: e.target.value})} placeholder="Contoh: Silakan ambil nomor antrean..." />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Tema Warna Kiosk</label>
            <select className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white" value={formData.kioskTheme || 'indigo'} onChange={e => setFormData({...formData, kioskTheme: e.target.value})}>
              <option value="indigo">Indigo (Biru Keunguan - Default)</option>
              <option value="emerald">Emerald (Hijau Zamrud)</option>
              <option value="sky">Sky (Biru Terang)</option>
              <option value="rose">Rose (Merah Muda / Mawar)</option>
              <option value="amber">Amber (Kuning Keemasan)</option>
              <option value="white">Putih (Tema Terang / Siang Hari)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Warna Teks Kiosk (Opsional)</label>
            <div className="flex items-center gap-3">
               <input type="color" className="w-12 h-12 p-1 border border-slate-300 rounded-xl cursor-pointer bg-white" value={formData.kioskTextColor || '#ffffff'} onChange={e => setFormData({...formData, kioskTextColor: e.target.value})} />
               <div className="text-[10px] text-slate-500 leading-tight flex-1">
                 Gunakan ini jika warna teks bawaan kurang terlihat kontras dengan tema. 
                 <button type="button" onClick={() => setFormData({...formData, kioskTextColor: ''})} className="text-indigo-600 font-bold hover:underline block mt-0.5">Reset ke Bawaan Tema</button>
               </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Tata Letak (Layout)</label>
            <select className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white" value={formData.kioskLayout || 'center'} onChange={e => setFormData({...formData, kioskLayout: e.target.value})}>
              <option value="center">Tengah (Memusat & Elegan)</option>
              <option value="split">Terbagi Kiri (Pemisahan Informasi Lengkap)</option>
              <option value="split-reverse">Terbagi Kanan (Loket di Kiri)</option>
              <option value="grid">Grid (Teks & Tiket di Atas, Loket di Bawah)</option>
              <option value="minimalist">Minimalis (Fokus Angka Antrean, Tanpa Subjudul)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Teks Berjalan (Running Text)</label>
            <textarea rows={2} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={formData.kioskRunningText || ''} onChange={e => setFormData({...formData, kioskRunningText: e.target.value})} placeholder="Masukkan pengumuman desa untuk warga..."></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
         <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center gap-3"><Save size={20}/> Simpan Seluruh Pengaturan</button>
      </div>
    </form>
  );
}

function SuperDesasView({ db, saveDb, showDialog }) {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: '', namaDesa: '', namaKecamatan: '', namaKabupaten: '', namaProvinsi: '', adminUser: '', adminPass: '', isActive: true, adminId: ''
  });

  const openAddModal = () => {
    setEditMode(false);
    setFormData({ id: '', namaDesa: '', namaKecamatan: '', namaKabupaten: '', namaProvinsi: '', adminUser: '', adminPass: '', isActive: true, adminId: '' });
    setShowModal(true);
  };

  const openEditModal = (desa) => {
    const admin = db.users.find(u => u.desaId === desa.id && u.role === 'admin');
    setEditMode(true);
    setFormData({
      id: desa.id,
      namaDesa: desa.namaDesa,
      namaKecamatan: desa.namaKecamatan,
      namaKabupaten: desa.namaKabupaten,
      namaProvinsi: desa.namaProvinsi,
      adminUser: admin ? admin.username : '',
      adminPass: admin ? admin.password : '',
      isActive: desa.isActive !== false, 
      adminId: admin ? admin.id : ''
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (editMode) {
      const conflict = db.users.find(u => u.username === formData.adminUser && u.id !== formData.adminId);
      if (conflict) { 
        showDialog({ type: 'alert', title: 'Username Digunakan', message: 'Username Admin sudah terpakai oleh akun lain!', isError: true }); 
        return; 
      }

      const updatedDesas = db.desas.map(d => d.id === formData.id ? { 
        ...d, namaDesa: formData.namaDesa, namaKecamatan: formData.namaKecamatan, namaKabupaten: formData.namaKabupaten, namaProvinsi: formData.namaProvinsi, isActive: formData.isActive 
      } : d);
      
      const updatedUsers = db.users.map(u => u.id === formData.adminId ? { 
        ...u, username: formData.adminUser, password: formData.adminPass 
      } : u);

      saveDb({ ...db, desas: updatedDesas, users: updatedUsers });
    } else {
      const newDesaId = 'desa_' + Date.now();
      const newDesa = {
        id: newDesaId, namaDesa: formData.namaDesa, namaKecamatan: formData.namaKecamatan, namaKabupaten: formData.namaKabupaten, namaProvinsi: formData.namaProvinsi,
        jabatanKades: 'Kepala Desa', namaKades: '', isPendudukLocked: false, isAntrianEnabled: false, isActive: true, features: ['surat', 'penduduk', 'template', 'operator', 'pengaturan']
      };
      const newAdmin = {
        id: 'u_adm_' + Date.now(), username: formData.adminUser, password: formData.adminPass, role: 'admin', desaId: newDesaId, nama: `Admin ${formData.namaDesa}`
      };
      
      const conflict = db.users.find(u => u.username === formData.adminUser);
      if (conflict) { 
        showDialog({ type: 'alert', title: 'Username Digunakan', message: 'Username Admin sudah terpakai!', isError: true }); 
        return; 
      }

      saveDb({ ...db, desas: [...db.desas, newDesa], users: [...db.users, newAdmin] });
    }
    
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Manajemen Entitas Desa (SaaS)</h3>
          <p className="text-xs text-slate-500">Buat instance desa baru, ubah kredensial Admin, atau Suspend akses desa tertentu.</p>
        </div>
        <button onClick={openAddModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all"><Plus size={16} /> Tambah Desa Tenant</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {db.desas.map(d => {
          const admin = db.users.find(u => u.desaId === d.id && u.role === 'admin');
          const oprCount = db.users.filter(u => u.desaId === d.id && u.role === 'operator').length;
          const isActive = d.isActive !== false;
          
          return (
            <div key={d.id} className={`bg-white p-6 rounded-2xl shadow-sm border space-y-4 relative overflow-hidden transition-colors ${!isActive ? 'border-red-300 bg-red-50/30' : 'border-slate-200'}`}>
              <div className={`absolute top-0 right-0 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider border-b border-l ${isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                {isActive ? 'Active Tenant' : 'Suspended'}
              </div>
              
              <div className="flex justify-between items-start border-b pb-3">
                <h4 className="font-bold text-slate-800 text-xl">{d.namaDesa}</h4>
                <button onClick={() => openEditModal(d)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Edit Desa & Akun"><Edit size={18}/></button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Wilayah</div>
                  <div className="font-medium text-slate-800">Kec. {d.namaKecamatan}</div>
                  <div className="font-medium text-slate-800">Kab. {d.namaKabupaten}</div>
                  <div className="font-medium text-slate-800">Prov. {d.namaProvinsi}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Statistik Akun</div>
                  <div className="font-medium text-slate-800 mt-1"><span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs">1 Admin</span></div>
                  <div className="font-medium text-slate-800 mt-1"><span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">{oprCount} Operator</span></div>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs mt-2 flex justify-between items-center">
                <div>
                  <div className="text-slate-500 font-bold mb-1">Akses Login Admin:</div>
                  <div>User: <strong className="font-mono text-slate-800">{admin?.username}</strong></div>
                  <div>Pass: <strong className="font-mono text-slate-800">{admin?.password}</strong></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Modal isOpen={showModal} title={editMode ? "Edit / Suspend Tenant Desa" : "Tambah Tenant Desa Baru"} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          {!editMode && (
             <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-4 text-xs text-indigo-800 leading-relaxed">
               Superadmin berhak mendaftarkan entitas Desa baru. Nama Desa dan Wilayah ini akan dikunci permanen sehingga Admin Desa tidak dapat mengubahnya.
             </div>
          )}

          {editMode && (
            <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors mb-4 ${formData.isActive ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div>
                <div className={`font-bold text-sm ${formData.isActive ? 'text-emerald-900' : 'text-red-900'}`}>Status Tenant: {formData.isActive ? 'Aktif Beroperasi' : 'Ditangguhkan (Suspended)'}</div>
                <div className={`text-xs mt-0.5 ${formData.isActive ? 'text-emerald-700' : 'text-red-700'}`}>Jika ditangguhkan, Admin dan Operator desa ini tidak akan bisa Login.</div>
              </div>
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                <div className={`block w-12 h-7 rounded-full transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${formData.isActive ? 'transform translate-x-5' : ''}`}></div>
              </div>
            </label>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Nama Desa</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl outline-none text-sm" value={formData.namaDesa} onChange={e => setFormData({...formData, namaDesa: e.target.value})} placeholder="Contoh: Desa Makmur" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Kecamatan</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl outline-none text-sm" value={formData.namaKecamatan} onChange={e => setFormData({...formData, namaKecamatan: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Kabupaten</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl outline-none text-sm" value={formData.namaKabupaten} onChange={e => setFormData({...formData, namaKabupaten: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Provinsi</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl outline-none text-sm" value={formData.namaProvinsi} onChange={e => setFormData({...formData, namaProvinsi: e.target.value})} />
            </div>
          </div>
          <div className="pt-4 border-t mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><h4 className="font-bold text-sm text-slate-700">Kredensial Akses Admin</h4></div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Username Admin Baru</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl outline-none text-sm font-mono" value={formData.adminUser} onChange={e => setFormData({...formData, adminUser: e.target.value})} placeholder="admin_makmur" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1">Password Admin</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl outline-none text-sm" value={formData.adminPass} onChange={e => setFormData({...formData, adminPass: e.target.value})} placeholder="Minimal 6 karakter" />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t mt-4">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all"><Check size={18}/> {editMode ? 'Simpan Perubahan' : 'Daftarkan Desa'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function SuperTemplatesView({ db, saveDb, showDialog }) {
  const [distributeModal, setDistributeModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [targetDesas, setTargetDesas] = useState([]);

  const handleCopyTemplate = (template) => {
    setSelectedTemplate(template);
    setTargetDesas([]);
    setDistributeModal(true);
  };

  const confirmDistribution = () => {
    if (targetDesas.length === 0) {
      showDialog({ type: 'alert', title: 'Pilih Tujuan', message: 'Pilih minimal 1 desa tujuan.', isError: true });
      return;
    }
    const updatedTemplates = [...db.templates];
    targetDesas.forEach(desaId => {
      updatedTemplates.push({
        ...selectedTemplate,
        id: 't_dist_' + Date.now() + Math.random(),
        desaId: desaId,
        nama: selectedTemplate.nama + ' (Salinan)'
      });
    });
    saveDb({ ...db, templates: updatedTemplates });
    setDistributeModal(false);
    showDialog({ type: 'alert', title: 'Distribusi Sukses', message: 'Distribusi Template Berhasil dilakukan ke desa tujuan.' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 text-lg">Bank Template Global & Distribusi</h3>
        <p className="text-xs text-slate-500 mt-1">Superadmin dapat melihat semua template dari berbagai desa dan menyalinnya ke desa lain.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {db.templates.map(t => {
          const desaOwner = db.desas.find(d => d.id === t.desaId);
          return (
            <div key={t.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700 shrink-0"><Layers size={20} /></div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-600 tracking-wider mb-1">Milik: {desaOwner?.namaDesa || 'Unknown'}</div>
                  <h4 className="font-bold text-slate-800 leading-tight">{t.nama}</h4>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t flex gap-2">
                <button onClick={() => handleCopyTemplate(t)} className="flex-1 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold flex justify-center items-center gap-2 transition-all">
                  <FileDown size={14}/> Salin & Distribusikan
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={distributeModal} title="Distribusi Template Antar Desa" onClose={() => setDistributeModal(false)}>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border text-sm text-slate-700">
            Template Asal: <strong>{selectedTemplate?.nama}</strong>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Pilih Desa Tujuan (Checklist):</label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {db.desas.map(d => (
                <label key={d.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="checkbox" className="w-4 h-4 accent-indigo-600" checked={targetDesas.includes(d.id)} onChange={e => {
                    if (e.target.checked) setTargetDesas([...targetDesas, d.id]);
                    else setTargetDesas(targetDesas.filter(id => id !== d.id));
                  }}/>
                  <span className="font-bold text-sm text-slate-800">{d.namaDesa} <span className="font-normal text-xs text-slate-500">(Kab. {d.namaKabupaten})</span></span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-between pt-4 border-t mt-4">
            <button onClick={() => setTargetDesas(db.desas.map(d=>d.id))} className="text-xs font-bold text-indigo-600 hover:underline">Pilih Semua Desa</button>
            <button onClick={confirmDistribution} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all"><CheckSquare size={16}/> Proses Distribusi</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SuperSettingsView({ db, saveDb }) {
  const [settingsForm, setSettingsForm] = useState(db.appConfig);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      themeColor: settingsForm.themeColor,
      fontFamily: settingsForm.fontFamily,
      landingTitle: settingsForm.landingTitle,
      landingSubtitle: settingsForm.landingSubtitle,
      landingAbout: settingsForm.landingAbout,
      landingLogo: settingsForm.landingLogo,
      landingLayout: settingsForm.landingLayout,
      superUser: settingsForm.superUser,
      superPass: settingsForm.superPass
    };
    saveDb({ ...db, appConfig: payload });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSuccessMsg('Pengaturan Global dan Kredensial Superadmin berhasil disimpan!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsForm({ ...settingsForm, landingLogo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      
      {successMsg && (
         <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-xl flex items-center gap-3 font-bold shadow-sm animate-pulse">
            <Check size={24} className="shrink-0"/> {successMsg}
         </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Pengaturan Inti & Identitas Aplikasi (White-Label)</h3>
        <form onSubmit={handleSave} className="space-y-5 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Judul Landing Page (Halaman Depan)</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl text-sm" value={settingsForm.landingTitle} onChange={e => setSettingsForm({...settingsForm, landingTitle: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Subjudul Singkat</label>
              <input className="w-full p-3 border border-slate-300 rounded-xl text-sm" value={settingsForm.landingSubtitle} onChange={e => setSettingsForm({...settingsForm, landingSubtitle: e.target.value})} />
            </div>
            <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Tentang Aplikasi (Deskripsi)</label>
            <textarea rows={2} className="w-full p-3 border border-slate-300 rounded-xl text-sm" value={settingsForm.landingAbout} onChange={e => setSettingsForm({...settingsForm, landingAbout: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Layout Landing Page</label>
            <select className="w-full p-3 border border-slate-300 rounded-xl text-sm bg-white" value={settingsForm.landingLayout} onChange={e => setSettingsForm({...settingsForm, landingLayout: e.target.value})}>
              <option value="center">Tengah (Center)</option>
              <option value="left">Kiri (Left Aligned)</option>
              <option value="split">Terbagi (Teks di Kiri, Gambar Kanan)</option>
              <option value="split-reverse">Terbagi (Gambar Kiri, Teks Kanan)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Upload Logo Utama Aplikasi</label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
              {settingsForm.landingLogo && <img src={settingsForm.landingLogo} alt="Logo" className="mt-2 h-12 object-contain" />}
            </div>
          </div>

          <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Username Superadmin</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl text-sm font-mono" value={settingsForm.superUser} onChange={e => setSettingsForm({...settingsForm, superUser: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded mb-1.5 w-fit">Password Superadmin</label>
              <input required className="w-full p-3 border border-slate-300 rounded-xl text-sm" value={settingsForm.superPass} onChange={e => setSettingsForm({...settingsForm, superPass: e.target.value})} />
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow transition-all flex items-center gap-2"><Save size={18}/> Simpan Pengaturan Global</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SuperDatabaseView({ db, saveDb, showDialog }) {
  const handleBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "backup_desa_saas_" + Date.now() + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleRestore = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          saveDb(parsed);
          showDialog({ type: 'alert', title: 'Restore Berhasil', message: 'Database berhasil dipulihkan (Restore) dengan sukses! Halaman akan dimuat ulang.' });
          setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
          showDialog({ type: 'alert', title: 'File Invalid', message: 'File backup tidak valid!', isError: true });
        }
      };
      fileReader.readAsText(file);
    }
  };

  const handleReset = () => {
    showDialog({
       type: 'confirm',
       title: 'Reset Pabrik',
       message: 'PERINGATAN: Seluruh data akan dikembalikan ke Mode Default Pabrik.',
       onConfirm: () => {
         saveDb(initialDatabase);
         window.location.reload();
       }
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Manajemen Database, Backup &amp; Restore</h3>
        <p className="text-xs text-slate-500 mt-1">Amankan seluruh data transaksi surat, kependudukan, dan tenant desa dengan fitur cadangan berkala.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <button onClick={handleBackup} className="p-6 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-2xl flex flex-col items-center text-center gap-3 transition-all text-indigo-900 group">
          <Download size={32} className="text-indigo-600 group-hover:scale-110 transition-transform" />
          <div>
            <div className="font-bold text-sm">Backup Database</div>
            <div className="text-xs text-indigo-700 mt-0.5">Unduh file cadangan JSON (.json)</div>
          </div>
        </button>

        <label className="p-6 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-2xl flex flex-col items-center text-center gap-3 transition-all text-emerald-900 cursor-pointer group">
          <Upload size={32} className="text-emerald-600 group-hover:scale-110 transition-transform" />
          <div>
            <div className="font-bold text-sm">Restore Database</div>
            <div className="text-xs text-emerald-700 mt-0.5">Unggah file cadangan JSON</div>
          </div>
          <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
        </label>

        <button onClick={handleReset} className="p-6 bg-red-50 border border-red-200 hover:bg-red-100 rounded-2xl flex flex-col items-center text-center gap-3 transition-all text-red-900 group">
          <RefreshCw size={32} className="text-red-600 group-hover:scale-110 transition-transform" />
          <div>
            <div className="font-bold text-sm">Reset Pabrik</div>
            <div className="text-xs text-red-700 mt-0.5">Kembalikan ke Mode Default Awal</div>
          </div>
        </button>
      </div>
    </div>
  );
}