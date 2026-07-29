// ==========================================
// 1. ĐỊNH NGHĨA CÁC HẰNG SỐ DANH MỤC TRANG BỊ
// ==========================================
const FT = "Fighter";
const DB = "Dive Bomber";
const TB = "Torpedo Bomber";
const SP = "Seaplane";
const DDG = "DD-gun";
const CLG = "CL-gun";
const CAG = "CA-gun";
const BBG = "BB-gun";
const AAG = "AA-gun";
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
window.equipData = {};
window.equipDetails = {};
window.shipDetails = {};

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
    'fighter-data.js',
    'dive-bomber-data.js',
    'torp-bomber-data.js',
    'seaplane-data.js',
    'asw-data.js',
    'auxiliary-data.js',
    'augmentation-data.js'
];

dataFiles.push('equip-script.js');
dataFiles.push('plugin-linkex.js');

dataFiles.forEach(fileName => {
    let script = document.createElement('script');
    script.src = 'equip/' + fileName;
    script.async = false;
    document.head.appendChild(script);
});