const dmgTabsContainer = document.getElementById('dmgTabs');
const dmgTierlistViewContainer = document.getElementById('dmgTierlistView');

const armorTabs = ["Giáp Light", "Giáp Medium", "Giáp Heavy"];
const planeCategories = ["Fighter", "Dive Bomber", "Torpedo Bomber", "Seaplane"];

// --- [LOGIC TÍNH TOÁN CŨ - GIỮ NGUYÊN] ---
function getPlaneDetails(planeId) {
    if (!window.equipDetails) return null;
    for (let cat of planeCategories) {
        if (window.equipDetails[cat] && window.equipDetails[cat][planeId]) {
            return window.equipDetails[cat][planeId];
        }
    }
    return null;
}

function calculatePlaneDamage(planeId, armorTypeIndex) {
    const plane = getPlaneDetails(planeId);
    if (!plane || !plane.weapons || !plane.weaponCount) return 0;

    let totalDamage = 0;
    plane.weapons.forEach((wId, index) => {
        let wData = null;
        let isBomb = false; 

        if (window.aircraftTorpedoes && window.aircraftTorpedoes[wId]) wData = window.aircraftTorpedoes[wId];
        else if (window.aircraftRockets && window.aircraftRockets[wId]) wData = window.aircraftRockets[wId];
        else if (window.aircraftBombs && window.aircraftBombs[wId]) {
            wData = window.aircraftBombs[wId];
            isBomb = true;
        }

        if (!wData) return;

        let dmgRaw = (wData.dmg && wData.dmg.length > 0) ? wData.dmg[0] : "0";
        let baseDmg = parseFloat(dmgRaw.split('->')[0]);
        let count = plane.weaponCount[index] || 1;
        let mods = wData.mod ? wData.mod.split('/').map(s => parseFloat(s.trim())) : [100, 100, 100];
        let armorMod = (mods[armorTypeIndex] !== undefined ? mods[armorTypeIndex] : 100) / 100;
        let hitChance = wData.hitchance ? parseFloat(wData.hitchance) / 100 : 1.0;
        let aviRatio1 = isBomb ? (945 * 0.8 + 100) / (945 * 1.0 + 100) : 1.0;

        totalDamage += (baseDmg * count * armorMod * hitChance * aviRatio1);
    });

    if (plane.box === "rainbow") {
        totalDamage += (1057 / 1037 * 840 - 840) * 3;
    }
    return Math.round(totalDamage); 
}

// --- [LOGIC MỚI: TỰ ĐỘNG QUÉT DANH SÁCH] ---
function getAllPlanes() {
    let allPlanes = [];
    planeCategories.forEach(cat => {
        if (window.equipDetails[cat]) {
            Object.keys(window.equipDetails[cat]).forEach(id => {
                allPlanes.push(id);
            });
        }
    });
    return allPlanes;
}

function renderTabs() {
    let html = "";
    armorTabs.forEach((tabName, index) => {
        html += `<button class="main-tab-btn" onclick="selectTab(${index})" id="dmg-tab-${index}">${tabName}</button>`;
    });
    dmgTabsContainer.innerHTML = html;
}

function selectTab(index) {
    document.querySelectorAll('.main-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`dmg-tab-${index}`).classList.add('active');
    renderTierList(index);
}

function renderTierList(armorTypeIndex) {
    let listToCalc = getAllPlanes(); // Tự động lấy mọi plane
    let damageGroups = {}; 

    listToCalc.forEach(planeId => {
        let dmg = calculatePlaneDamage(planeId, armorTypeIndex);
        if (dmg > 0) {
            if (!damageGroups[dmg]) damageGroups[dmg] = [];
            damageGroups[dmg].push(planeId);
        }
    });

    let sortedDamages = Object.keys(damageGroups).sort((a, b) => b - a);
    let html = "";
    let totalTiers = sortedDamages.length;

    sortedDamages.forEach((dmgValue, index) => {
        let planeIds = damageGroups[dmgValue];
        let labelStyle = "";
        
        if (index === 0) {
            labelStyle = "background: var(--bg-ex); color: #fff; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);";
        } else {
            let hue = (totalTiers > 2) ? ((index - 1) / (totalTiers - 2)) * 220 : 0;
            labelStyle = `background-color: hsl(${hue}, 65%, 55%); color: #fff; font-weight: 900; text-shadow: 1px 1px 2px rgba(0,0,0,0.4);`;
        }

        let itemsHtml = "";
        planeIds.forEach(planeId => {
            const planeInfo = getPlaneDetails(planeId);
            let safeTitle = (planeInfo.name || "Unknown").replace(/"/g, '&quot;');
            let customStyle = planeInfo.code ? `style="--gear-img: url('https://azurlane.netojuu.com/images/${planeInfo.code}.png');"` : "";
            let bgClass = planeInfo.box ? `box-${planeInfo.box}` : 'box-gray';
            itemsHtml += `<div class="tierlist-icon ${bgClass}" title="${safeTitle}" ${customStyle}></div>`;
        });

        html += `
        <div class="tier-row">
            <div class="tier-label" style="${labelStyle} font-size: 20px;">${Number(dmgValue).toLocaleString('en-US')}</div>
            <div class="tier-items">${itemsHtml}</div>
        </div>`;
    });

    dmgTierlistViewContainer.innerHTML = html || "<div style='text-align:center; padding: 20px;'>Không tìm thấy dữ liệu máy bay.</div>";
}

function tryInitPage() {
    if (window.equipDetails && Object.keys(window.equipDetails).length > 0) {
        renderTabs();
        selectTab(0);
    } else {
        setTimeout(tryInitPage, 50);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('dmgTabs')) tryInitPage();
});