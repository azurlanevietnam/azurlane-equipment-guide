const fleetContainer = document.getElementById('fleet-builder-container');
const shipModal = document.getElementById('shipSelectionModal');
const shipModalGrid = document.getElementById('shipModalGrid');

// Trạng thái của 3 vị trí tàu trong đội hình
let fleetState = loadFleetState();

let selectingSlotIndex = -1; // Vị trí hàng tàu
let selectingEquipSlotIndex = -1; // Vị trí ô trang bị (0 - 5)

function initFleetBuilder() {
    injectEquipModal(); // Tự động tạo popup chọn trang bị vào DOM
    injectConfirmModal(); // Tự động tạo popup xác nhận reset
    injectResetButton(); // Tự động tạo nút Reset vào bên dưới
    
    waitForDataAndRender();
}

function waitForDataAndRender() {
    const checkDataReady = setInterval(() => {
        if (window.shipDetails && window.equipDetails && Object.keys(window.equipDetails).length > 0) {
            clearInterval(checkDataReady);
            renderFleet();
        }
    }, 50);
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

function getDefaultShipSettings() {
    try {
        const savedDefault = localStorage.getItem('azur_lane_ship_defaults');
        if (savedDefault) return JSON.parse(savedDefault);
    } catch (e) {}
    return { level: 1, affinity: 'Stranger' };
}

function saveDefaultShipSettings(level, affinity) {
    try {
        localStorage.setItem('azur_lane_ship_defaults', JSON.stringify({ level, affinity }));
    } catch (e) {}
}

function getDefaultEquipEnhance() {
    try {
        const savedDefault = localStorage.getItem('azur_lane_equip_default_enhance');
        if (savedDefault !== null) return parseInt(savedDefault, 10);
    } catch (e) {}
    return 0;
}

function saveDefaultEquipEnhance(enhanceLevel) {
    try {
        localStorage.setItem('azur_lane_equip_default_enhance', enhanceLevel.toString());
    } catch (e) {}
}

function loadFleetState() {
    const defaultShipSettings = getDefaultShipSettings();
    try {
        const saved = localStorage.getItem('azur_lane_fleet_state');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length === 3) {
                return parsed.map(slot => ({
                    shipId: slot.shipId || null,
                    level: slot.level !== undefined ? slot.level : defaultShipSettings.level,
                    affinity: slot.affinity || defaultShipSettings.affinity,
                    equips: Array.isArray(slot.equips) ? slot.equips.map(eq => {
                        if (!eq) return null;
                        return {
                            id: eq.id,
                            category: eq.category,
                            enhance: eq.enhance !== undefined ? eq.enhance : 0
                        };
                    }) : [null, null, null, null, null, null]
                }));
            }
        }
    } catch (e) {
        console.error("Không thể đọc cache đội hình:", e);
    }
    
    return [
        { shipId: null, level: defaultShipSettings.level, affinity: defaultShipSettings.affinity, equips: [null, null, null, null, null, null] },
        { shipId: null, level: defaultShipSettings.level, affinity: defaultShipSettings.affinity, equips: [null, null, null, null, null, null] },
        { shipId: null, level: defaultShipSettings.level, affinity: defaultShipSettings.affinity, equips: [null, null, null, null, null, null] }
    ];
}

// ==========================================
// POPUP XÁC NHẬN RESET ĐỘI HÌNH
// ==========================================
function injectConfirmModal() {
    if (!document.getElementById('confirmResetModal')) {
        const confirmModalHtml = `
        <div id="confirmResetModal" class="modal-overlay" style="display:none;">
            <div class="modal-content reset-modal-content">
                <div class="modal-header">
                    <h2>XÁC NHẬN RESET</h2>
                    <span class="close-modal-btn" onclick="closeConfirmModal()">×</span>
                </div>
                <div class="modal-body reset-modal-body">
                    <p>Bạn có chắc chắn muốn xóa toàn bộ đội hình, trang bị và đưa thiết lập mặc định về ban đầu không?</p>
                    <div class="reset-modal-actions">
                        <button class="reset-confirm-btn" onclick="executeResetFleet()">Đồng ý</button>
                        <button class="reset-cancel-btn" onclick="closeConfirmModal()">Hủy</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', confirmModalHtml);
    }
}

function openConfirmModal() {
    const modal = document.getElementById('confirmResetModal');
    if (modal) modal.style.display = 'flex';
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmResetModal');
    if (modal) modal.style.display = 'none';
}

function executeResetFleet() {
    saveDefaultShipSettings(1, 'Stranger');
    saveDefaultEquipEnhance(0);

    fleetState = [
        { shipId: null, level: 1, affinity: 'Stranger', equips: [null, null, null, null, null, null] },
        { shipId: null, level: 1, affinity: 'Stranger', equips: [null, null, null, null, null, null] },
        { shipId: null, level: 1, affinity: 'Stranger', equips: [null, null, null, null, null, null] }
    ];

    saveFleetState();
    renderFleet();
    closeConfirmModal();
}

function injectResetButton() {
    if (!document.getElementById('fleetResetBtn')) {
        const resetBtnHtml = `
        <div style="display: flex; justify-content: center; margin-top: 15px;">
            <button id="fleetResetBtn" onclick="openConfirmModal()" style="
                background-color: #e74c3c; color: white; border: none; padding: 10px 20px;
                font-size: 14px; font-weight: bold; letter-spacing: 1px; cursor: pointer;
                border-radius: 4px; transition: background 0.2s;
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

function getShipTypeAndData(shipId) {
    if (!window.shipDetails) return null;
    for (let type in window.shipDetails) {
        if (window.shipDetails[type][shipId]) {
            return { type: type, data: window.shipDetails[type][shipId] };
        }
    }
    return null;
}

function getShipIconUrl(shipId, shipData) {
    if (shipId.endsWith('_kai')) {
        return `https://cdn.nagami.moe/squareicon/${shipData.code}.png`;
    } else {
        const formattedName = shipData.name.replace(/ /g, '_');
        return `https://azurlane.netojuu.com/images/${shipData.code}/${formattedName}Icon.png`;
    }
}

function getAffinityDisplay(affinityKey) {
    switch (affinityKey) {
        case 'Stranger': return '50♥';
        case 'Friendly': return '61♥';
        case 'Crush':    return '81♥';
        case 'Love':     return '100♥';
        case 'Oath':     return '100💍';
        case 'Oath200':  return '200💍';
        default:         return '50♥';
    }
}

function getMaxEnhanceByBox(boxColor, category) {
    if (category === "Augmentation") return 10;
    switch (boxColor) {
        case 'rainbow':
        case 'yellow': return 13;
        case 'purple':  return 11;
        case 'blue':    return 7;
        case 'grey':    return 3;
        default:        return 13;
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
        
        // 1. Box Tàu
        if (shipInfo) {
            let iconUrl = getShipIconUrl(slot.shipId, shipInfo.data);
            let boxClass = shipInfo.data.box ? `box-${shipInfo.data.box}` : "box-grey";
            let affText = getAffinityDisplay(slot.affinity || 'Stranger');
            let shipLevel = slot.level !== undefined ? slot.level : 1;

            shipHtml = `<div class="square-slot ship-slot ${boxClass}" onclick="openShipModal(${index})">
                            <span class="ship-badge-level">Lv.${shipLevel}</span>
                            <span class="ship-badge-affinity">${affText}</span>
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
            
            let slotInfoBadge = "";
            if (isShipSelected && i < 3 && shipInfo.data) {
                let rawEff = (shipInfo.data.slotEff && shipInfo.data.slotEff[i]) ? shipInfo.data.slotEff[i] : "";
                let effVal = rawEff.toString().replace('%', '');
                let amountVal = (shipInfo.data.slotAmount && shipInfo.data.slotAmount[i]) ? shipInfo.data.slotAmount[i] : "";

                if (effVal || amountVal) {
                    slotInfoBadge = `
                        <span class="equip-slot-info-badge">
                            <span class="eff-line">${effVal}%</span>
                            <span class="amount-line">x${amountVal}</span>
                        </span>
                    `;
                }
            }

            if (isShipSelected && eqSave && eqSave.id && window.equipDetails[eqSave.category] && window.equipDetails[eqSave.category][eqSave.id]) {
                let eqData = window.equipDetails[eqSave.category][eqSave.id];
                let boxClass = eqData.box ? `box-${eqData.box}` : "box-grey";
                let iconUrl = `https://azurlane.netojuu.com/images/${eqData.code}.png`;
                let enhanceVal = eqSave.enhance !== undefined ? eqSave.enhance : 0;
                
                equipsHtml += `
                    <div class="square-slot equip-slot ${boxClass}" onclick="openEquipModal(${index}, ${i})">
                        <span class="equip-badge-enhance">+${enhanceVal}</span>
                        ${slotInfoBadge}
                        <img src="${iconUrl}" class="slot-image">
                    </div>
                `;
            } else {
                let equipClass = isShipSelected ? "box-grey" : "disabled"; 
                let onClickEvent = isShipSelected ? `onclick="openEquipModal(${index}, ${i})"` : "";

                equipsHtml += `
                    <div class="square-slot equip-slot ${equipClass}" ${onClickEvent}>
                        ${slotInfoBadge}
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
    
    const defaultSettings = getDefaultShipSettings();
    let currentSlot = fleetState[slotIndex];

    let curLevel = defaultSettings.level;
    let curAffinity = defaultSettings.affinity;

    currentSlot.level = curLevel;
    currentSlot.affinity = curAffinity;

    // Đã thêm onwheel="handleLevelInputWheel(event)"
    let controlsHtml = `
        <div class="ship-modal-controls">
            <!-- 1. Hàng Affinity -->
            <div class="control-group">
                <label>Affinity:</label>
                <div class="affinity-btn-group">
                    <button type="button" class="aff-btn ${curAffinity === 'Stranger' ? 'active' : ''}" onclick="selectAffinity('Stranger', event)">Stranger</button>
                    <button type="button" class="aff-btn ${curAffinity === 'Friendly' ? 'active' : ''}" onclick="selectAffinity('Friendly', event)">Friendly</button>
                    <button type="button" class="aff-btn ${curAffinity === 'Crush' ? 'active' : ''}" onclick="selectAffinity('Crush', event)">Crush</button>
                    <button type="button" class="aff-btn ${curAffinity === 'Love' ? 'active' : ''}" onclick="selectAffinity('Love', event)">Love</button>
                    <button type="button" class="aff-btn ${curAffinity === 'Oath' ? 'active' : ''}" onclick="selectAffinity('Oath', event)">Oath</button>
                    <button type="button" class="aff-btn ${curAffinity === 'Oath200' ? 'active' : ''}" onclick="selectAffinity('Oath200', event)">Oath (200)</button>
                </div>
            </div>
            <!-- 2. Hàng Level + Nút Đặt làm mặc định -->
            <div class="control-group">
                <label>Level:</label>
                <input type="number" id="shipLevelInput" min="1" max="125" value="${curLevel}" 
                       onchange="handleLevelInputChange(this.value)"
                       onwheel="handleLevelInputWheel(event)">
                <input type="range" id="shipLevelRange" min="1" max="125" value="${curLevel}" oninput="handleLevelRangeChange(this.value)">
                <button type="button" class="set-default-btn" onclick="handleSetDefaultSettings()">Đặt làm mặc định</button>
            </div>
        </div>
    `;

    let gridHtml = `
        <div class="ship-item-wrapper" onmouseleave="handleItemLeave(this)">
            <div class="modal-ship-icon box-grey" onclick="selectShip(null)" style="display:flex; justify-content:center; align-items:center;"
                 onmouseenter="handleIconHover(this, true)">
                <span style="font-size: 80px; color: #e74c3c; font-weight: 300; display: flex; align-items: center; justify-content: center; transform: rotate(45deg) translate(0px, -1px); line-height: 1;">+</span>
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
    
    shipModalGrid.innerHTML = controlsHtml + `<div class="ship-grid-list">${gridHtml}</div>`;
    shipModal.style.display = "flex";
}

function handleLevelRangeChange(val) {
    let num = parseInt(val, 10);
    document.getElementById('shipLevelInput').value = num;
    if (selectingSlotIndex !== -1) {
        fleetState[selectingSlotIndex].level = num;
        saveFleetState();
        renderFleet();
    }
}

function handleLevelInputChange(val) {
    let inputEl = document.getElementById('shipLevelInput');
    let rangeEl = document.getElementById('shipLevelRange');
    let num = parseInt(val, 10);

    if (isNaN(num)) {
        inputEl.value = fleetState[selectingSlotIndex].level;
        return;
    }

    if (num < 1) num = 1;
    if (num > 125) num = 125;

    inputEl.value = num;
    rangeEl.value = num;

    if (selectingSlotIndex !== -1) {
        fleetState[selectingSlotIndex].level = num;
        saveFleetState();
        renderFleet();
    }
}

// Hàm lăn chuột tăng/giảm Level Tàu
function handleLevelInputWheel(e) {
    e.preventDefault(); // Tránh cuộn toàn bộ trang web
    let currentVal = parseInt(e.target.value, 10) || 1;
    if (e.deltaY < 0) {
        currentVal += 1; // Cuộn lên -> Tăng
    } else {
        currentVal -= 1; // Cuộn xuống -> Giảm
    }
    handleLevelInputChange(currentVal);
}

function selectAffinity(affKey, evt) {
    if (selectingSlotIndex !== -1) {
        fleetState[selectingSlotIndex].affinity = affKey;
        saveFleetState();
        renderFleet();

        const btns = document.querySelectorAll('.aff-btn');
        btns.forEach(btn => btn.classList.remove('active'));
        if (evt && evt.target) {
            evt.target.classList.add('active');
        }
    }
}

function handleSetDefaultSettings() {
    if (selectingSlotIndex !== -1) {
        const curLevel = fleetState[selectingSlotIndex].level || 1;
        const curAff = fleetState[selectingSlotIndex].affinity || 'Stranger';
        
        saveDefaultShipSettings(curLevel, curAff);
        saveFleetState();
        renderFleet();
        closeShipModal();
    }
}

function selectShip(shipId) {
    if (selectingSlotIndex !== -1) {
        if (fleetState[selectingSlotIndex].shipId !== shipId) {
            fleetState[selectingSlotIndex].shipId = shipId;
            fleetState[selectingSlotIndex].equips = [null, null, null, null, null, null];
        }
        saveFleetState();
        renderFleet();
    }
    closeShipModal();
}

function closeShipModal() {
    shipModal.style.display = "none";
    selectingSlotIndex = -1;
}

// ==========================================
// ĐIỀU KHIỂN POPUP CHỌN TRANG BỊ & ENHANCE
// ==========================================
let currentEquipEnhanceVal = 0;

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
    if (!shipInfo) return;

    let allowedCategories = [];
    if (slotIndex === 5) {
        allowedCategories = ["Augmentation"];
    } else if (slotIndex === 3 || slotIndex === 4) {
        allowedCategories = ["Auxiliary"];
    } else {
        let mainSlots = shipInfo.data.equipSlot.slice(0, 3);
        allowedCategories = mainSlots[slotIndex] || [];
    }

    let existingEquip = fleetState[fleetIndex].equips[slotIndex];
    if (existingEquip && existingEquip.enhance !== undefined) {
        currentEquipEnhanceVal = existingEquip.enhance;
    } else {
        currentEquipEnhanceVal = getDefaultEquipEnhance();
    }

    // Đã thêm onwheel="handleEquipEnhanceInputWheel(event)"
    let controlsHtml = `
        <div class="ship-modal-controls">
            <div class="control-group">
                <label>Enhance:</label>
                <input type="number" id="equipEnhanceInput" min="0" max="13" value="${currentEquipEnhanceVal}" 
                       onchange="handleEquipEnhanceInputChange(this.value)"
                       onwheel="handleEquipEnhanceInputWheel(event)">
                <input type="range" id="equipEnhanceRange" min="0" max="13" value="${currentEquipEnhanceVal}" oninput="handleEquipEnhanceRangeChange(this.value)">
                <button type="button" class="set-default-btn" onclick="handleSetDefaultEquipEnhance()">Đặt làm mặc định</button>
            </div>
        </div>
    `;

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

    let gridHtml = `
        <div class="ship-item-wrapper" onmouseleave="handleItemLeave(this)">
            <div class="modal-ship-icon box-grey" onclick="selectEquip(null, null)" style="display:flex; justify-content:center; align-items:center;"
                 onmouseenter="handleIconHover(this, true)">
                <span style="font-size: 80px; color: #e74c3c; font-weight: 300; display: flex; align-items: center; justify-content: center; transform: rotate(45deg) translate(0px, -1px); line-height: 1;">+</span>
            </div>
            <div class="ship-name-box" onmouseenter="handleNameHover(this, true)">
                <span class="ship-name-text">Bỏ chọn</span>
            </div>
        </div>
    `;

    allowedCategories.forEach(category => {
        if (window.equipDetails && window.equipDetails[category]) {
            for (let eqId in window.equipDetails[category]) {
                let eqData = window.equipDetails[category][eqId];
                
                if (category === "Auxiliary" || category === "Augmentation") {
                    if (eqData.equippable && !eqData.equippable.includes(shipInfo.type)) {
                        continue; 
                    }
                }

                let safeName = eqData.name.replace(/"/g, '&quot;');
                let iconUrl = `https://azurlane.netojuu.com/images/${eqData.code}.png`;
                let boxClass = eqData.box ? `box-${eqData.box}` : "box-grey";

                let isLimitedAndSelected = limitedEquipsSelected.has(eqId);
                let itemClass = isLimitedAndSelected ? "modal-ship-icon equip-disabled" : `modal-ship-icon ${boxClass}`;
                let clickAction = isLimitedAndSelected ? "" : `onclick="selectEquip('${eqId}', '${category}')"`;

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

    document.getElementById('equipModalGrid').innerHTML = controlsHtml + `<div class="ship-grid-list">${gridHtml}</div>`;
    document.getElementById('equipSelectionModal').style.display = "flex";
}

function handleEquipEnhanceRangeChange(val) {
    currentEquipEnhanceVal = parseInt(val, 10);
    document.getElementById('equipEnhanceInput').value = currentEquipEnhanceVal;
}

function handleEquipEnhanceInputChange(val) {
    let inputEl = document.getElementById('equipEnhanceInput');
    let rangeEl = document.getElementById('equipEnhanceRange');
    let num = parseInt(val, 10);

    if (isNaN(num)) {
        inputEl.value = currentEquipEnhanceVal;
        return;
    }

    if (num < 0) num = 0;
    if (num > 13) num = 13;

    currentEquipEnhanceVal = num;
    inputEl.value = num;
    rangeEl.value = num;
}

// Hàm lăn chuột tăng/giảm Enhance Trang bị
function handleEquipEnhanceInputWheel(e) {
    e.preventDefault(); // Tránh cuộn toàn bộ trang web
    let currentVal = parseInt(e.target.value, 10) || 0;
    if (e.deltaY < 0) {
        currentVal += 1; // Cuộn lên -> Tăng
    } else {
        currentVal -= 1; // Cuộn xuống -> Giảm
    }
    handleEquipEnhanceInputChange(currentVal);
}

function handleSetDefaultEquipEnhance() {
    saveDefaultEquipEnhance(currentEquipEnhanceVal);

    if (selectingSlotIndex !== -1 && selectingEquipSlotIndex !== -1) {
        let currentEq = fleetState[selectingSlotIndex].equips[selectingEquipSlotIndex];
        if (currentEq && currentEq.id) {
            let eqData = window.equipDetails[currentEq.category] && window.equipDetails[currentEq.category][currentEq.id];
            let maxEnhance = eqData ? getMaxEnhanceByBox(eqData.box, currentEq.category) : 13;

            currentEq.enhance = Math.min(currentEquipEnhanceVal, maxEnhance);
            saveFleetState();
            renderFleet();
        }
    }

    closeEquipModal();
}

function selectEquip(eqId, category) {
    if (selectingSlotIndex !== -1 && selectingEquipSlotIndex !== -1) {
        if (eqId && category) {
            let eqData = window.equipDetails[category] && window.equipDetails[category][eqId];
            let maxEnhance = eqData ? getMaxEnhanceByBox(eqData.box, category) : 13;
            
            let finalEnhance = Math.min(currentEquipEnhanceVal, maxEnhance);

            fleetState[selectingSlotIndex].equips[selectingEquipSlotIndex] = { 
                id: eqId, 
                category: category,
                enhance: finalEnhance
            };
        } else {
            fleetState[selectingSlotIndex].equips[selectingEquipSlotIndex] = null;
        }
        saveFleetState();
        renderFleet();
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

window.onclick = function(event) {
    if (event.target === shipModal) closeShipModal();
    let eqModal = document.getElementById('equipSelectionModal');
    if (eqModal && event.target === eqModal) closeEquipModal();

    let confirmModal = document.getElementById('confirmResetModal');
    if (confirmModal && event.target === confirmModal) closeConfirmModal();
};

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initFleetBuilder);
} else {
    initFleetBuilder();
}