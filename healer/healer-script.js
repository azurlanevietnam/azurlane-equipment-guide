function renderTierList() {
    const container = document.getElementById('tierlist-container');
    if (!container) return;
    
    let finalHTML = '';

    characterData.forEach(char => {
        let rolesHTML = char.roles.join('<br>');
        let descHTML = char.desc.map(d => `<div>${d}</div>`).join('');

        let equipHTML = '';
        char.equipSlots.forEach(slotArray => {
            let totalInSlot = slotArray.length;
            let isMulti = totalInSlot > 1;
            let clickEvent = isMulti ? ` onclick="cycleEquip(this)"` : '';

            let boxesHTML = '';
            slotArray.forEach((itemId, index) => {
                let stateNumber = index + 1;
                let labelAttr = isMulti ? ` data-label="${stateNumber}/${totalInSlot}"` : '';

                // Tìm thông tin hình ảnh từ equipDetails nếu có
                let gearStyle = '';
                let bgClass = '';
                
                if (window.equipDetails) {
                    for (let cat in window.equipDetails) {
                        if (window.equipDetails[cat][itemId]) {
                            let eqInfo = window.equipDetails[cat][itemId];
                            if (eqInfo.code) {
                                gearStyle = ` style="--gear-img: url('https://azurlane.netojuu.com/images/${eqInfo.code}.png');"`;
                            }
                            if (eqInfo.box) {
                                bgClass = ` box-${eqInfo.box}`;
                            }
                            break;
                        }
                    }
                }

                boxesHTML += `<div class="equip-box ${itemId}${bgClass}" data-state="${stateNumber}"${labelAttr}${gearStyle}></div>`;
            });

            equipHTML += `<div class="equip-slot"${clickEvent}>${boxesHTML}</div>`;
        });

        finalHTML += `
        <div class="row-card">
            <div class="col-name">${char.name}</div>
            <div class="col-image">
                <div class="base-box ${char.bgClass}">
                    <a href="${char.link || '#'}" class="box-link" target="_blank">
                        <img src="${char.image}" alt="${char.name}">
                    </a>
                </div>
            </div>
            <div class="col-tier">
                <div class="label-style">Tier</div>
                <div class="tier-value">${char.tier}</div>
            </div>
            <div class="col-role">
                <div class="label-style">Vai trò</div>
                <div class="role-value">${rolesHTML}</div>
            </div>
            <div class="col-equip">
                <div class="label-style">Trang bị khuyến nghị</div>
                <div class="equip-group">${equipHTML}</div>
            </div>
            <div class="col-desc">${descHTML}</div>
        </div>
        `;
    });

    container.innerHTML = finalHTML;
}

function cycleEquip(slot) {
    const items = Array.from(slot.querySelectorAll('.equip-box'));
    if (items.length <= 1) return;
    const states = items.map(item => item.getAttribute('data-state'));
    states.unshift(states.pop());
    items.forEach((item, index) => {
        item.setAttribute('data-state', states[index]);
    });
}

// Chờ dữ liệu nạp hoàn tất nếu cần
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", renderTierList);
} else {
    renderTierList();
}