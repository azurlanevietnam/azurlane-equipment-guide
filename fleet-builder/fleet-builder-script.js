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
const VANGUARD_SHIP_TYPES = ["DD", "CL", "CA", "CB", "DDG", "MS", "SFV"];
const SUBMARINE_SHIP_TYPES = ["SS", "SSV", "SFS"];

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

// Xác định loại slot (0-2: Main | 3-5: Vanguard | 6-8: Submarine)
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
    } catch (e) {}
    return { level: 1, affinity: 'Stranger' };
}

function saveDefaultShipSettingsForFleet(fleetGroupIndex, level, affinity) {
    try {
        localStorage.setItem(`azur_lane_ship_defaults_fleet_${fleetGroupIndex}`, JSON.stringify({ level, affinity }));
    } catch (e) {}
}

function getDefaultEquipEnhanceForFleet(fleetGroupIndex) {
    try {
        const savedDefault = localStorage.getItem(`azur_lane_equip_default_enhance_fleet_${fleetGroupIndex}`);
        if (savedDefault !== null) return parseInt(savedDefault, 10);
    } catch (e) {}
    return 0;
}

function saveDefaultEquipEnhanceForFleet(fleetGroupIndex, enhanceLevel) {
    try {
        localStorage.setItem(`azur_lane_equip_default_enhance_fleet_${fleetGroupIndex}`, JSON.stringify(enhanceLevel));
    } catch (e) {}
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
    
    // MẶC ĐỊNH KHI LOCAL STORAGE RỖNG CHỈ CÓ NHÁT 1 FLEET (9 SLOTS)
    return createEmptyFleetGroup(0);
}

// ==========================================
// QUẢN LÝ TÍNH NĂNG THÊM & XÓA HẠM ĐỘI
// ==========================================
function addNewFleet(insertAfterGroupIndex) {
    const totalFleets = Math.floor(fleetState.length / 9);
    
    // ĐẢM BẢO KHÔNG THỂ THÊM KHI ĐÃ ĐẠT 36 FLEET (KỂ CẢ DEVTOOLS)
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

    // ĐẢM BẢO NẾU CHỈ CÒN 1 FLEET DUY NHẤT THÌ KHÔNG THỂ XÓA (KỂ CẢ DEVTOOLS)
    if (totalFleets <= 1) {
        console.warn("Không thể xóa khi chỉ còn 1 hạm đội duy nhất!");
        return;
    }

    if (groupIndexToDelete < 0 || groupIndexToDelete >= totalFleets) {
        return;
    }

    // 1. Xóa 9 slot của hạm đội này khỏi mảng fleetState
    const startPosition = groupIndexToDelete * 9;
    fleetState.splice(startPosition, 9);

    // 2. Dịch chuyển mặc định của các Fleet nằm phía sau lên 1 nấc
    for (let g = groupIndexToDelete; g < totalFleets - 1; g++) {
        const nextShipDef = getDefaultShipSettingsForFleet(g + 1);
        const nextEquipDef = getDefaultEquipEnhanceForFleet(g + 1);

        saveDefaultShipSettingsForFleet(g, nextShipDef.level, nextShipDef.affinity);
        saveDefaultEquipEnhanceForFleet(g, nextEquipDef);
    }

    // Reset thiết lập mặc định của slot cuối cùng về mức thấp nhất
    saveDefaultShipSettingsForFleet(totalFleets - 1, 1, 'Stranger');
    saveDefaultEquipEnhanceForFleet(totalFleets - 1, 0);

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
        saveDefaultShipSettingsForFleet(g, 1, 'Stranger');
        saveDefaultEquipEnhanceForFleet(g, 0);
    }

    // RESET VỀ DUY NHẤT 1 HẠM ĐỘI BẮT ĐẦU
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
        case 'Crush':    return '81♥';
        case 'Love':     return '100♥';
        case 'Oath':     return '100💍';
        case 'Oath200':  return '200💍';
        default:         return '50♥';
    }
}

function getMaxEnhanceByBox(boxColor, category) {
    if (category === "Augmentation" || selectingEquipSlotIndex === 5) {
        return 10;
    }

    switch (boxColor) {
        case 'rainbow':
        case 'yellow': return 13;
        case 'purple':  return 11;
        case 'blue':    return 7;
        case 'grey':    return 3;
        default:        return 13;
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

// ==========================================
// RENDER GIAO DIỆN CHÍNH
// ==========================================
function renderFleetSlotRow(index) {
    let slot = fleetState[index];
    let shipInfo = slot.shipId ? getShipTypeAndData(slot.shipId) : null;
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

    return `<div class="fleet-row">${shipHtml}${equipsHtml}</div>`;
}

function renderFleet() {
    let fullHtml = "";
    const totalFleets = Math.floor(fleetState.length / 9);
    
    const isMaxReached = totalFleets >= MAX_FLEETS;
    const isOnlyOneFleet = totalFleets <= 1;

    for (let group = 0; group < totalFleets; group++) {
        // Trạng thái nút Hạm Đội Mới (Ẩn/Kèm thuộc tính khi đạt 36)
        const addBtnAttr = isMaxReached ? 'disabled class="fleet-add-btn hidden"' : 'class="fleet-add-btn"';
        
        // Trạng thái nút Xóa (Ẩn/Kèm thuộc tính khi chỉ còn 1 Fleet)
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

        // HÀNG 2: 2 CỘT x 3 ROWS
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

        // HÀNG 3: SUBMARINE (1 CỘT x 3 ROWS, MẶC ĐỊNH HIDDEN)
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
        "Liga de Pedrería", "META", "Tempesta", "Universal", "Collab"
    ];

    let types = [];
    let slotType = getSlotCategoryType(selectingSlotIndex);

    if (slotType === "SUB") {
        types = [
            { label: "Submarine", code: "SS" },
            { label: "Aviation Submarine", code: "SSV" },
            { label: "Sailing Frigate S", code: "SFS" }
        ];
    } else if (slotType === "VANGUARD") {
        types = [
            { label: "Destroyer", code: "DD" },
            { label: "Light Cruiser", code: "CL" },
            { label: "Heavy Cruiser", code: "CA" },
            { label: "Large Cruiser", code: "CB" },
            { label: "Guided Missile Destroyer", code: "DDG" },
            { label: "Munition Ship", code: "MS" },
            { label: "Sailing Frigate V", code: "SFV" }
        ];
    } else {
        types = [
            { label: "Battlecruiser", code: "BC" },
            { label: "Battleship", code: "BB" },
            { label: "Aviation Battleship", code: "BBV" },
            { label: "Aircraft Carrier", code: "CV" },
            { label: "Light Carrier", code: "CVL" },
            { label: "Monitor", code: "BM" },
            { label: "Repair Ship", code: "RS" },
            { label: "Sailing Frigate M", code: "SFM" }
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
        if (VANGUARD_SHIP_TYPES.includes(catKeyUpper) || SUBMARINE_SHIP_TYPES.includes(catKeyUpper)) return false;
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
            if (filterTypeUpper === "RS" && catKeyUpper === "AR") matchedType = true;
            if (filterTypeUpper === "SFM" && (catKeyUpper === "IX" || catKeyUpper === "SF")) matchedType = true;
            if (filterTypeUpper === "SFV" && catKeyUpper === "SFV") matchedType = true;
            if (filterTypeUpper === "SFS" && catKeyUpper === "SFS") matchedType = true;
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
        "Liga de Pedrería", "META", "Tempesta", "Universal", "Collab"
    ];

    let slotType = getSlotCategoryType(selectingSlotIndex);
    let typeOrder = [];
    if (slotType === "SUB") {
        typeOrder = ["SS", "SSV", "SFS"];
    } else if (slotType === "VANGUARD") {
        typeOrder = ["DD", "CL", "CA", "CB", "DDG", "MS", "SFV"];
    } else {
        typeOrder = ["BC", "BB", "BBV", "CV", "CVL", "BM", "RS", "AR", "SFM", "IX"];
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
        "Liga de Pedrería", "META", "Tempesta", "Collab"
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
    let shipInfo = getShipTypeAndData(fleetState[selectingSlotIndex].shipId);
    if (!shipInfo) return;

    let allowedCategories = [];
    if (selectingEquipSlotIndex === 5) {
        allowedCategories = ["Augmentation"];
    } else if (selectingEquipSlotIndex === 3 || selectingEquipSlotIndex === 4) {
        allowedCategories = ["Auxiliary"];
    } else {
        let mainSlots = shipInfo.data.equipSlot.slice(0, 3);
        allowedCategories = mainSlots[selectingEquipSlotIndex] || [];
    }

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
        case 'yellow':  return 1;
        case 'purple':  return 2;
        case 'blue':    return 3;
        case 'grey':    return 4;
        default:        return 99;
    }
}

function renderEquipListOnly(allowedCategories, shipInfo) {
    let gridListEl = document.querySelector('#equipModalGrid .ship-grid-list');
    if (!gridListEl) return;

    let currentEquips = fleetState[selectingSlotIndex].equips;
    let limitedEquipsSelected = new Set();
    currentEquips.forEach((eq, idx) => {
        if (eq && idx !== selectingEquipSlotIndex) {
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

    const equipFactionOrder = [
        "Universal", "Eagle Union", "Royal Navy", "Heavy Sakura", "Ironblood", 
        "Dragon Empery", "Sardegna Empire", "Northern Parliament", 
        "Iris Libre", "Vichya Dominion", "Kingdom of Tulipia", 
        "Liga de Pedrería", "META", "Tempesta", "Collab"
    ];

    let allEquipsList = [];

    allowedCategories.forEach(category => {
        if (window.equipDetails && window.equipDetails[category]) {
            for (let eqId in window.equipDetails[category]) {
                let eqData = window.equipDetails[category][eqId];
                
                if (category === "Auxiliary" || category === "Augmentation") {
                    if (eqData.equipable && !eqData.equipable.includes(shipInfo.type)) {
                        continue; 
                    }
                }

                if (!isEquipMatchingFilter(category, eqData)) {
                    continue;
                }

                allEquipsList.push({
                    id: eqId,
                    category: category,
                    data: eqData,
                    displayName: eqData.name
                });
            }
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
        let category = item.category;
        let eqData = item.data;

        let safeName = item.displayName.replace(/"/g, '&quot;');
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
    
    let shipInfo = getShipTypeAndData(fleetState[fleetIndex].shipId);
    if (!shipInfo) return;

    resetEquipFilterState();

    let allowedCategories = [];
    let isAugmentSlot = (slotIndex === 5);

    if (isAugmentSlot) {
        allowedCategories = ["Augmentation"];
    } else if (slotIndex === 3 || slotIndex === 4) {
        allowedCategories = ["Auxiliary"];
    } else {
        let mainSlots = shipInfo.data.equipSlot.slice(0, 3);
        allowedCategories = mainSlots[slotIndex] || [];
    }

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
                let eqData = window.equipDetails[currentEq.category] && window.equipDetails[currentEq.category][currentEq.id];
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
            let eqData = window.equipDetails[category] && window.equipDetails[category][eqId];
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