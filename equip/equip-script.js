const mainTabsContainer = document.getElementById('mainTabs');
const subTabsContainer = document.getElementById('subTabs');
const tierlistViewContainer = document.getElementById('tierlistView');
const detailsViewContainer = document.getElementById('detailsView');
const extraFiltersView = document.getElementById('extraFiltersView');

let currentMainTab = "Torpedo Bomber";
let currentSubTab = "";
let currentFilterConfig = null;
let currentFilterValue = 'all';

function initEquipPage() {
    renderMainTabs();
    selectMainTab(currentMainTab);
}

function renderMainTabs() {
    let html = "";
    categories.forEach(cat => {
        html += `<button class="main-tab-btn" onclick="selectMainTab('${cat}')" id="main-tab-${cat}">${cat}</button>`;
    });
    mainTabsContainer.innerHTML = html;
}

function applyExtraFilter(equipId) {
    if (!currentFilterConfig || currentFilterValue === 'all') return true;
    
    const equipInfo = equipDetails[currentMainTab][equipId];
    if (!equipInfo) return false;
    
    const prop = currentFilterConfig.property;
    const itemValue = equipInfo[prop] || currentFilterConfig.fallbackItemValue || '';
    
    return itemValue === currentFilterValue;
}

function selectMainTab(catName) {
    document.querySelectorAll('.main-tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`main-tab-${catName}`);
    if (activeBtn) activeBtn.classList.add('active');

    currentMainTab = catName;
    const data = equipData[catName];

    if (!data || !data.subCategories || data.subCategories.length === 0) {
        subTabsContainer.innerHTML = "<div style='color:#999;'>Đang cập nhật...</div>";
        tierlistViewContainer.innerHTML = "";
        detailsViewContainer.innerHTML = "";
        if (extraFiltersView) extraFiltersView.style.display = "none";
        return;
    }

    if (data.filterConfig) {
        currentFilterConfig = data.filterConfig;
        currentFilterValue = 'all'; 
        if (extraFiltersView) {
            extraFiltersView.style.display = "flex";
            renderExtraFilters();
        }
    } else {
        currentFilterConfig = null;
        currentFilterValue = 'all';
        if (extraFiltersView) extraFiltersView.style.display = "none";
    }

    renderSubTabs(data.subCategories);
    selectSubTab('all');

    let allEquipForMainTab = Object.keys(equipDetails[currentMainTab] || {});
    let filteredEquip = allEquipForMainTab.filter(id => applyExtraFilter(id));
    renderDetailsView(filteredEquip);
}

function renderSubTabs(subCats) {
    let html = `<button class="sub-tab-btn" onclick="selectSubTab('all')" id="sub-tab-all">Tierlist Tổng</button>`;
    subCats.forEach(sub => {
        html += `<button class="sub-tab-btn" onclick="selectSubTab('${sub.id}')" id="sub-tab-${sub.id}">${sub.name}</button>`;
    });
    subTabsContainer.innerHTML = html;
}

function selectSubTab(subId) {
    document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`sub-tab-${subId}`);
    if (activeBtn) activeBtn.classList.add('active');

    currentSubTab = subId;

    let equipListWithTiers = [];

    if (subId === 'all') {
        const allEquipIds = Object.keys(equipDetails[currentMainTab] || {});

        equipListWithTiers = allEquipIds.map(id => {
            const equipInfo = equipDetails[currentMainTab][id];
            return { id: id, tier: equipInfo ? (equipInfo.tier || "Unranked") : "Unranked" };
        });
    } else {
        const subData = equipData[currentMainTab].tierlists[subId] || {};
        for (let tierKey in subData) {
            subData[tierKey].forEach(equipId => {
                equipListWithTiers.push({ id: equipId, tier: tierKey });
            });
        }
    }

    equipListWithTiers = equipListWithTiers.filter(item => applyExtraFilter(item.id));
    renderTierlistView(equipListWithTiers);
}

const tierColors = [
    "#FF5252", "#FF7043", "#FFA726", "#FFCA28", "#FFEE58", "#9CCC65",
    "#4CAF50", "#009688", "#00BCD4", "#2196F3", "#3F51B5", "#673AB7",
    "#9C27B0", "#E91E63", "#9E9E9E"
];

const tierPriority = [
    "EX", "SS+", "SS", "SS-",
    "S++", "S+", "S", "S-", "A+", "A", "A-", "B+", "B", "C", "D", "E", "F", "N/A"
];

function renderTierlistView(equipListWithTiers) {
    let groupedEquips = {};

    equipListWithTiers.forEach(item => {
        const equipId = item.id;
        const tier = item.tier;
        const equipItem = equipDetails[currentMainTab] ? equipDetails[currentMainTab][equipId] : null;
        if (!equipItem) return;

        if (!groupedEquips[tier]) groupedEquips[tier] = [];
        if (!groupedEquips[tier].includes(equipId)) {
            groupedEquips[tier].push(equipId);
        }
    });

    let sortedTiers = Object.keys(groupedEquips).sort((a, b) => {
        let indexA = tierPriority.indexOf(a);
        let indexB = tierPriority.indexOf(b);
        if (indexA === -1) indexA = 999;
        if (indexB === -1) indexB = 999;
        return indexA - indexB;
    });

    const originalOrder = Object.keys(equipDetails[currentMainTab] || {});

    let html = "";
    sortedTiers.forEach((tier, index) => {
        let labelStyle = "";
        if (tier === "EX") {
            labelStyle = "background: var(--bg-ex); color: #fff; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);";
        } else {
            let colorIndex = sortedTiers.includes("EX") ? index - 1 : index;
            let color = tierColors[colorIndex % tierColors.length];
            labelStyle = `background-color: ${color};`;
        }

        groupedEquips[tier].sort((a, b) => {
            let orderA = originalOrder.indexOf(a);
            let orderB = originalOrder.indexOf(b);
            return orderA - orderB;
        });

        let itemsHtml = "";
        groupedEquips[tier].forEach(equipId => {
            const equipItem = equipDetails[currentMainTab][equipId];
            let safeTitle = equipItem.name.replace(/"/g, '&quot;');

            let customStyle = "";
            if (equipItem.code) {
                customStyle = `style="--gear-img: url('https://azurlane.netojuu.com/images/${equipItem.code}.png');"`;
            }
            
            let bgClass = equipItem.box ? `box-${equipItem.box}` : 'box-gray';

            itemsHtml += `<div class="tierlist-icon ${bgClass}" title="${safeTitle}" ${customStyle}></div>`;
        });

        html += `
        <div class="tier-row">
            <div class="tier-label" style="${labelStyle}">
                ${tier}
            </div>
            <div class="tier-items">
                ${itemsHtml}
            </div>
        </div>
        `;
    });

    tierlistViewContainer.innerHTML = html;
}

function renderExtraFilters() {
    if (!extraFiltersView || !currentFilterConfig) return;
    let html = "";
    currentFilterConfig.buttons.forEach(btn => {
        const isActive = currentFilterValue === btn.value ? 'active' : '';
        html += `<button class="extra-filter-btn ${isActive}" onclick="selectExtraFilter('${btn.value}')">${btn.label}</button>`;
    });
    extraFiltersView.innerHTML = html;
}

function selectExtraFilter(val) {
    currentFilterValue = val;
    renderExtraFilters();
    selectSubTab(currentSubTab);
    
    let allEquipForMainTab = Object.keys(equipDetails[currentMainTab] || {});
    let filteredEquip = allEquipForMainTab.filter(id => applyExtraFilter(id));
    renderDetailsView(filteredEquip);
}

function renderDetailsView(equipList) {
    let finalHTML = "";

    let filteredList = equipList.filter(equipId => {
        return equipDetails[currentMainTab] && equipDetails[currentMainTab][equipId];
    });

    const originalOrder = Object.keys(equipDetails[currentMainTab] || {});

    filteredList.sort((a, b) => {
        const tierA = (equipDetails[currentMainTab] && equipDetails[currentMainTab][a]) ? (equipDetails[currentMainTab][a].tier || "Unranked") : "Unranked";
        const tierB = (equipDetails[currentMainTab] && equipDetails[currentMainTab][b]) ? (equipDetails[currentMainTab][b].tier || "Unranked") : "Unranked";

        let indexA = tierPriority.indexOf(tierA);
        let indexB = tierPriority.indexOf(tierB);

        if (indexA === -1) indexA = 999;
        if (indexB === -1) indexB = 999;

        if (indexA !== indexB) { return indexA - indexB; }
        return originalOrder.indexOf(a) - originalOrder.indexOf(b);
    });

    filteredList.forEach(equipId => {
        const equipInfo = equipDetails[currentMainTab][equipId];

        let statsHTML = equipInfo.stats ? equipInfo.stats.join('<br>') : '';
        let descHTML = equipInfo.desc ? equipInfo.desc.map(d => `<div>${d}</div>`).join('') : '';

        // ==========================================
        // 1. NHẬN DIỆN MÔI TRƯỜNG & KHỞI TẠO BIẾN
        // ==========================================
        let isPlane = ["Fighter", "Dive Bomber", "Torpedo Bomber", "Seaplane"].includes(currentMainTab);

        let labelColCannon = "";
        let labelCol5 = "Loại đạn";
        let labelCol6 = "Reload";
        let labelCol7 = "Tầm bắn";

        if (isPlane) {
            labelColCannon = "Pháo";
            labelCol5 = "Vũ khí"; // Gộp vũ khí 1 & 2
            labelCol6 = "Reload";
            // Cột 7 (Range) sẽ bị ẩn đối với máy bay
        } else if (currentMainTab === "AA-gun") {
            labelCol5 = "Tầm bắn";
        }

        // Hàm tiện ích: Đóng gói HTML cho 1 block Vũ khí/Đạn dược (Giao diện Toggle Dotted)
        function buildAmmoHTML(type, dmgRaw, mod, coef, spread, splash, speed) {
            if (!type && !dmgRaw && !mod) return `<div class="ammo-container">-</div>`;
            
            let dmgText = "-";
            if (Array.isArray(dmgRaw) && dmgRaw.length > 0) {
                dmgText = dmgRaw.length === 1 ? `1 x ${dmgRaw[0]}` : dmgRaw.join(" x ");
            } else if (dmgRaw !== undefined && dmgRaw !== null) {
                dmgText = `1 x ${dmgRaw}`;
            }

            let typeHTML = type || "Normal";
            let modHTML = mod || "-";
            let formattedCoef = coef !== null && coef !== undefined ? (Math.round(Number(coef) * 100) + "%") : "-";

            let spreadRow = spread ? `<tr><th>Spread</th><td style="font-weight: bold;">${spread}</td></tr>` : "";
            let splashRow = splash ? `<tr><th>Splash</th><td style="font-weight: bold;">${splash}</td></tr>` : "";
            let speedRow = speed ? `<tr><th>Speed</th><td style="font-weight: bold;">${speed}</td></tr>` : "";

            return `
                <div class="weapon-popup-wrapper" onmouseenter="handleWeaponHover(this, true)" onmouseleave="handleWeaponHover(this, false)" style="position:relative; z-index: 10; display: flex; flex-direction: column; align-items: center; width: max-content; margin: 0 auto;">
                    <div class="weapon-trigger" onclick="handleWeaponClick(this)" style="font-size: 16px; font-weight: bold; color: #e67e22; text-decoration: underline; text-decoration-style: dotted; text-underline-offset: 4px; cursor: pointer;">
                        ${typeHTML}
                    </div>
                    <div class="weapon-popup">
                        <div class="popup-close-btn" onclick="handleWeaponClose(event, this)">×</div>
                        <table class="weapon-details-table">
                            <tr><th>Sát thương</th><td style="color: #c0392b; font-weight: 900;">${dmgText}</td></tr>
                            <tr><th>Ammo Mod</th><td style="font-weight: bold;">${modHTML}</td></tr>
                            <tr><th>Coef</th><td style="color: #8e44ad; font-weight: bold;">${formattedCoef}</td></tr>
                            ${spreadRow}
                            ${splashRow}
                            ${speedRow}
                        </table>
                    </div>
                </div>
            `;
        }


        let contentColCannon = "";
        let contentCol5 = "";
        let contentCol6 = "";
        let contentCol7 = "";

        if (isPlane) {
            // Xử lý Cột Pháo (Áp dụng Toggle Dotted như vũ khí chính)
            if (equipInfo.cannonType && equipInfo.cannonType.length > 0) {
                let cannonsArr = equipInfo.cannonType.map((type, idx) => {
                    let cDmgRaw = equipInfo.cannonDmg ? equipInfo.cannonDmg[idx] : null;
                    let cDmg = "-";
                    if (Array.isArray(cDmgRaw) && cDmgRaw.length > 0) {
                        cDmg = cDmgRaw.length === 1 ? `1 x ${cDmgRaw[0]}` : cDmgRaw.join(" x ");
                    } else if (cDmgRaw !== undefined && cDmgRaw !== null) {
                        cDmg = `1 x ${cDmgRaw}`; 
                    }

                    let cRld = (equipInfo.cannonRld && equipInfo.cannonRld[idx]) ? equipInfo.cannonRld[idx] : "-";
                    let cRange = (equipInfo.cannonRange && equipInfo.cannonRange[idx]) ? equipInfo.cannonRange[idx] : "-";
                    let cAngle = (equipInfo.cannonAngle && equipInfo.cannonAngle[idx]) ? equipInfo.cannonAngle[idx] : null;
                    let angleRow = cAngle ? `<tr><th>Angle</th><td style="font-weight: bold;">${cAngle}</td></tr>` : "";
                    
                    return `
                        <div class="weapon-popup-wrapper" onmouseenter="handleWeaponHover(this, true)" onmouseleave="handleWeaponHover(this, false)" style="position:relative; z-index: 10; display: flex; flex-direction: column; align-items: center; width: max-content; margin: 0 auto;">
                            <div class="weapon-trigger" onclick="handleWeaponClick(this)" style="font-size: 16px; font-weight: bold; color: #e67e22; text-decoration: underline; text-decoration-style: dotted; text-underline-offset: 4px; cursor: pointer;">
                                ${type}
                            </div>
                            <div class="weapon-popup">
                                <div class="popup-close-btn" onclick="handleWeaponClose(event, this)">×</div>
                                <table class="weapon-details-table">
                                    <tr><th>Sát thương</th><td style="color: #c0392b; font-weight: 900;">${cDmg}</td></tr>
                                    <tr><th>Reload</th><td style="color: #27ae60; font-weight: bold;">${cRld}</td></tr>
                                    <tr><th>Range</th><td style="color: #2980b9; font-weight: bold;">${cRange}</td></tr>
                                    ${angleRow}
                                </table>
                            </div>
                        </div>
                    `;
                });
                
                contentColCannon = `<div style="display: flex; flex-direction: column; width: 100%; justify-content: center; gap: 20px;">
                    ${cannonsArr.join('')}
                </div>`;
            } else {
                contentColCannon = `<div class="ammo-container">-</div>`;
            }

            // Xử lý Cột Vũ Khí (Gộp Vũ khí 1 và 2)
            let w1Type = equipInfo.weaponType ? equipInfo.weaponType[0] : null;
            let w1Dmg = equipInfo.dmg ? equipInfo.dmg[0] : null;
            let w1Mod = equipInfo.weaponMod ? equipInfo.weaponMod[0] : null;
            let w1Coef = equipInfo.coef ? equipInfo.coef[0] : null;
            let w1Spread = equipInfo.weaponSpread ? equipInfo.weaponSpread[0] : null;
            let w1Splash = equipInfo.weaponSplash ? equipInfo.weaponSplash[0] : null;
            let w1Speed = equipInfo.weaponSpeed ? equipInfo.weaponSpeed[0] : null;
            let w1HTML = w1Type ? buildAmmoHTML(w1Type, w1Dmg, w1Mod, w1Coef, w1Spread, w1Splash, w1Speed) : "";

            let w2Type = equipInfo.weaponType ? equipInfo.weaponType[1] : null;
            let w2Dmg = equipInfo.dmg ? equipInfo.dmg[1] : null;
            let w2Mod = equipInfo.weaponMod ? equipInfo.weaponMod[1] : null;
            let w2Coef = equipInfo.coef ? equipInfo.coef[1] : null;
            let w2Spread = equipInfo.weaponSpread ? equipInfo.weaponSpread[1] : null;
            let w2Splash = equipInfo.weaponSplash ? equipInfo.weaponSplash[1] : null;
            let w2Speed = equipInfo.weaponSpeed ? equipInfo.weaponSpeed[1] : null;
            let w2HTML = w2Type ? buildAmmoHTML(w2Type, w2Dmg, w2Mod, w2Coef, w2Spread, w2Splash, w2Speed) : "";

            contentCol5 = `<div style="display: flex; flex-direction: column; width: 100%; justify-content: center; gap: 20px;">
                ${w1HTML}
                ${w2HTML}
            </div>`;

            let rldHTML = equipInfo.rld ? equipInfo.rld.map((r, index) => {
                let displayText = (index === 1) ? `Intercept Rld: ${r}` : r;
                return `<div class="rld-item">${displayText}</div>`;
            }).join('') : "-";
            contentCol6 = `<div class="rld-value-container">${rldHTML}</div>`;
        } else {
            let ammoType = equipInfo.ammoType || "Normal";
            if (currentMainTab === "AA-gun") { ammoType = equipInfo.range || equipInfo.ammoType || "-"; }
            let nsSpread = equipInfo.weaponSpread ? (Array.isArray(equipInfo.weaponSpread) ? equipInfo.weaponSpread[0] : equipInfo.weaponSpread) : null;
            let nsSplash = equipInfo.weaponSplash ? (Array.isArray(equipInfo.weaponSplash) ? equipInfo.weaponSplash[0] : equipInfo.weaponSplash) : null;
            let nsSpeed = equipInfo.weaponSpeed ? (Array.isArray(equipInfo.weaponSpeed) ? equipInfo.weaponSpeed[0] : equipInfo.weaponSpeed) : null;
            contentCol5 = buildAmmoHTML(ammoType, equipInfo.dmg, equipInfo.ammoMod, equipInfo.coef, nsSpread, nsSplash, nsSpeed);
            
            let rldHTML = equipInfo.rld ? equipInfo.rld.map(r => `<div class="rld-item">${r}</div>`).join('') : "-";
            contentCol6 = `<div class="rld-value-container">${rldHTML}</div>`;
            
            let rangeHTML = equipInfo.range || "-";
            contentCol7 = `<div class="range-value">${rangeHTML}</div>`;
        }

        let sourceHTML = equipInfo.source ? equipInfo.source.map(src => `<div class="source-item">${src}</div>`).join('') : '';
        let formattedName = equipInfo.name.replace(/ /g, "_");
        let generatedLink = "https://azurlane.koumakan.jp/wiki/" + formattedName;
        if (equipInfo.linkTab !== undefined && equipInfo.linkTab !== null) { generatedLink += "#tabber-Type_" + equipInfo.linkTab; }
        let customStyle = equipInfo.code ? `style="--gear-img: url('https://azurlane.netojuu.com/images/${equipInfo.code}.png');"` : "";
        let bgClass = equipInfo.box ? `box-${equipInfo.box}` : 'box-gray';
        let imgBoxHTML = (equipInfo.link || equipInfo.linkTab !== undefined) 
            ? `<a href="${equipInfo.link || generatedLink}" target="_blank" class="base-box square-box ${bgClass} clickable-equip" ${customStyle}></a>`
            : `<div class="base-box square-box ${bgClass}" ${customStyle}></div>`;

        let rowClass = isPlane ? "row-card-equip plane-layout" : "row-card-equip";

        finalHTML += `
        <div class="${rowClass}">
            <div class="col-equip-info">
                <div class="equip-name-title">${equipInfo.name}</div>
                ${imgBoxHTML}
            </div>
            <div class="col-tier">
                <div class="label-style">Tier</div>
                <div class="tier-value">${equipInfo.tier}</div>
            </div>
            <div class="col-source">
                <div class="label-style">Vị trí thu thập</div>
                <div class="source-value-container">${sourceHTML}</div>
            </div>
            <div class="col-stat">
                <div class="label-style">Stat</div>
                <div class="stat-value">${statsHTML}</div>
            </div>
            
            ${isPlane ? `
            <div class="col-cannon">
                <div class="label-style">${labelColCannon}</div>
                <div class="ammo-container">
                    ${contentColCannon}
                </div>
            </div>
            ` : ""}
            
            <div class="col-ammo">
                <div class="label-style">${labelCol5}</div>
                <div class="ammo-container">
                    ${contentCol5}
                </div>
            </div>
            <div class="col-rld">
                <div class="label-style">${labelCol6}</div>
                ${contentCol6}
            </div>
            ${!isPlane ? `
            <div class="col-range">
                <div class="label-style">${labelCol7}</div>
                ${contentCol7}
            </div>
            ` : ""}
            
            <div class="col-desc">${descHTML}</div>
        </div>
        `;
    });

    detailsViewContainer.innerHTML = finalHTML;
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initEquipPage);
} else {
    initEquipPage();
}


// ==========================================
// POPUP HANDLERS
// ==========================================
let topZIndex = 100;

window.handleWeaponHover = function(el, isHover) {
    let popup = el.querySelector('.weapon-popup');
    let rowCard = el.closest('.row-card-equip');
    let colParent = el.closest('.col-cannon, .col-ammo');
    
    if (!popup.classList.contains('pinned')) {
        if (isHover) {
            topZIndex++;
            el.style.zIndex = topZIndex;
            if(colParent) colParent.style.zIndex = topZIndex;
            if(rowCard) rowCard.style.zIndex = topZIndex;
            popup.classList.add('show');
        } else {
            popup.classList.remove('show');
            if(colParent && !colParent.querySelector('.weapon-popup.pinned')) colParent.style.zIndex = '';
            if(rowCard && !rowCard.querySelector('.weapon-popup.pinned')) rowCard.style.zIndex = '';
        }
    }
};

window.handleWeaponClick = function(el) {
    let wrapper = el.closest('.weapon-popup-wrapper');
    let popup = wrapper.querySelector('.weapon-popup');
    let rowCard = el.closest('.row-card-equip');
    let colParent = el.closest('.col-cannon, .col-ammo');
    
    topZIndex++;
    wrapper.style.zIndex = topZIndex;
    if(colParent) colParent.style.zIndex = topZIndex;
    if(rowCard) rowCard.style.zIndex = topZIndex;
    
    popup.classList.add('pinned');
    popup.classList.add('show');
};

window.handleWeaponClose = function(event, btn) {
    event.stopPropagation();
    let popup = btn.closest('.weapon-popup');
    let wrapper = btn.closest('.weapon-popup-wrapper');
    let rowCard = btn.closest('.row-card-equip');
    let colParent = btn.closest('.col-cannon, .col-ammo');
    
    popup.classList.remove('pinned');
    popup.classList.remove('show');
    wrapper.style.zIndex = '';
    
    if(colParent && !colParent.querySelector('.weapon-popup.pinned')) {
        colParent.style.zIndex = '';
    }
    
    if(rowCard && !rowCard.querySelector('.weapon-popup.pinned')) {
        rowCard.style.zIndex = '';
    }
};