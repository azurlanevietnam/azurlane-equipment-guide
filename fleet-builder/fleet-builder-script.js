const fleetContainer = document.getElementById('fleet-builder-container');
const shipModal = document.getElementById('shipSelectionModal');
const shipModalGrid = document.getElementById('shipModalGrid');

// Trạng thái của 3 vị trí tàu trong đội hình
let fleetState = loadFleetState();

let selectingSlotIndex = -1; // Vị trí hàng tàu
let selectingEquipSlotIndex = -1; // Vị trí ô trang bị (0 - 5)

function initFleetBuilder() {
    injectEquipModal(); // Tự động tạo popup chọn trang bị vào DOM
    injectResetButton(); // Tự động tạo nút Reset vào bên dưới
    
    // Đảm bảo đợi dữ liệu trang bị và tàu load xong rồi mới render để hiển thị chính xác trang bị từ cache
    waitForDataAndRender();
}

function waitForDataAndRender() {
    const checkDataReady = setInterval(() => {
        // Kiểm tra xem hệ thống đã load xong window.shipDetails và window.equipDetails chưa
        if (window.shipDetails && window.equipDetails && Object.keys(window.equipDetails).length > 0) {
            clearInterval(checkDataReady);
            renderFleet();
        }
    }, 50); // Kiểm tra mỗi 50ms
}

// ==========================================
// QUẢN LÝ LOCALSTORAGE (CACHE NGƯỜI DÙNG)
// ==========================================
function saveFleetState() {
    try {
        localStorage.setItem('azur_lane_fleet_state', JSON.stringify(fleetState));
    } catch (e) {
        console.error("Không thể lưu cache đội hình:", e);
    }
}

function loadFleetState() {
    try {
        const saved = localStorage.getItem('azur_lane_fleet_state');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error("Không thể đọc cache đội hình:", e);
    }
    // Mặc định ban đầu nếu chưa có dữ liệu
    return [
        { shipId: null, equips: [null, null, null, null, null, null] },
        { shipId: null, equips: [null, null, null, null, null, null] },
        { shipId: null, equips: [null, null, null, null, null, null] }
    ];
}

function resetFleetState() {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ đội hình và trang bị đã chọn không?")) {
        fleetState = [
            { shipId: null, equips: [null, null, null, null, null, null] },
            { shipId: null, equips: [null, null, null, null, null, null] },
            { shipId: null, equips: [null, null, null, null, null, null] }
        ];
        saveFleetState();
        renderFleet();
    }
}

// Tự động chèn nút Reset xuống dưới khung đội hình nếu chưa có
function injectResetButton() {
    if (!document.getElementById('fleetResetBtn')) {
        const resetBtnHtml = `
        <div style="display: flex; justify-content: center; margin-top: 15px;">
            <button id="fleetResetBtn" onclick="resetFleetState()" style="
                background-color: #e74c3c;
                color: white;
                border: none;
                padding: 10px 20px;
                font-size: 14px;
                font-weight: bold;
                letter-spacing: 1px;
                cursor: pointer;
                border-radius: 4px;
                transition: background 0.2s;
            " onmouseover="this.style.backgroundColor='#c0392b'" onmouseout="this.style.backgroundColor='#e74c3c'">
                RESET ĐỘI HÌNH
            </button>
        </div>
        `;
        if (fleetContainer && fleetContainer.parentNode) {
            fleetContainer.parentNode.insertAdjacentHTML('beforeend', resetBtnHtml);
        }
    }
}

// Tìm loại tàu (VD: "CV") và Dữ liệu tàu dựa vào shipId
function getShipTypeAndData(shipId) {
    if (!window.shipDetails) return null;
    for (let type in window.shipDetails) {
        if (window.shipDetails[type][shipId]) {
            return { type: type, data: window.shipDetails[type][shipId] };
        }
    }
    return null;
}

// Xây dựng URL hình ảnh dựa vào ID tàu
function getShipIconUrl(shipId, shipData) {
    if (shipId.endsWith('_kai')) {
        return `https://cdn.nagami.moe/squareicon/${shipData.code}.png`;
    } else {
        const formattedName = shipData.name.replace(/ /g, '_');
        return `https://azurlane.netojuu.com/images/${shipData.code}/${formattedName}Icon.png`;
    }
}

// ==========================================
// RENDER GIAO DIỆN CHÍNH
// ==========================================
function renderFleet() {
    let html = "";

    fleetState.forEach((slot, index) => {
        let shipInfo = slot.shipId ? getShipTypeAndData(slot.shipId) : null;
        let shipHtml = "";
        
        // 1. Box Đầu (Tàu)
        if (shipInfo) {
            let iconUrl = getShipIconUrl(slot.shipId, shipInfo.data);
            let boxClass = shipInfo.data.box ? `box-${shipInfo.data.box}` : "box-grey";
            shipHtml = `<div class="square-slot ship-slot ${boxClass}" onclick="openShipModal(${index})">
                            <img src="${iconUrl}" class="slot-image" alt="${shipInfo.data.name}">
                        </div>`;
        } else {
            shipHtml = `<div class="square-slot ship-slot box-grey" onclick="openShipModal(${index})">
                            <span class="plus-sign">+</span>
                        </div>`;
        }

        // 2. Box Trang Bị (6 Box)
        let equipsHtml = "";
        for (let i = 0; i < 6; i++) {
            let isShipSelected = slot.shipId !== null;
            let eqSave = slot.equips[i];
            
            // Nếu slot đã có trang bị được chọn
            if (isShipSelected && eqSave && eqSave.id && window.equipDetails[eqSave.category] && window.equipDetails[eqSave.category][eqSave.id]) {
                let eqData = window.equipDetails[eqSave.category][eqSave.id];
                let boxClass = eqData.box ? `box-${eqData.box}` : "box-grey";
                let iconUrl = `https://azurlane.netojuu.com/images/${eqData.code}.png`;
                
                equipsHtml += `
                    <div class="square-slot equip-slot ${boxClass}" onclick="openEquipModal(${index}, ${i})">
                        <img src="${iconUrl}" class="slot-image">
                    </div>
                `;
            } else {
                // Trạng thái trống hoặc disabled
                let equipClass = isShipSelected ? "box-grey" : "disabled"; 
                let onClickEvent = isShipSelected ? `onclick="openEquipModal(${index}, ${i})"` : "";

                equipsHtml += `
                    <div class="square-slot equip-slot ${equipClass}" ${onClickEvent}>
                        ${isShipSelected ? '<span class="plus-sign">+</span>' : ''}
                    </div>
                `;
            }
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
    
    let gridHtml = `
        <div class="ship-item-wrapper" onmouseleave="handleItemLeave(this)">
            <div class="modal-ship-icon box-grey" onclick="selectShip(null)" style="display:flex; justify-content:center; align-items:center;"
                 onmouseenter="handleIconHover(this, true)">
                <span style="font-size: 96px; color: #e74c3c; font-weight: 300; display: inline-block; transform: rotate(45deg);">+</span>
            </div>
            <div class="ship-name-box" onmouseenter="handleNameHover(this, true)">
                <span class="ship-name-text">Bỏ chọn</span>
            </div>
        </div>
    `;

    if (window.shipDetails) {
        for (let cat in window.shipDetails) {
            for (let shipId in window.shipDetails[cat]) {
                let shipData = window.shipDetails[cat][shipId];
                let iconUrl = getShipIconUrl(shipId, shipData);
                let safeName = shipData.name.replace(/"/g, '&quot;');
                let boxClass = shipData.box ? `box-${shipData.box}` : "box-grey";
                
                gridHtml += `
                    <div class="ship-item-wrapper" onmouseleave="handleItemLeave(this)">
                        <div class="modal-ship-icon ${boxClass}" title="${safeName}" onclick="selectShip('${shipId}')"
                             onmouseenter="handleIconHover(this, true)">
                            <img src="${iconUrl}" class="modal-ship-image" alt="${safeName}">
                        </div>
                        <div class="ship-name-box" onmouseenter="handleNameHover(this, true)">
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

function selectShip(shipId) {
    if (selectingSlotIndex !== -1) {
        // Nếu chọn tàu mới hoặc bỏ chọn, reset toàn bộ trang bị của hàng đó
        if (fleetState[selectingSlotIndex].shipId !== shipId) {
            fleetState[selectingSlotIndex].shipId = shipId;
            fleetState[selectingSlotIndex].equips = [null, null, null, null, null, null];
        }
        saveFleetState(); // Lưu vào cache
        renderFleet();
    }
    closeShipModal();
}

function closeShipModal() {
    shipModal.style.display = "none";
    selectingSlotIndex = -1;
}

// ==========================================
// ĐIỀU KHIỂN POPUP CHỌN TRANG BỊ
// ==========================================
function injectEquipModal() {
    if (!document.getElementById('equipSelectionModal')) {
        const equipModalHtml = `
        <div id="equipSelectionModal" class="modal-overlay" style="display:none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>CHỌN TRANG BỊ</h2>
                    <span class="close-modal-btn" onclick="closeEquipModal()">×</span>
                </div>
                <div class="modal-body" id="equipModalGrid">
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', equipModalHtml);
    }
}

function openEquipModal(fleetIndex, slotIndex) {
    selectingSlotIndex = fleetIndex;
    selectingEquipSlotIndex = slotIndex;
    
    let shipInfo = getShipTypeAndData(fleetState[fleetIndex].shipId);
    if (!shipInfo) return; // Bảo vệ an toàn

    // QUY TẮC PHÂN BỔ SLOT TRANG BỊ
    let allowedCategories = [];
    if (slotIndex === 5) {
        allowedCategories = ["Augmentation"];
    } else if (slotIndex === 3 || slotIndex === 4) {
        allowedCategories = ["Auxiliary"];
    } else {
        // Cắt tối đa 3 mảng đầu tiên để áp dụng cho ô 0, 1, 2
        let mainSlots = shipInfo.data.equipSlot.slice(0, 3);
        allowedCategories = mainSlots[slotIndex] || [];
    }

    // Lấy danh sách các ID trang bị có limit: 1 mà tàu này ĐÃ ĐƯỢC CHỌN ở các slot khác (trừ slot hiện tại đang mở)
    let currentEquips = fleetState[fleetIndex].equips;
    let limitedEquipsSelected = new Set();
    currentEquips.forEach((eq, idx) => {
        if (eq && idx !== slotIndex) {
            let eqData = window.equipDetails[eq.category] && window.equipDetails[eq.category][eq.id];
            if (eqData && eqData.limit === 1) {
                limitedEquipsSelected.add(eq.id);
            }
        }
    });

    // HTML Nút Bỏ chọn trang bị
    let gridHtml = `
        <div class="ship-item-wrapper" onmouseleave="handleItemLeave(this)">
            <div class="modal-ship-icon box-grey" onclick="selectEquip(null, null)" style="display:flex; justify-content:center; align-items:center;"
                 onmouseenter="handleIconHover(this, true)">
                <span style="font-size: 96px; color: #e74c3c; font-weight: 300; display: inline-block; transform: rotate(45deg);">+</span>
            </div>
            <div class="ship-name-box" onmouseenter="handleNameHover(this, true)">
                <span class="ship-name-text">Bỏ chọn</span>
            </div>
        </div>
    `;

    // Lặp qua từng category được phép lắp ở slot này (Hỗ trợ 1 slot lắp nhiều loại đồ)
    allowedCategories.forEach(category => {
        if (window.equipDetails && window.equipDetails[category]) {
            for (let eqId in window.equipDetails[category]) {
                let eqData = window.equipDetails[category][eqId];
                
                // BỘ LỌC DÀNH CHO AUXILIARY VÀ AUGMENTATION
                if (category === "Auxiliary" || category === "Augmentation") {
                    // Nếu item có mảng equipable nhưng không chứa loại tàu hiện tại (VD: "CV") -> Bỏ qua
                    if (eqData.equipable && !eqData.equipable.includes(shipInfo.type)) {
                        continue; 
                    }
                }

                let safeName = eqData.name.replace(/"/g, '&quot;');
                let iconUrl = `https://azurlane.netojuu.com/images/${eqData.code}.png`;
                let boxClass = eqData.box ? `box-${eqData.box}` : "box-grey";

                // Kiểm tra xem trang bị này có bị giới hạn (limit: 1) và đã được chọn trước đó chưa
                let isLimitedAndSelected = limitedEquipsSelected.has(eqId);
                let itemClass = isLimitedAndSelected ? "modal-ship-icon equip-disabled" : `modal-ship-icon ${boxClass}`;
                let clickAction = isLimitedAndSelected ? "" : `onclick="selectEquip('${eqId}', '${category}')"`;

                // Sử dụng lại class hiển thị của Ship để đảm bảo đồng bộ 100% UI
                gridHtml += `
                    <div class="ship-item-wrapper" onmouseleave="handleItemLeave(this)">
                        <div class="${itemClass}" title="${safeName}" ${clickAction}
                             onmouseenter="handleIconHover(this, true)">
                            <img src="${iconUrl}" class="modal-ship-image" alt="${safeName}">
                        </div>
                        <div class="ship-name-box" onmouseenter="handleNameHover(this, true)">
                            <span class="ship-name-text">${safeName}</span>
                        </div>
                    </div>
                `;
            }
        }
    });

    document.getElementById('equipModalGrid').innerHTML = gridHtml;
    document.getElementById('equipSelectionModal').style.display = "flex";
}

function selectEquip(eqId, category) {
    if (selectingSlotIndex !== -1 && selectingEquipSlotIndex !== -1) {
        if (eqId && category) {
            fleetState[selectingSlotIndex].equips[selectingEquipSlotIndex] = { id: eqId, category: category };
        } else {
            // Trường hợp bấm Bỏ chọn
            fleetState[selectingSlotIndex].equips[selectingEquipSlotIndex] = null;
        }
        saveFleetState(); // Lưu vào cache
        renderFleet();    // Cập nhật và hiển thị giao diện ngay lập tức
    }
    closeEquipModal();
}

function closeEquipModal() {
    let eqModal = document.getElementById('equipSelectionModal');
    if (eqModal) eqModal.style.display = "none";
    selectingEquipSlotIndex = -1;
}

// ==========================================
// CÁC HIỆU ỨNG VÀ EVENT CHUNG
// ==========================================

// Xử lý khi hover vào Icon: Kích hoạt phóng to, tính toán né viền màn hình và ngắt chữ chạy
function handleIconHover(iconEl, isHover) {
    const wrapper = iconEl.closest('.ship-item-wrapper');
    const nameBox = wrapper.querySelector('.ship-name-box');
    const textEl = wrapper.querySelector('.ship-name-text');
    const modalBody = wrapper.closest('.modal-body');

    if (isHover) {
        if (!iconEl.classList.contains('equip-disabled')) {
            wrapper.classList.add('is-hovered');
        } else {
            nameBox.style.width = 'max-content';
            nameBox.style.minWidth = '100%';
            nameBox.style.zIndex = '20';
        }

        textEl.classList.remove('marquee-run');
        nameBox.style.textAlign = 'center';

        const boxRect = nameBox.getBoundingClientRect();
        const modalRect = modalBody.getBoundingClientRect();
        let shiftX = 0;

        if (boxRect.right > modalRect.right) {
            shiftX = modalRect.right - boxRect.right - 10; 
        } else if (boxRect.left < modalRect.left) {
            shiftX = modalRect.left - modalRect.left + 10;   
        }
        nameBox.style.setProperty('--shift-x', `${shiftX}px`);
    }
}

// Xử lý khi hover vào Box Tên: Kích hoạt phóng to, chống tràn và chạy chữ với tốc độ đều đặn
function handleNameHover(nameBoxEl, isHover) {
    const wrapper = nameBoxEl.closest('.ship-item-wrapper');
    const textEl = wrapper.querySelector('.ship-name-text');
    const modalBody = wrapper.closest('.modal-body');

    if (isHover) {
        wrapper.classList.add('is-hovered');

        const boxRect = nameBoxEl.getBoundingClientRect();
        const modalRect = modalBody.getBoundingClientRect();
        let shiftX = 0;

        if (boxRect.right > modalRect.right) {
            shiftX = modalRect.right - boxRect.right - 10; 
        } else if (boxRect.left < modalRect.left) {
            shiftX = modalRect.left - modalRect.left + 10;   
        }
        nameBoxEl.style.setProperty('--shift-x', `${shiftX}px`);

        const overflow = textEl.scrollWidth - nameBoxEl.clientWidth + 6; 
        if (overflow > 0) {
            const duration = Math.max(2, overflow / 30);
            
            textEl.style.setProperty('--scroll-dist', `-${overflow}px`);
            textEl.style.setProperty('--scroll-duration', `${duration}s`);
            textEl.classList.add('marquee-run');
            nameBoxEl.style.textAlign = 'left';
        }
    }
}

// Xử lý khi chuột rời khỏi toàn bộ thẻ bọc ngoài (Wrapper)
function handleItemLeave(wrapper) {
    const nameBox = wrapper.querySelector('.ship-name-box');
    const textEl = wrapper.querySelector('.ship-name-text');

    wrapper.classList.remove('is-hovered');
    nameBox.style.removeProperty('width');
    nameBox.style.removeProperty('min-width');
    nameBox.style.removeProperty('z-index');
    textEl.classList.remove('marquee-run');
    nameBox.style.textAlign = 'center'; 
    nameBox.style.removeProperty('--shift-x');
}

// Bấm ra ngoài khoảng đen để tắt Modal
window.onclick = function(event) {
    if (event.target === shipModal) closeShipModal();
    
    let eqModal = document.getElementById('equipSelectionModal');
    if (eqModal && event.target === eqModal) closeEquipModal();
};

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initFleetBuilder);
} else {
    initFleetBuilder();
}