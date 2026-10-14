function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.getElementById('navLinks').classList.remove('active');
    window.scrollTo(0,0);
}

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// === LOAD DATA & RENDER ===
function loadData() {
    const infoUtama = JSON.parse(localStorage.getItem('madrasah_info')) || {
        biografi: "MI Al Urwatul Wutsqo 1 adalah lembaga pendidikan dasar yang bernaung di bawah Yayasan Al Urwatul Wutsqo, Jombang.",
        prestasi: "Juara 1 Lomba Pramuka Tingkat Kabupaten\nJuara Harapan 1 Olimpiade Matematika MI",
        link_pendaftaran: "https://forms.gle/Ug3FaFgexSriMrTA9",
        pendidik: "Kepala Madrasah : Bapak Usman Adi Putra, S.Pd\nGuru Kelas 1 : Ibu Siti Aminah, S.Pd"
    };

    document.getElementById('beranda-biografi-content').innerText = infoUtama.biografi;
    document.getElementById('link-pendaftaran-publik').href = infoUtama.link_pendaftaran;
    document.getElementById('edit-biografi').value = infoUtama.biografi;
    document.getElementById('edit-pendidik').value = infoUtama.pendidik || "";
    document.getElementById('edit-prestasi').value = infoUtama.prestasi;
    document.getElementById('edit-link-pendaftaran').value = infoUtama.link_pendaftaran;

    // Pendidik
    const pendidikArray = (infoUtama.pendidik || "").split('\n').filter(item => item.trim() !== "");
    let pendidikHTML = pendidikArray.length === 0 ? "<p>Belum ada data pendidik.</p>" : "";
    pendidikArray.forEach(item => {
        let cleanLine = item.replace(/^[-*•]\s*/, '').trim();
        let jabatan = "Staf / Pendidik", nama = cleanLine;
        if(cleanLine.includes(':')) {
            const parts = cleanLine.split(':');
            jabatan = parts[0].trim(); nama = parts[1].trim();
        }
        pendidikHTML += `<div class="org-card"><div class="org-avatar"><i class="fas fa-user-tie"></i></div><div class="org-role">${jabatan}</div><div class="org-name">${nama}</div></div>`;
    });
    document.getElementById('pendidik-content').innerHTML = pendidikHTML;

    // Prestasi
    const prestasiArray = (infoUtama.prestasi || "").split('\n').filter(item => item.trim() !== "");
    let prestasiHTML = prestasiArray.length === 0 ? "<p>Belum ada data prestasi.</p>" : "";
    prestasiArray.forEach(item => {
        let cleanText = item.replace(/^\d+[\.\)]\s*/, '').trim();
        prestasiHTML += `<div class="prestasi-card"><i class="fas fa-trophy"></i><p>${cleanText}</p></div>`;
    });
    document.getElementById('beranda-prestasi-container').innerHTML = prestasiHTML;

    // Berita & Admin List
    let daftarBerita = JSON.parse(localStorage.getItem('madrasah_berita')) || [];
    
    // Pastikan setiap berita punya ID unik (Migrasi data lama)
    daftarBerita = daftarBerita.map((b, i) => {
        if(!b.id) b.id = Date.now() + i;
        return b;
    });
    localStorage.setItem('madrasah_berita', JSON.stringify(daftarBerita));

    let berandaHTML = "", fullHTML = "", adminListHTML = "";
    const beritaTerbaru = [...daftarBerita].reverse();

    if (beritaTerbaru.length === 0) {
        berandaHTML = fullHTML = adminListHTML = "<p style='text-align:center; width:100%;'>Belum ada berita.</p>";
    } else {
        beritaTerbaru.forEach((berita, index) => {
            // Card Publik
            const beritaCard = `
                <div class="news-card" onclick="bacaBerita(${berita.id})">
                    <img src="${berita.gambar}" alt="Gambar Berita">
                    <div class="news-content">
                        <h3>${berita.judul}</h3>
                        <p>${berita.isi.substring(0, 80)}...</p>
                        <small style="color:#aaa;">${berita.tanggal}</small>
                    </div>
                </div>
            `;
            fullHTML += beritaCard;
            if(index < 3) berandaHTML += beritaCard;

            // List Admin
            adminListHTML += `
                <div class="admin-news-item">
                    <div>
                        <strong>${berita.judul}</strong> <br>
                        <small style="color:#888;">${berita.tanggal}</small>
                    </div>
                    <div class="admin-news-actions">
                        <button class="btn-warning" onclick="bukaEdit(${berita.id})"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn-danger" onclick="hapusBerita(${berita.id})"><i class="fas fa-trash"></i> Hapus</button>
                    </div>
                </div>
            `;
        });
    }
    document.getElementById('beranda-news-container').innerHTML = berandaHTML;
    document.getElementById('full-news-container').innerHTML = fullHTML;
    document.getElementById('admin-news-list').innerHTML = adminListHTML;
}

// === FITUR BACA BERITA PENUH ===
window.bacaBerita = function(id) {
    const daftarBerita = JSON.parse(localStorage.getItem('madrasah_berita')) || [];
    const berita = daftarBerita.find(b => b.id === id);
    if(berita) {
        document.getElementById('detail-judul').innerText = berita.judul;
        document.getElementById('detail-tanggal').innerHTML = `<i class="far fa-calendar-alt"></i> ${berita.tanggal}`;
        document.getElementById('detail-gambar').src = berita.gambar;
        document.getElementById('detail-isi').innerText = berita.isi;
        showPage('baca-berita-page');
    }
}

// === ADMIN LOGIN & SIMPAN INFO ===
function loginAdmin() {
    const pin = document.getElementById('admin-password').value;
    if(pin === "hanyaadmin") {
        document.getElementById('admin-password').value = "";
        document.getElementById('login-error').innerText = "";
        showPage('admin-dashboard');
    } else {
        document.getElementById('login-error').innerText = "PIN Salah!";
    }
}
function logoutAdmin() { showPage('home'); }

function saveInfo(key, elemId, msg) {
    const text = document.getElementById(elemId).value;
    const infoUtama = JSON.parse(localStorage.getItem('madrasah_info')) || {};
    infoUtama[key] = text;
    localStorage.setItem('madrasah_info', JSON.stringify(infoUtama));
    alert(msg); loadData();
}
function saveBiografi() { saveInfo('biografi', 'edit-biografi', 'Biografi Disimpan!'); }
function savePendidik() { saveInfo('pendidik', 'edit-pendidik', 'Data Pendidik Disimpan!'); }
function savePrestasi() { saveInfo('prestasi', 'edit-prestasi', 'Prestasi Disimpan!'); }
function saveLink() { saveInfo('link_pendaftaran', 'edit-link-pendaftaran', 'Link Disimpan!'); }

// === KELOLA BERITA (TAMBAH, HAPUS, EDIT) ===
function tambahBerita() {
    const judul = document.getElementById('berita-judul').value;
    const isi = document.getElementById('berita-isi').value;
    const fileInput = document.getElementById('berita-gambar');
    const statusText = document.getElementById('upload-status');
    
    if(!judul || !isi || fileInput.files.length === 0) { alert("Lengkapi data!"); return; }
    if(fileInput.files[0].size > 2 * 1024 * 1024) { alert("Maksimal 2MB!"); return; }

    statusText.innerText = "Memproses gambar...";
    const reader = new FileReader();
    reader.onload = function(e) {
        const daftarBerita = JSON.parse(localStorage.getItem('madrasah_berita')) || [];
        daftarBerita.push({
            id: Date.now(),
            judul: judul, isi: isi,
            gambar: e.target.result,
            tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        });
        localStorage.setItem('madrasah_berita', JSON.stringify(daftarBerita));
        document.getElementById('berita-judul').value = "";
        document.getElementById('berita-isi').value = ""; fileInput.value = "";
        statusText.innerText = "Berita tersimpan!";
        setTimeout(() => { statusText.innerText = ""; }, 3000);
        loadData();
    };
    reader.readAsDataURL(fileInput.files[0]);
}

window.hapusBerita = function(id) {
    if(confirm("Yakin ingin menghapus berita ini secara permanen?")) {
        let daftarBerita = JSON.parse(localStorage.getItem('madrasah_berita')) || [];
        daftarBerita = daftarBerita.filter(b => b.id !== id);
        localStorage.setItem('madrasah_berita', JSON.stringify(daftarBerita));
        loadData();
    }
}

// Logika Edit Modal
window.bukaEdit = function(id) {
    const daftarBerita = JSON.parse(localStorage.getItem('madrasah_berita')) || [];
    const berita = daftarBerita.find(b => b.id === id);
    if(berita) {
        document.getElementById('edit-id').value = berita.id;
        document.getElementById('edit-judul').value = berita.judul;
        document.getElementById('edit-isi').value = berita.isi;
        document.getElementById('edit-gambar').value = ""; // Reset input file
        document.getElementById('editModal').style.display = "block";
    }
}

window.tutupEdit = function() {
    document.getElementById('editModal').style.display = "none";
}

window.simpanEditBerita = function() {
    const id = parseInt(document.getElementById('edit-id').value);
    const judul = document.getElementById('edit-judul').value;
    const isi = document.getElementById('edit-isi').value;
    const fileInput = document.getElementById('edit-gambar');
    const statusText = document.getElementById('edit-status');

    if(!judul || !isi) { alert("Judul dan isi tidak boleh kosong!"); return; }

    let daftarBerita = JSON.parse(localStorage.getItem('madrasah_berita')) || [];
    let indexBerita = daftarBerita.findIndex(b => b.id === id);

    if(indexBerita !== -1) {
        statusText.innerText = "Menyimpan perubahan...";
        
        // Jika admin mengganti gambar
        if(fileInput.files.length > 0) {
            if(fileInput.files[0].size > 2 * 1024 * 1024) { alert("Maksimal gambar 2MB!"); statusText.innerText=""; return; }
            const reader = new FileReader();
            reader.onload = function(e) {
                daftarBerita[indexBerita].judul = judul;
                daftarBerita[indexBerita].isi = isi;
                daftarBerita[indexBerita].gambar = e.target.result; // Timpa dengan gambar baru
                localStorage.setItem('madrasah_berita', JSON.stringify(daftarBerita));
                selesaiEdit(statusText);
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            // Jika admin TIDAK mengganti gambar
            daftarBerita[indexBerita].judul = judul;
            daftarBerita[indexBerita].isi = isi;
            localStorage.setItem('madrasah_berita', JSON.stringify(daftarBerita));
            selesaiEdit(statusText);
        }
    }
}

function selesaiEdit(statusText) {
    statusText.innerText = "Perubahan berhasil disimpan!";
    loadData();
    setTimeout(() => {
        statusText.innerText = "";
        tutupEdit();
    }, 1500);
}

// Tutup modal jika klik di luar box modal
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) { modal.style.display = "none"; }
}

document.addEventListener("DOMContentLoaded", loadData);