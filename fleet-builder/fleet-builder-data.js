// Khởi tạo Object gốc để chứa toàn bộ dữ liệu tàu
window.shipDetails = {};

// Danh sách các file dữ liệu tàu nằm trong thư mục 'ship/'
const shipDataFiles = [
    'aircraft-carrier-data.js',
    // Sau này bạn có thể thêm:
    // 'battleship-data.js',
    // 'cruiser-data.js',
    // 'destroyer-data.js'
];

// 1. Nạp toàn bộ dữ liệu tàu
shipDataFiles.forEach(fileName => {
    let script = document.createElement('script');
    script.src = 'ship/' + fileName;
    script.async = false; // Nạp tuần tự để đảm bảo thứ tự dữ liệu
    document.head.appendChild(script);
});

// 2. Nạp script xử lý giao diện của Fleet Builder sau khi data đã load
let script = document.createElement('script');
script.src = 'fleet-builder/fleet-builder-script.js';
script.async = false;
document.head.appendChild(script);