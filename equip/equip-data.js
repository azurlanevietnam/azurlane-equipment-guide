// ==========================================
// 1. ĐỊNH NGHĨA CÁC HẰNG SỐ DANH MỤC TRANG BỊ
// ==========================================
const FT = "Fighter";
const DB = "Dive Bomber";
const TB = "Torpedo Bomber";
const SP = "Seaplane";
const DDGM = "DD-gun";
const CLGM = "CL-gun";
const CAGM = "CA-gun";
const CBGM = "CB-gun";
const BBGM = "BB-gun";
const AAGM = "AA-gun";
const AATFGM = "AA-Gun (Time Fuze)";
const TRPM = "Surface Torpedo";
const GMM = "Guided Missile";
const AUX = "Auxiliary";
const AUG = "Augmentation";

const categories = [
    "DD-gun", "CL-gun", "CA-gun", "BB-gun", "AA-gun", 
    "Surface Torpedo", "Submerged Torpedo", "Fighter", 
    "Dive Bomber", "Torpedo Bomber", "Seaplane", "ASW", "Auxiliary", "Augmentation"
];

// ==========================================
// 2. KHỞI TẠO CÁC OBJECT GỐC LƯU TRỮ DỮ LIỆU
// ==========================================
window.equipData = window.equipData || {};
window.equipDetails = window.equipDetails || {};
window.shipDetails = window.shipDetails || {};

// ==========================================
// 3. DANH SÁCH FILE DỮ LIỆU CẦN TẢI
// ==========================================
const dataFiles = [
    'aircraft-cannon-data.js',
    'aircraft-torpedo-data.js',
    'aircraft-rocket-data.js',
    'aircraft-bomb-data.js',
    'bb-gun-data.js',
    'cl-gun-data.js',
    'dd-gun-data.js',
    'ca-gun-data.js',
    'aa-gun-data.js',
    'torpedo-data.js',
    'fighter-data.js',
    'dive-bomber-data.js',
    'torp-bomber-data.js',
    'seaplane-data.js',
    'asw-data.js',
    'auxiliary-data.js',
    'augmentation-data.js'
];

// Kiểm tra: Nếu KHÔNG PHẢI trang Fleet Builder thì mới nạp equip-script.js
const isFleetBuilderPage = document.getElementById('fleet-builder-container') !== null;
if (!isFleetBuilderPage) {
    dataFiles.push('equip-script.js');
}

dataFiles.forEach(fileName => {
    let script = document.createElement('script');
    script.src = 'equip/' + fileName;
    script.async = false;
    document.head.appendChild(script);
});