const fleetContainer = document.getElementById('fleet-builder-container');
const shipModal = document.getElementById('shipSelectionModal');
const shipModalGrid = document.getElementById('shipModalGrid');

// Trạng thái của 3 vị trí tàu trong đội hình
// Mỗi slot lưu thông tin: { shipId: null/string, equips: [null, null, null, null, null, null] }
let fleetState = [
    { shipId: null, equips: [null, null, null, null, null, null] },
    { shipId: null, equips: [null, null, null, null, null, null] },
    { shipId: null, equips: [null, null, null, null, null, null] }
];

let selectingSlotIndex = -1; // Lưu vị trí hàng đang bấm chọn tàu

function initFleetBuilder() {
    renderFleet();
}

// Xây dựng URL hình ảnh dựa vào ID tàu
function getShipIconUrl(shipId, shipData) {
    if (shipId.endsWith('_kai')) {
        // Tàu cải tạo (có hậu tố _kai ở key)
        return `https://cdn.nagami.moe/squareicon/${shipData.code}.png`;
    } else {
        // Tàu thường
        const formattedName = shipData.name.replace(/ /g, '_');
        return `https://azurlane.netojuu.com/images/${shipData.code}/${formattedName}Icon.png`;
    }
}

// Lấy thông tin tàu từ toàn bộ data
function getShipData(shipId) {
    if (!window.shipDetails) return null;
    for (let cat in window.shipDetails) {
        if (window.shipDetails[cat][shipId]) {
            return window.shipDetails[cat][shipId];
        }
    }
    return null;
}

// Vẽ 3 hàng Box
function renderFleet() {
    let html = "";

    fleetState.forEach((slot, index) => {
        let shipData = slot.shipId ? getShipData(slot.shipId) : null;
        let shipHtml = "";
        
        // 1. Box Đầu (Tàu)
        if (shipData) {
            let iconUrl = getShipIconUrl(slot.shipId, shipData);
            let boxClass = shipData.box ? `box-${shipData.box}` : "box-grey";
            shipHtml = `<div class="square-slot ship-slot ${boxClass}" onclick="openShipModal(${index})">
                            <img src="${iconUrl}" class="slot-image" alt="${shipData.name}">
                        </div>`;
        } else {
            // ÁP DỤNG BOX-GREY LÀM KHUNG MẶC ĐỊNH KHI CHƯA CHỌN TÀU
            shipHtml = `<div class="square-slot ship-slot box-grey" onclick="openShipModal(${index})">
                            <span class="plus-sign">+</span>
                        </div>`;
        }

        // 2. Box Trang Bị (6 Box sau)
        let equipsHtml = "";
        for (let i = 0; i < 6; i++) {
            let isShipSelected = slot.shipId !== null;
            
            // TRẢ LẠI BOX-GREY CHO TRANG BỊ TRỐNG
            let equipClass = isShipSelected ? "box-grey" : "disabled"; 
            
            let onClickEvent = isShipSelected ? `onclick="alert('Tính năng chọn trang bị đang phát triển!')"` : "";

            equipsHtml += `
                <div class="square-slot equip-slot ${equipClass}" ${onClickEvent}>
                    ${isShipSelected ? '<span class="plus-sign">+</span>' : ''}
                </div>
            `;
        }

        html += `<div class="fleet-row">${shipHtml}${equipsHtml}</div>`;
    });

    fleetContainer.innerHTML = html;
}

// ==========================================
// ĐIỀU KHIỂN POPUP CHỌN TÀU
// ==========================================

function openShipModal(slotIndex) {
    selectingSlotIndex = slotIndex;
    
    // ĐÃ SỬA: font-size từ 48px lên 96px để to gấp đôi
    let gridHtml = `
        <div class="ship-item-wrapper">
            <div class="modal-ship-icon box-grey" onclick="selectShip(null)" style="display:flex; justify-content:center; align-items:center;">
                <span style="font-size: 96px; color: #e74c3c; font-weight: 300; display: inline-block; transform: rotate(45deg);">+</span>
            </div>
            <div class="ship-name-box" onmouseenter="handleNameHover(this, true)" onmouseleave="handleNameHover(this, false)">
                <span class="ship-name-text">Bỏ chọn</span>
            </div>
        </div>
    `;

    // Lặp dữ liệu hiển thị các tàu
    if (window.shipDetails) {
        for (let cat in window.shipDetails) {
            for (let shipId in window.shipDetails[cat]) {
                let shipData = window.shipDetails[cat][shipId];
                let iconUrl = getShipIconUrl(shipId, shipData);
                let safeName = shipData.name.replace(/"/g, '&quot;');
                let boxClass = shipData.box ? `box-${shipData.box}` : "box-grey";
                
                gridHtml += `
                    <div class="ship-item-wrapper">
                        <div class="modal-ship-icon ${boxClass}" title="${safeName}" onclick="selectShip('${shipId}')">
                            <img src="${iconUrl}" class="modal-ship-image" alt="${safeName}">
                        </div>
                        <div class="ship-name-box" onmouseenter="handleNameHover(this, true)" onmouseleave="handleNameHover(this, false)">
                            <span class="ship-name-text">${safeName}</span>
                        </div>
                    </div>
                `;
            }
        }
    }
    
    shipModalGrid.innerHTML = gridHtml;
    shipModal.style.display = "flex";
}

// Xử lý hiệu ứng chữ chạy riêng cho thẻ bị dài
function handleNameHover(el, isHover) {
    const textEl = el.querySelector('.ship-name-text');
    if (isHover) {
        textEl.style.maxWidth = 'none';
        
        // ĐÃ SỬA: Cộng thêm 6px vào overflow để chữ trượt thêm một chút, tránh bị cắt phần đuôi ký tự
        const overflow = textEl.scrollWidth - el.clientWidth + 6; 
        
        textEl.style.maxWidth = ''; 
        
        if (overflow > 0) {
            textEl.style.setProperty('--scroll-dist', `-${overflow}px`);
            textEl.classList.add('marquee-run');
            el.style.textAlign = 'left';
        }
    } else {
        textEl.classList.remove('marquee-run');
        el.style.textAlign = 'center'; 
    }
}

function closeShipModal() {
    shipModal.style.display = "none";
    selectingSlotIndex = -1;
}

function selectShip(shipId) {
    if (selectingSlotIndex !== -1) {
        fleetState[selectingSlotIndex].shipId = shipId;
        renderFleet(); // Vẽ lại giao diện
    }
    closeShipModal();
}

// Đóng modal khi bấm ra ngoài vùng đen
window.onclick = function(event) {
    if (event.target === shipModal) {
        closeShipModal();
    }
};

// Khởi tạo
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initFleetBuilder);
} else {
    // Gọi ngay lập tức nếu DOM đã load xong
    initFleetBuilder();
}