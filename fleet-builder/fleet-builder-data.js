// Danh sách các file cần load theo đúng thứ tự logic với đường dẫn thư mục chuẩn xác
const fleetDataFiles = [
    // 1. TẢI TỪ ĐIỂN VÀ TOÀN BỘ KHỞI TẠO TỪ THƯ MỤC "equip"
    'equip/equip-data.js',
    'label/label-data.js',

    // 2. TẢI DỮ LIỆU TỪNG LOẠI TÀU TỪ THƯ MỤC "ship"
    'ship/destroyer-data.js',
    'ship/missile-destroyer-data.js',
    'ship/light-cruiser-data.js',
    'ship/heavy-cruiser-data.js',
    'ship/large-cruiser-data.js',
    'ship/battleship-data.js',
    'ship/aviation-battleship-data.js',
    'ship/aircraft-carrier-data.js',
    // Sau này bạn có thể bỏ comment để thêm các loại tàu khác:

    // 3. TẢI SCRIPT XỬ LÝ GIAO DIỆN TỪ THƯ MỤC "fleet-builder" CUỐI CÙNG
    'fleet-builder/fleet-builder-script.js'
];

// Tiến hành nạp toàn bộ dữ liệu và script tuần tự
fleetDataFiles.forEach(fileName => {
    let script = document.createElement('script');
    script.src = fileName;

    // Thuộc tính async = false ép trình duyệt load đúng thứ tự trong mảng, tránh bị lỗi mất liên kết dữ liệu
    script.async = false;

    document.head.appendChild(script);
});