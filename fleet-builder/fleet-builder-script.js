const fleetContainer = document.getElementById('fleet-builder-container');
const shipModal = document.getElementById('shipSelectionModal');
const shipModalGrid = document.getElementById('shipModalGrid');

const MAX_FLEETS = 36; // Giới hạn tối đa 36 hạm đội

// Trạng thái mảng hạm đội động (Mỗi Fleet chứa 9 slot: 3 Main, 3 Vanguard, 3 Submarine)
let fleetState = loadFleetState();

let selectingSlotIndex = -1;
let selectingEquipSlotIndex = -1;

// ==========================================
// TRẠNG THÁI BỘ LỌC TÀU & TRANG BỊ
// ==========================================
let shipFilterFaction = new Set(['ALL']);
let shipFilterType = new Set(['ALL']);
let shipFilterRarity = new Set(['ALL']);
let isShipFilterOpen = false;

let equipFilterCategory = new Set(['ALL']);
let equipFilterFaction = new Set(['ALL']);
let equipFilterRarity = new Set(['ALL']);
let isEquipFilterOpen = false;

// Mã loại tàu phân khu
const VANGUARD_SHIP_TYPES = ["DD", "CL", "CA", "CB", "DDG", "AE", "IXv"];
const MAIN_SHIP_TYPES = ["BC", "BB", "BBV", "CV", "CVL", "BM", "DDG", "AR", "IXm"];
const SUBMARINE_SHIP_TYPES = ["SS", "SSV", "IXs"];

// Bảng ánh xạ mã Hằng số/Chuỗi viết tắt sang Tên Category chuẩn trong equipDetails
const MAP_EQUIP_CATEGORY = {
    "DDGM": "DD-gun",
    "CLGM": "CL-gun",
    "CAGM": "CA-gun",
    "CBGM": "CB-gun",
    "BBGM": "BB-gun",
    "AAGM": "AA-gun",
    "TRPM": "Surface Torpedo",
    "GMM": "Guided Missile",
    "FT": "Fighter",
    "DB": "Dive Bomber",
    "TB": "Torpedo Bomber",
    "SP": "Seaplane",
    "AUX": "Auxiliary",
    "AUG": "Augmentation"
};

// Hàm hỗ trợ tìm thông tin chi tiết của trang bị dựa vào Category hiển thị (hỗ trợ quét đệ quy các nhóm con)
function getEquipDataGlobal(category, eqId) {
    if (!eqId || !window.equipDetails) return null;

    let targetCat = category;
    if (category === "CA-gun" || category === "CB-gun") targetCat = "CA-gun";
    if (category === "Surface Torpedo" || category === "Guided Missile") targetCat = "Surface Torpedo";

    // 1. Thử tìm nhanh ở danh mục chỉ định
    if (targetCat && window.equipDetails[targetCat]) {
        let catContainer = window.equipDetails[targetCat];
        if (catContainer[eqId]) return catContainer[eqId];
    }

    // 2. Nếu trang bị nằm trong mảng con / nhóm lồng nhau, quét đệ quy toàn bộ window.equipDetails
    let foundData = null;
    let searchNested = (obj) => {
        if (foundData || !obj || typeof obj !== 'object') return;
        
        if (obj[eqId] && typeof obj[eqId] === 'object' && obj[eqId].name) {
            foundData = obj[eqId];
            return;
        }

        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                searchNested(obj[key]);
            }
        }
    };

    searchNested(window.equipDetails);
    return foundData;
}

function initFleetBuilder() {
    injectEquipModal();
    injectConfirmModal();
    injectResetButton();

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

function getSlotCategoryType(slotIndex) {
    let rowInGroup = slotIndex % 9;
    if (rowInGroup >= 6) return "SUB";
    if (rowInGroup >= 3) return "VANGUARD";
    return "MAIN";
}

function getFleetGroupIndex(slotIndex) {
    if (slotIndex < 0) return 0;
    return Math.floor(slotIndex / 9);
}

function saveFleetState() {
    try {
        localStorage.setItem('azur_lane_fleet_state_v4', JSON.stringify(fleetState));
    } catch (e) {
        console.error("Không thể lưu cache đội hình:", e);
    }
}

function getDefaultShipSettingsForFleet(fleetGroupIndex) {
    try {
        const savedDefault = localStorage.getItem(`azur_lane_ship_defaults_fleet_${fleetGroupIndex}`);
        if (savedDefault) return JSON.parse(savedDefault);
    } catch (e) { }
    return { level: 120, affinity: 'Love' };
}

function saveDefaultShipSettingsForFleet(fleetGroupIndex, level, affinity) {
    try {
        localStorage.setItem(`azur_lane_ship_defaults_fleet_${fleetGroupIndex}`, JSON.stringify({ level, affinity }));
    } catch (e) { }
}

function getDefaultEquipEnhanceForFleet(fleetGroupIndex) {
    try {
        const savedDefault = localStorage.getItem(`azur_lane_equip_default_enhance_fleet_${fleetGroupIndex}`);
        if (savedDefault !== null) return parseInt(savedDefault, 10);
    } catch (e) { }
    return 10;
}

function saveDefaultEquipEnhanceForFleet(fleetGroupIndex, enhanceLevel) {
    try {
        localStorage.setItem(`azur_lane_equip_default_enhance_fleet_${fleetGroupIndex}`, JSON.stringify(enhanceLevel));
    } catch (e) { }
}

function createEmptyFleetGroup(fleetGroupIndex) {
    const defaultSettings = getDefaultShipSettingsForFleet(fleetGroupIndex);
    let slots = [];
    for (let i = 0; i < 9; i++) {
        slots.push({
            shipId: null,
            level: defaultSettings.level,
            affinity: defaultSettings.affinity,
            equips: [null, null, null, null, null, null]
        });
    }
    return slots;
}

function loadFleetState() {
    try {
        const saved = localStorage.getItem('azur_lane_fleet_state_v4');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0 && parsed.length % 9 === 0) {
                return parsed.map((slot, idx) => {
                    const fleetGroup = getFleetGroupIndex(idx);
                    const defaultSettings = getDefaultShipSettingsForFleet(fleetGroup);
                    return {
                        shipId: slot.shipId || null,
                        level: slot.level !== undefined ? slot.level : defaultSettings.level,
                        affinity: slot.affinity || defaultSettings.affinity,
                        equips: Array.isArray(slot.equips) ? slot.equips.map(eq => {
                            if (!eq) return null;
                            return {
                                id: eq.id,
                                category: eq.category,
                                enhance: eq.enhance !== undefined ? eq.enhance : 0
                            };
                        }) : [null, null, null, null, null, null]
                    };
                });
            }
        }
    } catch (e) {
        console.error("Không thể đọc cache đội hình:", e);
    }

    return createEmptyFleetGroup(0);
}

// ==========================================
// QUẢN LÝ TÍNH NĂNG THÊM & XÓA HẠM ĐỘI
// ==========================================
function addNewFleet(insertAfterGroupIndex) {
    const totalFleets = Math.floor(fleetState.length / 9);

    if (totalFleets >= MAX_FLEETS) {
        console.warn(`Đã đạt giới hạn tối đa ${MAX_FLEETS} hạm đội!`);
        return;
    }

    const newGroupIndex = insertAfterGroupIndex + 1;
    const newFleetSlots = createEmptyFleetGroup(newGroupIndex);

    const insertPosition = newGroupIndex * 9;
    fleetState.splice(insertPosition, 0, ...newFleetSlots);

    saveFleetState();
    renderFleet();
}

function deleteFleet(groupIndexToDelete) {
    const totalFleets = Math.floor(fleetState.length / 9);

    if (totalFleets <= 1) {
        console.warn("Không thể xóa khi chỉ còn 1 hạm đội duy nhất!");
        return;
    }

    if (groupIndexToDelete < 0 || groupIndexToDelete >= totalFleets) {
        return;
    }

    const startPosition = groupIndexToDelete * 9;
    fleetState.splice(startPosition, 9);

    for (let g = groupIndexToDelete; g < totalFleets - 1; g++) {
        const nextShipDef = getDefaultShipSettingsForFleet(g + 1);
        const nextEquipDef = getDefaultEquipEnhanceForFleet(g + 1);

        saveDefaultShipSettingsForFleet(g, nextShipDef.level, nextShipDef.affinity);
        saveDefaultEquipEnhanceForFleet(g, nextEquipDef);
    }

    saveDefaultShipSettingsForFleet(totalFleets - 1, 120, 'Love');
    saveDefaultEquipEnhanceForFleet(totalFleets - 1, 10);

    saveFleetState();
    renderFleet();
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
    for (let g = 0; g < MAX_FLEETS; g++) {
        saveDefaultShipSettingsForFleet(g, 120, 'Love');
        saveDefaultEquipEnhanceForFleet(g, 10);
    }

    fleetState = createEmptyFleetGroup(0);

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
        case 'Crush': return '81♥';
        case 'Love': return '100♥';
        case 'Oath': return '100💍';
        case 'Oath200': return '200💍';
        default: return '50♥';
    }
}

function getMaxEnhanceByBox(boxColor, category) {
    if (category === "Augmentation" || selectingEquipSlotIndex === 5) {
        return 10;
    }

    switch (boxColor) {
        case 'rainbow':
        case 'yellow': return 13;
        case 'purple': return 11;
        case 'blue': return 7;
        case 'grey': return 3;
        default: return 13;
    }
}

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

function getSlotAllowedCategories(shipInfo, slotIndex) {
    if (slotIndex === 5) return ["Augmentation"];
    if (slotIndex === 3 || slotIndex === 4) return ["Auxiliary"];

    if (!shipInfo || !shipInfo.data || !shipInfo.data.equipSlot) return [];

    let rawSlots = shipInfo.data.equipSlot[slotIndex] || [];
    return rawSlots.map(code => MAP_EQUIP_CATEGORY[code] || code);
}

// ==========================================
// RENDER GIAO DIỆN CHÍNH
// ==========================================
function renderFleetSlotRow(index) {
    let slot = fleetState[index];
    let shipInfo = slot.shipId ? getProcessedShipData(index) : null;
    let shipHtml = "";

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

    let equipsHtml = "";
    for (let i = 0; i < 6; i++) {
        let isShipSelected = slot.shipId !== null;
        let eqSave = slot.equips[i];

        let slotInfoBadgeHtml = "";
        if (isShipSelected && shipInfo && shipInfo.data && i < 3) {
            let rawEffVal = shipInfo.data.slotEff && shipInfo.data.slotEff[i] ? shipInfo.data.slotEff[i] : "";
            let isModified = shipInfo.data._modifiedEffIndices && shipInfo.data._modifiedEffIndices[i];

            let effStyle = isModified ? 'color: #2ecc71; font-weight: bold;' : '';
            let eff = rawEffVal ? `<span class="eff-line" style="${effStyle}">${rawEffVal}%</span>` : "";
            let amt = (shipInfo.data.slotAmount && shipInfo.data.slotAmount[i]) ? `x${shipInfo.data.slotAmount[i]}` : "";

            if (eff || amt) {
                slotInfoBadgeHtml = `
                    <div class="equip-slot-info-badge">
                        ${eff}
                        ${amt ? `<span class="amount-line">${amt}</span>` : ''}
                    </div>
                `;
            }
        }

        let eqData = (isShipSelected && eqSave && eqSave.id) ? getEquipDataGlobal(eqSave.category, eqSave.id) : null;

        if (isShipSelected && eqSave && eqSave.id && eqData) {
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

    return `<div class="fleet-row">${shipHtml}${equipsHtml}</div>`;
}

function renderFleet() {
    let fullHtml = "";
    const totalFleets = Math.floor(fleetState.length / 9);

    const isMaxReached = totalFleets >= MAX_FLEETS;
    const isOnlyOneFleet = totalFleets <= 1;

    for (let group = 0; group < totalFleets; group++) {
        const addBtnAttr = isMaxReached ? 'disabled class="fleet-add-btn hidden"' : 'class="fleet-add-btn"';
        const deleteBtnAttr = isOnlyOneFleet ? 'disabled class="fleet-delete-btn hidden"' : 'class="fleet-delete-btn"';

        let headerRowHtml = `
            <div class="fleet-header-row">
                <div style="display: flex; align-items: center;">
                    <span class="fleet-title">Hạm Đội ${group + 1}</span>
                    <button type="button" ${addBtnAttr} onclick="addNewFleet(${group})">Hạm Đội Mới</button>
                </div>
                <button type="button" ${deleteBtnAttr} onclick="deleteFleet(${group})">Xóa</button>
            </div>
        `;

        let leftColumnRows = "";
        let rightColumnRows = "";
        for (let r = 0; r < 3; r++) {
            let leftSlotIndex = group * 9 + r;
            let rightSlotIndex = group * 9 + 3 + r;

            leftColumnRows += renderFleetSlotRow(leftSlotIndex);
            rightColumnRows += renderFleetSlotRow(rightSlotIndex);
        }

        let mainContentRowHtml = `
            <div class="fleet-main-content-row">
                <div class="fleet-column fleet-column-left">${leftColumnRows}</div>
                <div class="fleet-column fleet-column-right">${rightColumnRows}</div>
            </div>
        `;

        let subColumnRows = "";
        for (let r = 0; r < 3; r++) {
            let subSlotIndex = group * 9 + 6 + r;
            subColumnRows += renderFleetSlotRow(subSlotIndex);
        }

        let subContentRowHtml = `
            <div class="fleet-sub-content-row hidden">
                <div class="fleet-column fleet-column-sub">${subColumnRows}</div>
            </div>
        `;

        fullHtml += `
            <div class="fleet-box-wrapper">
                ${headerRowHtml}
                ${mainContentRowHtml}
                ${subContentRowHtml}
            </div>
        `;
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
        "Liga de Pedrería", "META", "Tempesta", "Universal", "Atelier Ryza"
    ];

    let types = [];
    let slotType = getSlotCategoryType(selectingSlotIndex);

    if (slotType === "SUB") {
        types = [
            { label: "Submarine", code: "SS" },
            { label: "Aviation Submarine", code: "SSV" },
            { label: "Sailing Frigate S", code: "IXs" }
        ];
    } else if (slotType === "VANGUARD") {
        types = [
            { label: "Destroyer", code: "DD" },
            { label: "Light Cruiser", code: "CL" },
            { label: "Heavy Cruiser", code: "CA" },
            { label: "Large Cruiser", code: "CB" },
            { label: "Guided Missile Destroyer", code: "DDG" },
            { label: "Munition Ship", code: "AE" },
            { label: "Sailing Frigate V", code: "IXv" }
        ];
    } else {
        types = [
            { label: "Battlecruiser", code: "BC" },
            { label: "Battleship", code: "BB" },
            { label: "Aviation Battleship", code: "BBV" },
            { label: "Aircraft Carrier", code: "CV" },
            { label: "Light Carrier", code: "CVL" },
            { label: "Monitor", code: "BM" },
            { label: "Guided Missile Destroyer", code: "DDG" },
            { label: "Repair Ship", code: "AR" },
            { label: "Sailing Frigate M", code: "IXm" }
        ];
    }

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
    let slotType = getSlotCategoryType(selectingSlotIndex);
    let catKeyUpper = (shipCatKey || '').toUpperCase();

    if (slotType === "SUB") {
        if (!SUBMARINE_SHIP_TYPES.includes(catKeyUpper)) return false;
    } else if (slotType === "VANGUARD") {
        if (!VANGUARD_SHIP_TYPES.includes(catKeyUpper)) return false;
    } else {
        if (!MAIN_SHIP_TYPES.includes(catKeyUpper)) return false;
    }

    if (!shipFilterFaction.has('ALL')) {
        let shipFaction = shipData.faction || '';
        let matchedFaction = false;
        for (let f of shipFilterFaction) {
            if (shipFaction === f) {
                matchedFaction = true;
                break;
            }
        }
        if (!matchedFaction) return false;
    }

    if (!shipFilterType.has('ALL')) {
        let matchedType = false;
        for (let t of shipFilterType) {
            let filterTypeUpper = t.toUpperCase();
            if (catKeyUpper === filterTypeUpper) {
                matchedType = true;
                break;
            }
            if (filterTypeUpper === "AR" && (catKeyUpper === "AR" || catKeyUpper === "RS")) matchedType = true;
            if (filterTypeUpper === "AE" && (catKeyUpper === "AE" || catKeyUpper === "MS")) matchedType = true;
            if (filterTypeUpper === "IXM" && (catKeyUpper === "IXM" || catKeyUpper === "SFM" || catKeyUpper === "IX" || catKeyUpper === "SF")) matchedType = true;
            if (filterTypeUpper === "IXV" && (catKeyUpper === "IXV" || catKeyUpper === "SFV")) matchedType = true;
            if (filterTypeUpper === "IXS" && (catKeyUpper === "IXS" || catKeyUpper === "SFS")) matchedType = true;
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

function getRarityTierRank(rarityStr) {
    if (!rarityStr) return 99;
    const r = rarityStr.toLowerCase();

    if (r === 'decisive' || r === 'ultra rare') return 0;
    if (r === 'priority' || r === 'super rare') return 1;
    if (r === 'elite') return 2;
    if (r === 'rare') return 3;
    if (r === 'normal') return 4;

    return 99;
}

function renderShipListOnly() {
    let gridListEl = document.querySelector('.ship-grid-list');
    if (!gridListEl) return;

    const currentFleetGroup = getFleetGroupIndex(selectingSlotIndex);
    const startIdx = currentFleetGroup * 9;
    const endIdx = startIdx + 9;

    let selectedShipsInFleet = new Set();
    for (let i = startIdx; i < endIdx; i++) {
        if (i !== selectingSlotIndex && fleetState[i] && fleetState[i].shipId) {
            selectedShipsInFleet.add(fleetState[i].shipId);
        }
    }

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
        "Liga de Pedrería", "META", "Tempesta", "Universal", "Atelier Ryza"
    ];

    let slotType = getSlotCategoryType(selectingSlotIndex);
    let typeOrder = [];
    if (slotType === "SUB") {
        typeOrder = ["SS", "SSV", "IXS", "SFS"];
    } else if (slotType === "VANGUARD") {
        typeOrder = ["DD", "CL", "CA", "CB", "DDG", "AE", "MS", "IXV", "SFV"];
    } else {
        typeOrder = ["BC", "BB", "BBV", "CV", "CVL", "BM", "DDG", "AR", "RS", "IXM", "SFM", "IX"];
    }

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

    allShipsList.sort((a, b) => {
        let rA = getRarityTierRank(a.data.rarity);
        let rB = getRarityTierRank(b.data.rarity);
        if (rA !== rB) return rA - rB;

        let fA = factionOrder.indexOf(a.data.faction);
        let fB = factionOrder.indexOf(b.data.faction);
        if (fA === -1) fA = 99;
        if (fB === -1) fB = 99;
        if (fA !== fB) return fA - fB;

        let tA = typeOrder.indexOf(a.cat.toUpperCase());
        let tB = typeOrder.indexOf(b.cat.toUpperCase());
        if (tA === -1) tA = 99;
        if (tB === -1) tB = 99;
        if (tA !== tB) return tA - tB;

        return a.displayName.localeCompare(b.displayName);
    });

    allShipsList.forEach(item => {
        let shipId = item.id;
        let shipData = item.data;

        // --- ẨN HOÀN TOÀN CÁC TÀU ĐÃ CHỌN TRONG CÙNG HẠM ĐỘI ---
        let isShipSelectedInFleet = selectedShipsInFleet.has(shipId);
        if (isShipSelectedInFleet) {
            return; 
        }

        let iconUrl = getShipIconUrl(shipId, shipData);
        let safeName = item.displayName.replace(/"/g, '&quot;');
        let boxClass = shipData.box ? `box-${shipData.box}` : "box-grey";

        let itemClass = `modal-ship-icon ${boxClass}`;
        let clickAction = `onclick="selectShip('${shipId}')"`;

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
    });

    gridListEl.innerHTML = gridHtml;
}

// ==========================================
// ĐIỀU KHIỂN POPUP CHỌN TÀU
// ==========================================
function openShipModal(slotIndex) {
    selectingSlotIndex = slotIndex;

    const fleetGroupIndex = getFleetGroupIndex(slotIndex);
    const defaultSettings = getDefaultShipSettingsForFleet(fleetGroupIndex);
    let currentSlot = fleetState[slotIndex];

    let curLevel = (currentSlot.shipId !== null) ? currentSlot.level : defaultSettings.level;
    let curAffinity = (currentSlot.shipId !== null) ? currentSlot.affinity : defaultSettings.affinity;

    if (currentSlot.shipId === null) {
        currentSlot.level = curLevel;
        currentSlot.affinity = curAffinity;
    }

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
        const levelInput = document.getElementById('shipLevelInput');
        const curLevel = levelInput ? parseInt(levelInput.value, 10) : (fleetState[selectingSlotIndex].level || 1);
        const curAff = fleetState[selectingSlotIndex].affinity || 'Stranger';

        const fleetGroupIndex = getFleetGroupIndex(selectingSlotIndex);

        saveDefaultShipSettingsForFleet(fleetGroupIndex, curLevel, curAff);

        fleetState[selectingSlotIndex].level = curLevel;
        fleetState[selectingSlotIndex].affinity = curAff;

        saveFleetState();
        renderFleet();
        closeShipModal();
    }
}

function selectShip(shipId) {
    if (selectingSlotIndex !== -1) {
        const fleetGroupIndex = getFleetGroupIndex(selectingSlotIndex);
        const defaultSettings = getDefaultShipSettingsForFleet(fleetGroupIndex);

        if (shipId === null) {
            fleetState[selectingSlotIndex].shipId = null;
            fleetState[selectingSlotIndex].equips = [null, null, null, null, null, null];
            fleetState[selectingSlotIndex].level = defaultSettings.level;
            fleetState[selectingSlotIndex].affinity = defaultSettings.affinity;
        } else {
            if (fleetState[selectingSlotIndex].shipId !== shipId) {
                fleetState[selectingSlotIndex].shipId = shipId;
                fleetState[selectingSlotIndex].equips = [null, null, null, null, null, null];
            }
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
// TẠO VÀ XỬ LÝ BỘ LỌC TRANG BỊ
// ==========================================
function toggleEquipFilter(btnEl) {
    isEquipFilterOpen = !isEquipFilterOpen;
    const panel = document.getElementById('equipFilterPanel');
    if (panel) {
        panel.style.display = isEquipFilterOpen ? 'flex' : 'none';
    }
    if (isEquipFilterOpen) {
        btnEl.innerText = "Đóng Bộ Lọc ▲";
        btnEl.classList.add("active");
    } else {
        btnEl.innerText = "Mở Bộ Lọc ▼";
        btnEl.classList.remove("active");
    }
}

function resetEquipFilterState() {
    isEquipFilterOpen = false;
    equipFilterCategory = new Set(['ALL']);
    equipFilterFaction = new Set(['ALL']);
    equipFilterRarity = new Set(['ALL']);
}

function buildEquipFilterHtml(allowedCategories) {
    const factions = [
        "Universal", "Eagle Union", "Royal Navy", "Heavy Sakura", "Ironblood",
        "Dragon Empery", "Sardegna Empire", "Northern Parliament",
        "Iris Libre", "Vichya Dominion", "Kingdom of Tulipia",
        "Liga de Pedrería", "META", "Tempesta", "Atelier Ryza"
    ];

    const rarities = [
        { label: "Ultra Rare", code: "rainbow", cls: "rarity-decisive" },
        { label: "Super Rare", code: "yellow", cls: "rarity-sr" },
        { label: "Elite", code: "purple", cls: "rarity-elite" },
        { label: "Rare", code: "blue", cls: "rarity-rare" },
        { label: "Normal", code: "grey", cls: "rarity-normal" }
    ];

    let categoryBtns = "";
    if (allowedCategories.length >= 2) {
        categoryBtns += `<button type="button" class="filter-btn ${equipFilterCategory.has('ALL') ? 'active' : ''}" onclick="selectEquipCategoryFilter('ALL', false)">Hiển Thị Tất Cả</button>`;
        allowedCategories.forEach(cat => {
            const active = equipFilterCategory.has(cat) ? 'active' : '';
            categoryBtns += `<button type="button" class="filter-btn ${active}" onclick="selectEquipCategoryFilter('${cat}', false)">${cat}</button>`;
        });
    } else if (allowedCategories.length === 1) {
        const singleCat = allowedCategories[0];
        equipFilterCategory.clear();
        equipFilterCategory.add(singleCat);
        categoryBtns += `<button type="button" class="filter-btn active" onclick="selectEquipCategoryFilter('${singleCat}', true)">${singleCat}</button>`;
    }

    let factionBtns = `<button type="button" class="filter-btn ${equipFilterFaction.has('ALL') ? 'active' : ''}" onclick="selectEquipFactionFilter('ALL')">Hiển Thị Tất Cả</button>`;
    factions.forEach(f => {
        const active = equipFilterFaction.has(f) ? 'active' : '';
        factionBtns += `<button type="button" class="filter-btn ${active}" onclick="selectEquipFactionFilter('${f}')">${f}</button>`;
    });

    let rarityBtns = `<button type="button" class="filter-btn ${equipFilterRarity.has('ALL') ? 'active' : ''}" onclick="selectEquipRarityFilter('ALL')">Hiển Thị Tất Cả</button>`;
    rarities.forEach(r => {
        const active = equipFilterRarity.has(r.code) ? `active ${r.cls}` : '';
        rarityBtns += `<button type="button" class="filter-btn ${r.cls} ${active}" onclick="selectEquipRarityFilter('${r.code}')">${r.label}</button>`;
    });

    return `
        <div id="equipFilterPanel" class="ship-filter-panel" style="display: ${isEquipFilterOpen ? 'flex' : 'none'};">
            <div class="filter-section">
                <span class="filter-title">Theo Loại Trang Bị</span>
                <div class="filter-btn-group">${categoryBtns}</div>
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

function selectEquipCategoryFilter(val, isSingleType) {
    if (isSingleType) return;

    if (val === 'ALL') {
        equipFilterCategory.clear();
        equipFilterCategory.add('ALL');
    } else {
        equipFilterCategory.delete('ALL');
        if (equipFilterCategory.has(val)) {
            equipFilterCategory.delete(val);
        } else {
            equipFilterCategory.add(val);
        }
        if (equipFilterCategory.size === 0) {
            equipFilterCategory.add('ALL');
        }
    }
    updateEquipFilterUIAndGrid();
}

function selectEquipFactionFilter(val) {
    if (val === 'ALL') {
        equipFilterFaction.clear();
        equipFilterFaction.add('ALL');
    } else {
        equipFilterFaction.delete('ALL');
        if (equipFilterFaction.has(val)) {
            equipFilterFaction.delete(val);
        } else {
            equipFilterFaction.add(val);
        }
        if (equipFilterFaction.size === 0) {
            equipFilterFaction.add('ALL');
        }
    }
    updateEquipFilterUIAndGrid();
}

function selectEquipRarityFilter(val) {
    if (val === 'ALL') {
        equipFilterRarity.clear();
        equipFilterRarity.add('ALL');
    } else {
        equipFilterRarity.delete('ALL');
        if (equipFilterRarity.has(val)) {
            equipFilterRarity.delete(val);
        } else {
            equipFilterRarity.add(val);
        }
        if (equipFilterRarity.size === 0) {
            equipFilterRarity.add('ALL');
        }
    }
    updateEquipFilterUIAndGrid();
}

function updateEquipFilterUIAndGrid() {
    let shipInfo = fleetState[selectingSlotIndex].shipId ? getProcessedShipData(selectingSlotIndex) : null;
    if (!shipInfo) return;

    let allowedCategories = getSlotAllowedCategories(shipInfo, selectingEquipSlotIndex);

    const panel = document.getElementById('equipFilterPanel');
    if (panel) {
        panel.outerHTML = buildEquipFilterHtml(allowedCategories);
    }
    renderEquipListOnly(allowedCategories, shipInfo);
}

function isEquipMatchingFilter(category, eqData) {
    if (!equipFilterCategory.has('ALL') && !equipFilterCategory.has(category)) {
        return false;
    }

    if (!equipFilterFaction.has('ALL')) {
        let eqFaction = eqData.faction || 'Universal';
        let matchedFaction = false;
        for (let f of equipFilterFaction) {
            if (eqFaction === f) {
                matchedFaction = true;
                break;
            }
        }
        if (!matchedFaction) return false;
    }

    if (!equipFilterRarity.has('ALL')) {
        let eqBox = eqData.box || 'grey';
        if (!equipFilterRarity.has(eqBox)) {
            return false;
        }
    }

    return true;
}

function getEquipBoxRank(boxColor) {
    switch (boxColor) {
        case 'rainbow': return 0;
        case 'yellow': return 1;
        case 'purple': return 2;
        case 'blue': return 3;
        case 'grey': return 4;
        default: return 99;
    }
}

function renderEquipListOnly(allowedCategories, shipInfo) {
    let gridListEl = document.querySelector('#equipModalGrid .ship-grid-list');
    if (!gridListEl) return;

    const currentFleetGroup = getFleetGroupIndex(selectingSlotIndex);
    const startIdx = currentFleetGroup * 9;
    const endIdx = startIdx + 9;

    let limitedEquipsOnCurrentShip = new Set();
    let fleetEquipCounts = {};

    // Danh sách các cặp trang bị dùng chung giới hạn (Group / Pair Limit) trên cùng một con tàu
    const PAIR_LIMIT_GROUPS = [
        ["hpfcr", "admiralty_fct"] 
    ];

    let currentShipEquips = fleetState[selectingSlotIndex] ? fleetState[selectingSlotIndex].equips : [];

    for (let slotIdx = startIdx; slotIdx < endIdx; slotIdx++) {
        let slotData = fleetState[slotIdx];
        if (slotData && slotData.equips) {
            slotData.equips.forEach((eq, eqIdx) => {
                if (eq && eq.id) {
                    fleetEquipCounts[eq.id] = (fleetEquipCounts[eq.id] || 0) + 1;

                    if (slotIdx === selectingSlotIndex && eqIdx !== selectingEquipSlotIndex) {
                        let eqData = getEquipDataGlobal(eq.category, eq.id);
                        if (eqData && eqData.limit === 1) {
                            limitedEquipsOnCurrentShip.add(eq.id);
                        }
                    }
                }
            });
        }
    }

    // --- KIỂM TRA LUẬT NHÓM CẶP TRANG BỊ TRÊN CÙNG CON TÀU ---
    currentShipEquips.forEach((eq, eqIdx) => {
        if (eq && eq.id && eqIdx !== selectingEquipSlotIndex) {
            PAIR_LIMIT_GROUPS.forEach(group => {
                if (group.includes(eq.id)) {
                    group.forEach(itemId => {
                        limitedEquipsOnCurrentShip.add(itemId);
                    });
                }
            });
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

    const equipFactionOrder = [
        "Universal", "Eagle Union", "Royal Navy", "Heavy Sakura", "Ironblood",
        "Dragon Empery", "Sardegna Empire", "Northern Parliament",
        "Iris Libre", "Vichya Dominion", "Kingdom of Tulipia",
        "Liga de Pedrería", "META", "Tempesta", "Atelier Ryza"
    ];

    let allEquipsList = [];

    allowedCategories.forEach(category => {
        let targetDataCategory = category;
        if (category === "CA-gun" || category === "CB-gun") {
            targetDataCategory = "CA-gun";
        } else if (category === "Surface Torpedo" || category === "Guided Missile") {
            targetDataCategory = "Surface Torpedo";
        }

        if (window.equipDetails && window.equipDetails[targetDataCategory]) {
            let catContainer = window.equipDetails[targetDataCategory];

            let processEquipEntries = (equipObj) => {
                for (let eqId in equipObj) {
                    let eqData = equipObj[eqId];
                    
                    if (eqData && typeof eqData === 'object' && !eqData.code && !eqData.name) {
                        processEquipEntries(eqData);
                        continue;
                    }

                    if (!eqData || !eqData.name) continue;

                    let actualCategory = category;

                    if (targetDataCategory === "CA-gun") {
                        actualCategory = (eqData.gunType === "cb") ? "CB-gun" : "CA-gun";
                    }
                    else if (targetDataCategory === "Surface Torpedo") {
                        actualCategory = (eqData.torpType === "gm") ? "Guided Missile" : "Surface Torpedo";
                    }

                    if (category === "CA-gun" && actualCategory !== "CA-gun") continue;
                    if (category === "CB-gun" && actualCategory !== "CB-gun") continue;
                    if (category === "Surface Torpedo" && actualCategory !== "Surface Torpedo") continue;
                    if (category === "Guided Missile" && actualCategory !== "Guided Missile") continue;

                    // --- LUẬT MẶC ĐỊNH EQUIPPABLE LÀ ALL NẾU KHÔNG KHAI BÁO ---
                    let equipableList = eqData.equippable || eqData.equipable;
                    let isEquippableAllowed = false;

                    // Nếu thiếu/không khai báo equippable, tự động coi là equippable: ["All"]
                    if (!equipableList || !Array.isArray(equipableList) || equipableList.length === 0) {
                        isEquippableAllowed = true;
                    } else if (equipableList.includes("All") || equipableList.includes(shipInfo.type)) {
                        isEquippableAllowed = true;
                    }

                    // Kiểm tra danh sách ngoại lệ bị cấm (unequippable)
                    let unequippableList = eqData.unequippable || eqData.unequipList;
                    if (unequippableList && Array.isArray(unequippableList)) {
                        if (unequippableList.includes(shipInfo.type)) {
                            isEquippableAllowed = false; 
                        }
                    }

                    if (!isEquippableAllowed) {
                        continue;
                    }

                    if (!isEquipMatchingFilter(actualCategory, eqData)) {
                        continue;
                    }

                    allEquipsList.push({
                        id: eqId,
                        category: actualCategory,
                        data: eqData,
                        displayName: eqData.name
                    });
                }
            };

            processEquipEntries(catContainer);
        }
    });

    allEquipsList.sort((a, b) => {
        let rA = getEquipBoxRank(a.data.box);
        let rB = getEquipBoxRank(b.data.box);
        if (rA !== rB) return rA - rB;

        let fAStr = a.data.faction || 'Universal';
        let fBStr = b.data.faction || 'Universal';
        let fA = equipFactionOrder.indexOf(fAStr);
        let fB = equipFactionOrder.indexOf(fBStr);
        if (fA === -1) fA = 99;
        if (fB === -1) fB = 99;
        if (fA !== fB) return fA - fB;

        let cA = allowedCategories.indexOf(a.category);
        let cB = allowedCategories.indexOf(b.category);
        if (cA !== cB) return cA - cB;

        return a.displayName.localeCompare(b.displayName);
    });

    allEquipsList.forEach(item => {
        let eqId = item.id;
        let category = item.category === "Augmentation" || selectingEquipSlotIndex === 5 ? "Augmentation" : item.category;
        let eqData = item.data;

        // --- EXCLUSIVE: NẾU TÀU HIỆN TẠI KHÔNG NẰM TRONG DANH SÁCH -> ẨN LUÔN ---
        if (eqData.exclusive && Array.isArray(eqData.exclusive)) {
            let currentShipId = fleetState[selectingSlotIndex].shipId;
            if (!eqData.exclusive.includes(currentShipId)) {
                return; 
            }
        }

        let safeName = item.displayName.replace(/"/g, '&quot;');
        let iconUrl = `https://azurlane.netojuu.com/images/${eqData.code}.png`;
        let boxClass = eqData.box ? `box-${eqData.box}` : "box-grey";

        let isLimitedOnShip = limitedEquipsOnCurrentShip.has(eqId);
        
        let currentEqInSlot = fleetState[selectingSlotIndex].equips[selectingEquipSlotIndex];
        let currentCountInFleet = fleetEquipCounts[eqId] || 0;
        if (currentEqInSlot && currentEqInSlot.id === eqId) {
            currentCountInFleet -= 1; 
        }

        let isFleetLimitReached = (eqData.fleetLimit !== undefined && currentCountInFleet >= eqData.fleetLimit);

        let isDisabled = isLimitedOnShip || isFleetLimitReached;
        let itemClass = isDisabled ? "modal-ship-icon equip-disabled" : `modal-ship-icon ${boxClass}`;
        let clickAction = isDisabled ? "" : `onclick="selectEquip('${eqId}', '${category}')"`;

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
    });

    gridListEl.innerHTML = gridHtml;
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
                        <button type="button" class="filter-toggle-btn" onclick="toggleEquipFilter(this)">Mở Bộ Lọc ▼</button>
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

function openEquipModal(fleetIndex, slotIndex) {
    selectingSlotIndex = fleetIndex;
    selectingEquipSlotIndex = slotIndex;

    let shipInfo = fleetState[fleetIndex].shipId ? getProcessedShipData(fleetIndex) : null;
    if (!shipInfo) return;

    resetEquipFilterState();

    let allowedCategories = getSlotAllowedCategories(shipInfo, slotIndex);
    let isAugmentSlot = (slotIndex === 5);

    const eqModal = document.getElementById('equipSelectionModal');
    const headerActions = eqModal.querySelector('.modal-header-actions');
    if (headerActions) {
        if (isAugmentSlot) {
            headerActions.innerHTML = `<button type="button" class="modal-close-btn" onclick="closeEquipModal()">Đóng</button>`;
        } else {
            headerActions.innerHTML = `
                <button type="button" class="filter-toggle-btn" onclick="toggleEquipFilter(this)">Mở Bộ Lọc ▼</button>
                <button type="button" class="modal-close-btn" onclick="closeEquipModal()">Đóng</button>
            `;
        }
    }

    let maxAllowedEnhance = (isAugmentSlot || allowedCategories.includes("Augmentation")) ? 10 : 13;

    const fleetGroupIndex = getFleetGroupIndex(fleetIndex);
    let existingEquip = fleetState[fleetIndex].equips[slotIndex];
    if (existingEquip && existingEquip.enhance !== undefined) {
        currentEquipEnhanceVal = Math.min(existingEquip.enhance, maxAllowedEnhance);
    } else {
        currentEquipEnhanceVal = Math.min(getDefaultEquipEnhanceForFleet(fleetGroupIndex), maxAllowedEnhance);
    }

    let controlsHtml = `
        <div class="ship-modal-controls">
            <div class="control-group">
                <label>Enhance:</label>
                <input type="number" id="equipEnhanceInput" min="0" max="${maxAllowedEnhance}" value="${currentEquipEnhanceVal}" onchange="handleEquipEnhanceInputChange(this.value)">
                <input type="range" id="equipEnhanceRange" min="0" max="${maxAllowedEnhance}" value="${currentEquipEnhanceVal}" oninput="handleEquipEnhanceRangeChange(this.value)">
                <button type="button" class="set-default-btn" onclick="handleSetDefaultEquipEnhance()">Đặt làm mặc định</button>
            </div>
        </div>
    `;

    let filterHtml = isAugmentSlot ? "" : buildEquipFilterHtml(allowedCategories);

    document.getElementById('equipModalGrid').innerHTML = filterHtml + controlsHtml + `<div class="ship-grid-list"></div>`;
    renderEquipListOnly(allowedCategories, shipInfo);

    applyAntiShiftPadding(true);

    eqModal.style.display = "flex";
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
}

function handleEquipEnhanceRangeChange(val) {
    let maxAllowed = (selectingEquipSlotIndex === 5) ? 10 : 13;
    currentEquipEnhanceVal = Math.min(parseInt(val, 10), maxAllowed);
    document.getElementById('equipEnhanceInput').value = currentEquipEnhanceVal;
}

function handleEquipEnhanceInputChange(val) {
    let inputEl = document.getElementById('equipEnhanceInput');
    let rangeEl = document.getElementById('equipEnhanceRange');
    let num = parseInt(val, 10);
    let maxAllowed = (selectingEquipSlotIndex === 5) ? 10 : 13;

    if (isNaN(num)) {
        inputEl.value = currentEquipEnhanceVal;
        return;
    }

    if (num < 0) num = 0;
    if (num > maxAllowed) num = maxAllowed;

    currentEquipEnhanceVal = num;
    inputEl.value = num;
    rangeEl.value = num;
}

function handleSetDefaultEquipEnhance() {
    let maxAllowed = (selectingEquipSlotIndex === 5) ? 10 : 13;
    let finalDefault = Math.min(currentEquipEnhanceVal, maxAllowed);

    if (selectingSlotIndex !== -1) {
        const fleetGroupIndex = getFleetGroupIndex(selectingSlotIndex);
        saveDefaultEquipEnhanceForFleet(fleetGroupIndex, finalDefault);

        if (selectingEquipSlotIndex !== -1) {
            let currentEq = fleetState[selectingSlotIndex].equips[selectingEquipSlotIndex];
            if (currentEq && currentEq.id) {
                let eqData = getEquipDataGlobal(currentEq.category, currentEq.id);
                let maxEnhance = eqData ? getMaxEnhanceByBox(eqData.box, currentEq.category) : maxAllowed;

                currentEq.enhance = Math.min(finalDefault, maxEnhance);
                saveFleetState();
                renderFleet();
            }
        }
    }

    closeEquipModal();
}

function selectEquip(eqId, category) {
    if (selectingSlotIndex !== -1 && selectingEquipSlotIndex !== -1) {
        if (eqId && category) {
            let eqData = getEquipDataGlobal(category, eqId);
            let maxEnhance = eqData ? getMaxEnhanceByBox(eqData.box, category) : ((selectingEquipSlotIndex === 5) ? 10 : 13);

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

    resetEquipFilterState();

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

window.onclick = function (event) {
    if (event.target === shipModal) closeShipModal();
    let eqModal = document.getElementById('equipSelectionModal');
    if (eqModal && event.target === eqModal) closeEquipModal();

    let confirmModal = document.getElementById('confirmResetModal');
    if (confirmModal && event.target === confirmModal) closeConfirmModal();
};

function getProcessedShipData(fleetSlotIndex) {
    let slot = fleetState[fleetSlotIndex];
    if (!slot || !slot.shipId) return null;

    let baseInfo = getShipTypeAndData(slot.shipId);
    if (!baseInfo || !baseInfo.data) return null;

    let shipDataCopy = JSON.parse(JSON.stringify(baseInfo.data));
    let shipType = baseInfo.type;

    shipDataCopy._modifiedEffIndices = {};

    if (shipDataCopy.customRules && Array.isArray(shipDataCopy.customRules)) {
        shipDataCopy.customRules.forEach(rule => {
            
            // --- LUẬT 1: Azuma (Tăng theo loại súng CBGM ở slot 0) ---
            if (rule.type === "SLOT_EFF_BONUS") {
                let targetSlot = rule.slotIndex;
                let requiredCat = rule.equipCategory;
                let bonusVal = rule.bonus;

                let eq = slot.equips[targetSlot];
                if (eq && eq.id) {
                    let eqData = getEquipDataGlobal(eq.category, eq.id);
                    let isCBGun = eq.category === "CBGM" || eq.category === "CB-gun" || (eqData && eqData.gunType === "cb");

                    if (eq.category === requiredCat || (requiredCat === "CBGM" && isCBGun)) {
                        let currentEff = parseInt(shipDataCopy.slotEff[targetSlot], 10) || 0;
                        shipDataCopy.slotEff[targetSlot] = String(currentEff + bonusVal);
                        shipDataCopy._modifiedEffIndices[targetSlot] = true;
                    }
                }
            }

            // --- LUẬT 2: Kronstadt (Tăng slot 2 nếu có tối thiểu N trang bị Northern Parliament trong hạm) ---
            if (rule.type === "FACTION_SLOT_EFF_BONUS") {
                let targetSlot = rule.targetSlotIndex;
                let requiredFaction = rule.requiredFaction;
                let minCount = rule.minCount || 1;
                let bonusVal = rule.bonus;

                let factionEquipCount = 0;
                slot.equips.forEach(eq => {
                    if (eq && eq.id) {
                        let eqData = getEquipDataGlobal(eq.category, eq.id);
                        let eqFaction = eqData ? (eqData.faction || 'Universal') : 'Universal';
                        if (eqFaction === requiredFaction) {
                            factionEquipCount++;
                        }
                    }
                });

                if (factionEquipCount >= minCount) {
                    let currentEff = parseInt(shipDataCopy.slotEff[targetSlot], 10) || 0;
                    shipDataCopy.slotEff[targetSlot] = String(currentEff + bonusVal);
                    shipDataCopy._modifiedEffIndices[targetSlot] = true;
                }
            }

        });
    }

    return { type: shipType, data: shipDataCopy };
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initFleetBuilder);
} else {
    initFleetBuilder();
}