// script.js

const video = document.getElementById("kamera");
const mata1 = document.getElementById("mata");
const mata2 = document.getElementById("mata2");

let tracker;
let wajahTerdeteksi = false;
let terakhirWajahX = 0.5, terakhirWajahY = 0.5;

// aktifkan kamera
async function mulaiKamera() {
    try {
        const aliran = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = aliran;

        video.onloadedmetadata = () => {
            tracker = new clm.tracker({ useWebGL: true });
            tracker.init(pModel);
            tracker.start(video);

            console.log("Tracker dimulai");
            perbarui();
            kedipanAcak();
        };
    } catch (err) {
        console.error("Tidak bisa mengakses kamera:", err);
        gerakanAcak();
        kedipanAcak();
    }
}

setTimeout(() => {
    perbarui();
    kedipanAcak();
}, 500);

// loop deteksi wajah
function perbarui() {
    const posisi = tracker.getCurrentPosition();
    console.log("Posisi wajah:", posisi ? posisi.length : 0);

    if (video.videoWidth === 0 || video.videoHeight === 0) {
        requestAnimationFrame(perbarui);
        return;
    }

    if (posisi && posisi.length > 0) {
        wajahTerdeteksi = true;

        const semuaX = posisi.map(p => p[0]);
        const semuaY = posisi.map(p => p[1]);
        const cx = semuaX.reduce((a, b) => a + b, 0) / semuaX.length;
        const cy = semuaY.reduce((a, b) => a + b, 0) / semuaY.length;

        terakhirWajahX = cx / video.videoWidth;
        terakhirWajahY = cy / video.videoHeight;
    } else {
        wajahTerdeteksi = false;
    }

    gerakanMata();
    requestAnimationFrame(perbarui);
}

// gerakkan mata
function gerakanMata() {
    const gerakanMaks = 20;
    let x, y;

    if (wajahTerdeteksi) {
        x = (terakhirWajahX - 0.5) * gerakanMaks;
        y = (terakhirWajahY - 0.5) * gerakanMaks;
    } else {
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
        const x = (Math.random() - 0.5) * 40;
        const y = (Math.random() - 0.5) * 30;
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
    setTimeout(() => {
        kedipan();
        kedipanAcak();
    }, tunggu);
}

mulaiKamera();
