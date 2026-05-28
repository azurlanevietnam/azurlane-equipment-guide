const mainTabsContainer = document.getElementById('mainTabs');
const subTabsContainer = document.getElementById('subTabs');
const tierlistViewContainer = document.getElementById('tierlistView');
const detailsViewContainer = document.getElementById('detailsView');
const extraFiltersView = document.getElementById('extraFiltersView');

let currentMainTab = categories[3];
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
    "#FF5252",
    "#FF7043",
    "#FFA726",
    "#FFCA28",
    "#FFEE58",
    "#9CCC65",
    "#4CAF50",
    "#009688",
    "#00BCD4",
    "#2196F3",
    "#3F51B5",
    "#673AB7",
    "#9C27B0",
    "#E91E63",
    "#9E9E9E"
];

const tierPriority = [
    "EX", "SS+", "SS", "SS-",
    "S++", "S+", "S", "S-", "A+", "A", "A-", "B+", "B", "C", "D", "E", "F"
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

        if (indexA !== indexB) {
            return indexA - indexB;
        }

        let orderA = originalOrder.indexOf(a);
        let orderB = originalOrder.indexOf(b);
        return orderA - orderB;
    });

    filteredList.forEach(equipId => {
        const equipInfo = equipDetails[currentMainTab][equipId];

        let statsHTML = equipInfo.stats ? equipInfo.stats.join('<br>') : '';
        let descHTML = equipInfo.desc ? equipInfo.desc.map(d => `<div>${d}</div>`).join('') : '';

        let ammoTypeHTML = equipInfo.ammoType || "-";
        let ammoModHTML = equipInfo.ammoMod || "-";
        let rldHTML = equipInfo.rld 
            ? equipInfo.rld.map(r => `<div class="rld-item">${r}</div>`).join('') 
            : "-";

        let sourceHTML = equipInfo.source
            ? equipInfo.source.map(src => `<div class="source-item">${src}</div>`).join('')
            : '';

        let formattedName = equipInfo.name.replace(/ /g, "_");
        let generatedLink = "https://azurlane.koumakan.jp/wiki/" + formattedName;
        if (equipInfo.linkTab !== undefined && equipInfo.linkTab !== null) {
            generatedLink += "#tabber-Type_" + equipInfo.linkTab;
        }

        let customStyle = "";
        if (equipInfo.code) {
            customStyle = `style="--gear-img: url('https://azurlane.netojuu.com/images/${equipInfo.code}.png');"`;
        }

        let bgClass = equipInfo.box ? `box-${equipInfo.box}` : 'box-gray';

        let imgBoxHTML = "";
        if (equipInfo.link || equipInfo.linkTab !== undefined) {
            let finalLink = equipInfo.link || generatedLink;
            imgBoxHTML = `<a href="${finalLink}" target="_blank" class="base-box square-box ${bgClass} clickable-equip" ${customStyle}></a>`;
        } else {
            imgBoxHTML = `<div class="base-box square-box ${bgClass}" ${customStyle}></div>`;
        }

        finalHTML += `
        <div class="row-card-equip">
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
            
            <div class="col-ammo">
                <div class="label-style">Loại đạn</div>
                <div class="ammo-container">
                    <div class="ammo-type-value">${ammoTypeHTML}</div>
                    <div class="ammo-mod-value">${ammoModHTML}</div>
                </div>
            </div>
            
            <div class="col-rld">
                <div class="label-style">Reload</div>
                <div class="rld-value-container">${rldHTML}</div>
            </div>
            
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