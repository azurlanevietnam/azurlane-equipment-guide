// File: equip/plugin-linkex.js
// Plugin bẻ khóa hình ảnh bằng CSS Injection (Đã fix lỗi Scope của từ khóa 'let')

(function() {
    function applyLinkExHack() {
        // 1. Đợi dữ liệu được nạp
        if (!window.equipDetails || Object.keys(window.equipDetails).length === 0) {
            setTimeout(applyLinkExHack, 50); 
            return;
        }

        let isModified = false;
        
        // 2. Quét kho dữ liệu và bẻ khóa CSS
        for (let cat in window.equipDetails) {
            let catData = window.equipDetails[cat];
            for (let id in catData) {
                let item = catData[id];
                
                // Hack CSS cho các item có linkEx
                if (item.linkEx && item.linkEx.trim() !== "" && !item._hacked) {
                    item.code = `blank'); --gear-img: url('${item.linkEx}'); --dummy: url('`;
                    item._hacked = true;
                    isModified = true;
                }
            }
        }

        // 3. Phép màu: Dùng hàm initEquipPage để ép toàn bộ trang nạp lại dữ liệu đã hack
        if (isModified && typeof window.initEquipPage === 'function') {
            window.initEquipPage();
        }
    }

    // Kích hoạt ngay lập tức
    applyLinkExHack();
})();