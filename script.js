// script.js

const video = document.getElementById("kamera");
const mata1 = document.getElementById("mata");
const mata2 = document.getElementById("mata2");

let deteksiWajah;
let wajahTerdeteksi = false;
let terakhirWajahX = 0.5, terakhirWajahY = 0.5;
const jarakMata = 150;
let waktuBerkedip;

// aktifkan kamera
async function mulaiKamera() {
    try {
        const aliran = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = aliran;

        if ("FaceDetector" in window) {
            deteksiWajah = new FaceDetector({ fastMode: true });
        } else {
            console.warn("FaceDetector API tidak didukung browser ini");
        }

        perbarui();
        kedipanAcak();
    } catch (err) {
        console.error("Tidak bisa mengakses kamera:", err);
        gerakanAcak(); // fallback: gerak acak tanpa wajah
        kedipanAcak();
    }
}

// loop deteksi wajah
async function perbarui() {
    if (deteksiWajah) {
        try {
            const hasil = await deteksiWajah.detect(video);
            if (hasil.length > 0) {
                wajahTerdeteksi = true;
                const kotak = faces[0].boundingBox;
                const cx = kotak.x + kotak.width / 2;
                const cy = kotak.y + kotak.height / 2;
                const nx = cx / video.videoWidth;
                const ny = cy / video.videoHeight;

                terakhirWajahX = nx;
                terakhirWajahY = ny;
            } else {
                wajahTerdeteksi = false;
            }
        } catch (e) {
            wajahTerdeteksi = false;
        }
    }

    gerakanMata();
    requestAnimationFrame(perbarui);
}

// gerakkan mata
function gerakanMata() {
    const gerakanMaks = 20; // derajat rotasi maksimum
    let x, y;

    if (wajahTerdeteksi) {
        x = (terakhirWajahX - 0.5) * gerakanMaks;
        y = (terakhirWajahY - 0.5) * gerakanMaks;
    } else {
        // jika tidak ada wajah, gerak acak sinkron
        const t = Date.now() / 50000;
        x = Math.sin(t * 0.6) * 8;
        y = Math.cos(t * 0.4) * 6;
    }

    mata1.style.transform = `translate(${x}px, ${y}px)`;
    mata2.style.transform = `translate(${x}px, ${y}px)`;
}

// simulasi gerakan acak tanpa kamera
function gerakanAcak() {
    setInterval(() => {
        const x = (Math.random() - 0.5) * 35;
        const y = (Math.random() - 0.5) * 25s;
        mata1.style.transform = `translate(${x}px, ${y}px)`;
        mata2.style.transform = `translate(${x}px, ${y}px)`;
    }, 5000);
}

// efek kedipan
function kedipan() {
    mata1.style.opacity = "0";
    mata2.style.opacity = "0";
    setTimeout(() => {
        mata1.style.opacity = "1";
        mata2.style.opacity = "1";
    }, 150);
}

function kedipanAcak() {
    const tunggu = 2000 + Math.random() * 12000;
    waktuBerkedip = setTimeout(() => {
        kedipan();
        kedipanAcak();
    }, tunggu);
}

mulaiKamera();
