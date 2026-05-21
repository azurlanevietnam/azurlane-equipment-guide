const mainTabsContainer = document.getElementById('mainTabs');
const subTabsContainer = document.getElementById('subTabs');
const tierlistViewContainer = document.getElementById('tierlistView');
const detailsViewContainer = document.getElementById('detailsView');

let currentMainTab = categories[3]; 
let currentSubTab = "";

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
        return;
    }

    renderSubTabs(data.subCategories);
    selectSubTab('all');

    let allEquipForMainTab = Object.keys(equipDetails[currentMainTab] || {});
    renderDetailsView(allEquipForMainTab);
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
    
    renderTierlistView(equipListWithTiers);
}

const tierColors = [
    "#FF5252",
    "#FF7043",
    "#FF9800",
    "#FFB74D",
    "#FFCA28",
    "#FFEE58",
    "#D4E157",
    "#9CCC65",
    "#66BB6A",
    "#4DB6AC",
    "#26C6DA",
    "#29B6F6",
    "#42A5F5",
    "#5C6BC0",
    "#7E57C2",
    "#AB47BC",
    "#D81B60",
    "#F06292"
];

const tierPriority = [
    "SS+", "SS+", "SS", "SS-", 
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
        let color = tierColors[index % tierColors.length];
        
        groupedEquips[tier].sort((a, b) => {
            let orderA = originalOrder.indexOf(a);
            let orderB = originalOrder.indexOf(b);
            return orderA - orderB;
        });

        let itemsHtml = "";
        groupedEquips[tier].forEach(equipId => {
            const equipItem = equipDetails[currentMainTab][equipId];
            itemsHtml += `<div class="tierlist-icon ${equipId}" title="${equipItem.name}"></div>`;
        });

        html += `
        <div class="tier-row">
            <div class="tier-label" style="background-color: ${color};">
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

function renderDetailsView(equipList) {
    let finalHTML = "";
    
    const originalOrder = Object.keys(equipDetails[currentMainTab] || {});

    equipList.sort((a, b) => {
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
    
    equipList.forEach(equipId => {
        const equipInfo = equipDetails[currentMainTab] ? equipDetails[currentMainTab][equipId] : null;
        if (!equipInfo) return;

        let statsHTML = equipInfo.stats ? equipInfo.stats.join('<br>') : '';
        let sourceHTML = equipInfo.source ? equipInfo.source.join('<br>') : '';
        let descHTML = equipInfo.desc ? equipInfo.desc.map(d => `<div>${d}</div>`).join('') : '';
        
        let ammoTypeHTML = equipInfo.ammoType || "-";
        let ammoModHTML = equipInfo.ammoMod || "-";

        finalHTML += `
        <div class="row-card-equip">
            <div class="col-equip-info">
                <div class="equip-name-title">${equipInfo.name}</div>
                <div class="base-box square-box ${equipId}"></div>
            </div>
            
            <div class="col-tier">
                <div class="label-style">Tier</div>
                <div class="tier-value">${equipInfo.tier}</div>
            </div>
            
            <div class="col-source">
                <div class="label-style">Vị trí thu thập</div>
                <div class="source-value">${sourceHTML}</div>
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
            
            <div class="col-desc">${descHTML}</div>
        </div>
        `;
    });
    
    detailsViewContainer.innerHTML = finalHTML;
}

document.addEventListener("DOMContentLoaded", initEquipPage);