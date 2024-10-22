// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Konfigurasi untuk Database Pertama (TDS dan suhu)
const firebaseConfigTDSandSuhu = {
    /* Your config */
};

// Konfigurasi untuk Database Kedua (pH)
const firebaseConfigpH = {
    /* Your config */
};

// Inisialisasi Firebase untuk Database TDS dan suhu
const appTDSandSuhu = initializeApp(firebaseConfigTDSandSuhu, "appTDSandSuhu");
const databaseTDSandSuhu = getDatabase(appTDSandSuhu);

// Inisialisasi Firebase untuk Database pH
const appPH = initializeApp(firebaseConfigpH, "appPH");
const databasePH = getDatabase(appPH);

function checkIdeal(value, min, max, elementId, unit, paramName) {
    const element = document.getElementById(elementId);
    element.innerText = `${value} ${unit}`;
    
    if (value < min || value > max) {
        element.style.color = "red";
        setTimeout(() => {
            alert(`${paramName} tidak ideal: ${value} ${unit}`);
        }, 1000); // Alert setelah 1 detik
    } else {
        element.style.color = "green";
    }
}

function getData() {
    // Ambil data dari Database TDS
    const tdsRef = ref(databaseTDSandSuhu, 'TDS');
    onValue(tdsRef, (snapshot) => {
        if (snapshot.exists()) {
            const tdsValue = snapshot.val();
            checkIdeal(tdsValue, 840, 1400, 'tds-value', 'PPM', 'TDS');
        } else {
            console.log("Tidak ada data untuk TDS");
            document.getElementById('tds-value').innerText = "Tidak tersedia";
        }
    });

    // Ambil data dari Database suhu
    const tempRef = ref(databaseTDSandSuhu, 'Suhu');
    onValue(tempRef, (snapshot) => {
        if (snapshot.exists()) {
            const tempValue = snapshot.val();
            checkIdeal(tempValue, 15, 30, 'temp-value', '°C', 'Suhu');
        } else {
            console.log("Tidak ada data untuk suhu");
            document.getElementById('temp-value').innerText = "Tidak tersedia";
        }
    });

    // Ambil data dari Database pH
    const phRef = ref(databasePH, 'pH');
    onValue(phRef, (snapshot) => {
        if (snapshot.exists()) {
            const phValue = snapshot.val();
            checkIdeal(phValue, 5.5, 6.5, 'ph-value', '', 'pH');
        } else {
            console.log("Tidak ada data untuk pH");
            document.getElementById('ph-value').innerText = "Tidak tersedia";
        }
    });
}

// Panggil fungsi getData untuk mulai mengambil data
getData();

// Tambahkan event listener untuk tombol refresh
document.getElementById('refreshButton').addEventListener('click', function() {
    getData(); // Panggil fungsi untuk mendapatkan data terbaru
});