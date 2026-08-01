const fleetContainer = document.getElementById('fleet-builder-container');
const shipModal = document.getElementById('shipSelectionModal');
const shipModalGrid = document.getElementById('shipModalGrid');

// Trạng thái của 9 vị trí tàu trong 3 bảng đội hình (Mỗi bảng 3 hàng)
let fleetState = loadFleetState();

let selectingSlotIndex = -1; // Vị trí hàng tàu (0 - 8)
let selectingEquipSlotIndex = -1; // Vị trí ô trang bị (0 - 5)

// ==========================================
// TRẠNG THÁI BỘ LỌC TÀU
// ==========================================
let shipFilterFaction = new Set(['ALL']);
let shipFilterType = new Set(['ALL']);
let shipFilterRarity = new Set(['ALL']);
let isShipFilterOpen = false;

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
            if (Array.isArray(parsed) && parsed.length === 9) {
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
    
    let defaultSlots = [];
    for (let i = 0; i < 9; i++) {
        defaultSlots.push({
            shipId: null,
            level: defaultShipSettings.level,
            affinity: defaultShipSettings.affinity,
            equips: [null, null, null, null, null, null]
        });
    }
    return defaultSlots;
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
    if (modal) {
        modal.style.display = 'flex';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmResetModal');
    if (modal) {
        modal.style.display = 'none';
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }
}

function executeResetFleet() {
    saveDefaultShipSettings(1, 'Stranger');
    saveDefaultEquipEnhance(0);

    let defaultShipSettings = { level: 1, affinity: 'Stranger' };
    fleetState = [];
    for (let i = 0; i < 9; i++) {
        fleetState.push({
            shipId: null,
            level: defaultShipSettings.level,
            affinity: defaultShipSettings.affinity,
            equips: [null, null, null, null, null, null]
        });
    }

    saveFleetState();
    renderFleet();
    closeConfirmModal();
}

function injectResetButton() {
    if (!document.getElementById('fleetResetBtn')) {
        const resetBtnHtml = `
        <div style="display: flex; justify-content: center; margin-top: 25px;">
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

function getMaxEnhanceByBox(boxColor) {
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
// HÀM BÙ PADDING-RIGHT CHỐNG DỊCH CHUYỂN LAYOUT
// ==========================================
function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
}

function applyAntiShiftPadding(isModalOpen) {
    const mainContainer = document.querySelector('.container');
    const topNavbar = document.querySelector('.top-navbar');
    const scrollbarWidth = isModalOpen ? getScrollbarWidth() : 0;

    if (mainContainer) {
        mainContainer.style.paddingRight = isModalOpen ? `${scrollbarWidth}px` : '';
    }
    if (topNavbar) {
        topNavbar.style.paddingRight = isModalOpen ? `${30 + scrollbarWidth}px` : '';
    }
}

// ==========================================
// RENDER GIAO DIỆN CHÍNH (3 FLEET BOX WRAPPER - TỔNG 9 HÀNG)
// ==========================================
function renderFleet() {
    let fullHtml = "";

    for (let group = 0; group < 3; group++) {
        let groupRowsHtml = "";
        
        for (let rowInGroup = 0; rowInGroup < 3; rowInGroup++) {
            let index = group * 3 + rowInGroup;
            let slot = fleetState[index];
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

                let slotInfoBadgeHtml = "";
                if (isShipSelected && shipInfo && shipInfo.data && i < 3) {
                    let eff = (shipInfo.data.slotEff && shipInfo.data.slotEff[i]) ? `${shipInfo.data.slotEff[i]}%` : "";
                    let amt = (shipInfo.data.slotAmount && shipInfo.data.slotAmount[i]) ? `x${shipInfo.data.slotAmount[i]}` : "";
                    
                    if (eff || amt) {
                        slotInfoBadgeHtml = `
                            <div class="equip-slot-info-badge">
                                ${eff ? `<span class="eff-line">${eff}</span>` : ''}
                                ${amt ? `<span class="amount-line">${amt}</span>` : ''}
                            </div>
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
                            ${slotInfoBadgeHtml}
                            <span class="equip-badge-enhance">+${enhanceVal}</span>
                            <img src="${iconUrl}" class="slot-image">
                        </div>
                    `;
                } else {
                    let equipClass = isShipSelected ? "box-grey" : "disabled"; 
                    let onClickEvent = isShipSelected ? `onclick="openEquipModal(${index}, ${i})"` : "";

                    equipsHtml += `
                        <div class="square-slot equip-slot ${equipClass}" ${onClickEvent}>
                            ${slotInfoBadgeHtml}
                            ${isShipSelected ? '<span class="plus-sign">+</span>' : ''}
                        </div>
                    `;
                }
            }

            groupRowsHtml += `<div class="fleet-row">${shipHtml}${equipsHtml}</div>`;
        }

        fullHtml += `<div class="fleet-box-wrapper">${groupRowsHtml}</div>`;
    }

    fleetContainer.innerHTML = fullHtml;
}

// ==========================================
// TẠO VÀ XỬ LÝ BỘ LỌC TÀU
// ==========================================
function toggleShipFilter(btnEl) {
    isShipFilterOpen = !isShipFilterOpen;
    const panel = document.getElementById('shipFilterPanel');
    if (panel) {
        panel.style.display = isShipFilterOpen ? 'flex' : 'none';
    }
    if (isShipFilterOpen) {
        btnEl.innerText = "Đóng Bộ Lọc ▲";
        btnEl.classList.add("active");
    } else {
        btnEl.innerText = "Mở Bộ Lọc ▼";
        btnEl.classList.remove("active");
    }
}

function buildShipFilterHtml() {
    const factions = [
        "Eagle Union", "Royal Navy", "Heavy Sakura", "Ironblood", 
        "Dragon Empery", "Sardegna Empire", "Northern Parliament", 
        "Iris Libre", "Vichya Dominion", "Kingdom of Tulipia", 
        "Liga de Pedrería", "META", "Tempesta", "Universal & Collab"
    ];

    const types = [
        { label: "Battlecruiser (BC)", code: "BC" },
        { label: "Battleship (BB)", code: "BB" },
        { label: "Aviation Battleship (BBV)", code: "BBV" },
        { label: "Aircraft Carrier (CV)", code: "CV" },
        { label: "Light Carrier (CVL)", code: "CVL" },
        { label: "Monitor (BM)", code: "BM" },
        { label: "Repair Ship (RS)", code: "RS" },
        { label: "Sailing Frigate M (SF)", code: "SF" }
    ];

    const rarities = [
        { label: "Decisive", code: "Decisive", cls: "rarity-decisive" },
        { label: "Ultra Rare", code: "Ultra Rare", cls: "rarity-ur" },
        { label: "Priority", code: "Priority", cls: "rarity-priority" },
        { label: "Super Rare", code: "Super Rare", cls: "rarity-sr" },
        { label: "Elite", code: "Elite", cls: "rarity-elite" },
        { label: "Rare", code: "Rare", cls: "rarity-rare" },
        { label: "Normal", code: "Normal", cls: "rarity-normal" }
    ];

    let factionBtns = `<button type="button" class="filter-btn ${shipFilterFaction.has('ALL') ? 'active' : ''}" onclick="selectShipFactionFilter('ALL')">Hiển Thị Tất Cả</button>`;
    factions.forEach(f => {
        const active = shipFilterFaction.has(f) ? 'active' : '';
        factionBtns += `<button type="button" class="filter-btn ${active}" onclick="selectShipFactionFilter('${f}')">${f}</button>`;
    });

    let typeBtns = `<button type="button" class="filter-btn ${shipFilterType.has('ALL') ? 'active' : ''}" onclick="selectShipTypeFilter('ALL')">Hiển Thị Tất Cả</button>`;
    types.forEach(t => {
        const active = shipFilterType.has(t.code) ? 'active' : '';
        typeBtns += `<button type="button" class="filter-btn ${active}" onclick="selectShipTypeFilter('${t.code}')">${t.label}</button>`;
    });

    let rarityBtns = `<button type="button" class="filter-btn ${shipFilterRarity.has('ALL') ? 'active' : ''}" onclick="selectShipRarityFilter('ALL')">Hiển Thị Tất Cả</button>`;
    rarities.forEach(r => {
        const active = shipFilterRarity.has(r.code) ? `active ${r.cls}` : '';
        rarityBtns += `<button type="button" class="filter-btn ${r.cls} ${active}" onclick="selectShipRarityFilter('${r.code}')">${r.label}</button>`;
    });

    return `
        <div id="shipFilterPanel" class="ship-filter-panel" style="display: ${isShipFilterOpen ? 'flex' : 'none'};">
            <div class="filter-section">
                <span class="filter-title">Theo Loại Tàu</span>
                <div class="filter-btn-group">${typeBtns}</div>
            </div>
            <div class="filter-section">
                <span class="filter-title">Theo Faction</span>
                <div class="filter-btn-group">${factionBtns}</div>
            </div>
            <div class="filter-section">
                <span class="filter-title">Theo Độ Hiếm</span>
                <div class="filter-btn-group">${rarityBtns}</div>
            </div>
        </div>
    `;
}

function selectShipFactionFilter(val) {
    if (val === 'ALL') {
        shipFilterFaction.clear();
        shipFilterFaction.add('ALL');
    } else {
        shipFilterFaction.delete('ALL');
        if (shipFilterFaction.has(val)) {
            shipFilterFaction.delete(val);
        } else {
            shipFilterFaction.add(val);
        }
        if (shipFilterFaction.size === 0) {
            shipFilterFaction.add('ALL');
        }
    }
    updateShipFilterUIAndGrid();
}

function selectShipTypeFilter(val) {
    if (val === 'ALL') {
        shipFilterType.clear();
        shipFilterType.add('ALL');
    } else {
        shipFilterType.delete('ALL');
        if (shipFilterType.has(val)) {
            shipFilterType.delete(val);
        } else {
            shipFilterType.add(val);
        }
        if (shipFilterType.size === 0) {
            shipFilterType.add('ALL');
        }
    }
    updateShipFilterUIAndGrid();
}

function selectShipRarityFilter(val) {
    if (val === 'ALL') {
        shipFilterRarity.clear();
        shipFilterRarity.add('ALL');
    } else {
        shipFilterRarity.delete('ALL');
        if (shipFilterRarity.has(val)) {
            shipFilterRarity.delete(val);
        } else {
            shipFilterRarity.add(val);
        }
        if (shipFilterRarity.size === 0) {
            shipFilterRarity.add('ALL');
        }
    }
    updateShipFilterUIAndGrid();
}

function updateShipFilterUIAndGrid() {
    const panel = document.getElementById('shipFilterPanel');
    if (panel) {
        panel.outerHTML = buildShipFilterHtml();
    }
    renderShipListOnly();
}

function isShipMatchingFilter(shipCatKey, shipData) {
    if (!shipFilterFaction.has('ALL')) {
        let shipFaction = shipData.faction || '';
        let matchedFaction = false;
        
        for (let f of shipFilterFaction) {
            if (f === "Universal & Collab") {
                if (shipFaction === "Universal" || shipFaction === "Collab" || shipFaction === "Universal & Collab") {
                    matchedFaction = true;
                    break;
                }
            } else if (shipFaction === f) {
                matchedFaction = true;
                break;
            }
        }
        if (!matchedFaction) return false;
    }

    if (!shipFilterType.has('ALL')) {
        let catKeyUpper = (shipCatKey || '').toUpperCase();
        let matchedType = false;
        
        for (let t of shipFilterType) {
            let filterTypeUpper = t.toUpperCase();
            if (catKeyUpper === filterTypeUpper) {
                matchedType = true;
                break;
            }
            if (filterTypeUpper === "RS" && catKeyUpper === "AR") matchedType = true;
            if (filterTypeUpper === "SF" && catKeyUpper === "IX") matchedType = true;
        }
        if (!matchedType) return false;
    }

    if (!shipFilterRarity.has('ALL')) {
        let shipRarity = shipData.rarity || '';
        let matchedRarity = false;
        
        for (let r of shipFilterRarity) {
            if (shipRarity.toLowerCase() === r.toLowerCase()) {
                matchedRarity = true;
                break;
            }
        }
        if (!matchedRarity) return false;
    }

    return true;
}

// HÀM QUY ĐỔI ĐỘ HIẾM THÀNH THỨ BẬC CẤP ĐỘ
function getRarityTierRank(rarityStr) {
    if (!rarityStr) return 99;
    const r = rarityStr.toLowerCase();
    
    // Cấp 0: Gộp chung Decisive & Ultra Rare
    if (r === 'decisive' || r === 'ultra rare') return 0;
    
    // Cấp 1: Gộp chung Priority & Super Rare
    if (r === 'priority' || r === 'super rare') return 1;
    
    // Các cấp độ tiếp theo
    if (r === 'elite') return 2;
    if (r === 'rare') return 3;
    if (r === 'normal') return 4;
    
    return 99;
}

function renderShipListOnly() {
    let gridListEl = document.querySelector('.ship-grid-list');
    if (!gridListEl) return;

    let gridHtml = `
        <div class="ship-item-wrapper" onmouseleave="handleItemLeave(this)">
            <div class="modal-ship-icon box-grey" onclick="selectShip(null)" style="display:flex; justify-content:center; align-items:center;"
                 onmouseenter="handleIconHover(this, true)">
                <span style="font-size: 80px; color: #e74c3c; font-weight: 300; display: flex; align-items: center; justify-content: center; transform: rotate(45deg); line-height: 1;">+</span>
            </div>
            <div class="ship-name-box" onmouseenter="handleNameHover(this, true)">
                <span class="ship-name-text">Bỏ chọn</span>
            </div>
        </div>
    `;

    const factionOrder = [
        "Eagle Union", "Royal Navy", "Heavy Sakura", "Ironblood", 
        "Dragon Empery", "Sardegna Empire", "Northern Parliament", 
        "Iris Libre", "Vichya Dominion", "Kingdom of Tulipia", 
        "Liga de Pedrería", "META", "Tempesta", "Universal", "Collab", "Universal & Collab"
    ];
    const typeOrder = ["BC", "BB", "BBV", "CV", "CVL", "BM", "RS", "AR", "SF", "IX"];

    let allShipsList = [];
    if (window.shipDetails) {
        for (let cat in window.shipDetails) {
            for (let shipId in window.shipDetails[cat]) {
                let shipData = window.shipDetails[cat][shipId];
                if (isShipMatchingFilter(cat, shipData)) {
                    allShipsList.push({ id: shipId, cat: cat, data: shipData, displayName: shipData.name });
                }
            }
        }
    }

    // LOGIC SẮP XẾP ĐÃ ĐƯỢC CẬP NHẬT GỘP NÓM ĐỘ HIẾM
    allShipsList.sort((a, b) => {
        // 1. Theo Nhóm Độ Hiếm (Decisive+UR -> Priority+SR -> Elite -> Rare -> Normal)
        let rA = getRarityTierRank(a.data.rarity);
        let rB = getRarityTierRank(b.data.rarity);
        if (rA !== rB) return rA - rB;

        // 2. Theo Faction
        let fA = factionOrder.indexOf(a.data.faction);
        let fB = factionOrder.indexOf(b.data.faction);
        if (fA === -1) fA = 99;
        if (fB === -1) fB = 99;
        if (fA !== fB) return fA - fB;

        // 3. Theo Loại Tàu (Type)
        let tA = typeOrder.indexOf(a.cat.toUpperCase());
        let tB = typeOrder.indexOf(b.cat.toUpperCase());
        if (tA === -1) tA = 99;
        if (tB === -1) tB = 99;
        if (tA !== tB) return tA - tB;

        // 4. Theo Bảng Chữ Cái (A-Z)
        return a.displayName.localeCompare(b.displayName);
    });

    allShipsList.forEach(item => {
        let shipId = item.id;
        let shipData = item.data;
        let iconUrl = getShipIconUrl(shipId, shipData);
        let safeName = item.displayName.replace(/"/g, '&quot;');
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
    });

    gridListEl.innerHTML = gridHtml;
}

// ==========================================
// ĐIỀU KHIỂN POPUP CHỌN TÀU
// ==========================================
function openShipModal(slotIndex) {
    selectingSlotIndex = slotIndex;
    
    const defaultSettings = getDefaultShipSettings();
    let currentSlot = fleetState[slotIndex];

    let curLevel = currentSlot.level !== undefined ? currentSlot.level : defaultSettings.level;
    let curAffinity = currentSlot.affinity || defaultSettings.affinity;

    const shipModalHeaderActions = shipModal.querySelector('.modal-header-actions');
    if (shipModalHeaderActions) {
        shipModalHeaderActions.innerHTML = `
            <button type="button" class="filter-toggle-btn ${isShipFilterOpen ? 'active' : ''}" onclick="toggleShipFilter(this)">
                ${isShipFilterOpen ? 'Đóng Bộ Lọc ▲' : 'Mở Bộ Lọc ▼'}
            </button>
            <button type="button" class="modal-close-btn" onclick="closeShipModal()">Đóng</button>
        `;
    }

    let controlsHtml = `
        <div class="ship-modal-controls">
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
            <div class="control-group">
                <label>Level:</label>
                <input type="number" id="shipLevelInput" min="1" max="125" value="${curLevel}" onchange="handleLevelInputChange(this.value)">
                <input type="range" id="shipLevelRange" min="1" max="125" value="${curLevel}" oninput="handleLevelRangeChange(this.value)">
                <button type="button" class="set-default-btn" onclick="handleSetDefaultSettings()">Đặt làm mặc định</button>
            </div>
        </div>
    `;

    let filterHtml = buildShipFilterHtml();

    shipModalGrid.innerHTML = filterHtml + controlsHtml + `<div class="ship-grid-list"></div>`;
    renderShipListOnly();
    
    applyAntiShiftPadding(true);

    shipModal.style.display = "flex";
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
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

function resetShipFilterState() {
    isShipFilterOpen = false;
    shipFilterFaction = new Set(['ALL']);
    shipFilterType = new Set(['ALL']);
    shipFilterRarity = new Set(['ALL']);
}

function closeShipModal() {
    shipModal.style.display = "none";
    selectingSlotIndex = -1;
    
    resetShipFilterState();

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    applyAntiShiftPadding(false);
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
                    <div class="modal-header-actions">
                        <button type="button" class="filter-toggle-btn" onclick="toggleFilter(this)">Mở Bộ Lọc ▼</button>
                        <button type="button" class="modal-close-btn" onclick="closeEquipModal()">Đóng</button>
                    </div>
                </div>
                <div class="modal-body" id="equipModalGrid">
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', equipModalHtml);
    }
}

function toggleFilter(btnEl) {
    if (btnEl.innerText.includes("Mở")) {
        btnEl.innerText = "Đóng Bộ Lọc ▲";
        btnEl.classList.add("active");
    } else {
        btnEl.innerText = "Mở Bộ Lọc ▼";
        btnEl.classList.remove("active");
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

    let controlsHtml = `
        <div class="ship-modal-controls">
            <div class="control-group">
                <label>Enhance:</label>
                <input type="number" id="equipEnhanceInput" min="0" max="13" value="${currentEquipEnhanceVal}" onchange="handleEquipEnhanceInputChange(this.value)">
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
                <span style="font-size: 80px; color: #e74c3c; font-weight: 300; display: flex; align-items: center; justify-content: center; transform: rotate(45deg); line-height: 1;">+</span>
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
                    if (eqData.equipable && !eqData.equipable.includes(shipInfo.type)) {
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
    
    applyAntiShiftPadding(true);

    document.getElementById('equipSelectionModal').style.display = "flex";
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
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

function handleSetDefaultEquipEnhance() {
    saveDefaultEquipEnhance(currentEquipEnhanceVal);

    if (selectingSlotIndex !== -1 && selectingEquipSlotIndex !== -1) {
        let currentEq = fleetState[selectingSlotIndex].equips[selectingEquipSlotIndex];
        if (currentEq && currentEq.id) {
            let eqData = window.equipDetails[currentEq.category] && window.equipDetails[currentEq.category][currentEq.id];
            let maxEnhance = eqData ? getMaxEnhanceByBox(eqData.box) : 13;

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
            let maxEnhance = eqData ? getMaxEnhanceByBox(eqData.box) : 13;
            
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
    
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    applyAntiShiftPadding(false);
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