const navLinks = [
    { name: "HEALER LIST", url: "index.html" },
    { name: "EQUIPMENT LIST", url: "equip.html" },
    { name: "AA CALCULATOR", url: "aa-caculate.html" }
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
            <a href="https://pbs.twimg.com/media/HLpxb1JWgAAzPG_?format=jpg&name=4096x4096" target="_blank" class="rickroll-btn">TIER ZÚ</a>
        </div>
    `;
});