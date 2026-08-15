const navLinks = [
    { name: "FLEET BUILDER", url: "index.html" },
    { name: "EQUIPMENT LIST", url: "equip.html" },
    { name: "PLANE DMG BURST TIERLIST", url: "planedmg.html" },
    { name: "HEALER LIST", url: "hearler-tierlist.html" },
    { name: "AA CALCULATOR", url: "aa-caculate.html" },
];

document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("global-navbar");
    if (!navbarContainer) return;

    const currentFilename = window.location.pathname.split("/").pop() || "index.html";

    let navButtonsHtml = "";
    navLinks.forEach(link => {
        const isActive = currentFilename === link.url ? "active" : "";
        navButtonsHtml += `<a href="${link.url}" class="nav-item-btn ${isActive}">${link.name}</a>`;
    });

    navbarContainer.innerHTML = `
        <div class="nav-left">
            <div class="menu-container">
                <div class="menu-trigger">☰ MENU</div>
                <div class="side-drawer">
                    <div class="drawer-grid">
                        ${navLinks.map(link => `<a href="${link.url}" class="drawer-box">${link.name}</a>`).join('')}
                    </div>
                </div>
            </div>
            <a href="index.html" class="nav-logo">
                <img src="https://cdn2.steamgriddb.com/icon_thumb/db261d4f615f0e982983be499e57ccda.png" alt="Logo">
            </a>
            <div class="nav-direct-links">
                ${navButtonsHtml}
            </div>
        </div>
        <div class="nav-right">
            <a href="https://pbs.twimg.com/media/HPxDNfcaEAAVMqp?format=jpg&name=4096x4096" target="_blank" class="rickroll-btn">TIER ZÚ</a>
        </div>
    `;

    // ========================================================
    // LOGIC TỰ ĐỘNG ẨN/HIỆN NAVBAR KHỦNG CHIẾN KHÔNG BỊ VƯỚNG MODAL
    // ========================================================
    let lastScrollTop = 0;
    const delta = 5;

    window.addEventListener("scroll", () => {
        // 1. Nếu bất kỳ modal chọn tàu/trang bị nào đang mở -> Giữ nguyên trạng thái Navbar, không ẩn
        const activeModal = document.querySelector(".modal-overlay[style*='display: flex'], .modal-overlay[style*='display:block']");
        if (activeModal) return;

        let st = window.pageYOffset || document.documentElement.scrollTop;

        if (Math.abs(lastScrollTop - st) <= delta) return;

        if (st <= 0) {
            // Đang ở đầu trang -> Luôn hiện
            navbarContainer.classList.remove("nav-hidden");
        } else if (st > lastScrollTop && st > 70) {
            // Cuộn chuột xuống -> Thu lại
            navbarContainer.classList.add("nav-hidden");
        } else {
            // Cuộn chuột lên -> Hiển thị lại
            navbarContainer.classList.remove("nav-hidden");
        }

        lastScrollTop = st;
    }, { passive: true });
});