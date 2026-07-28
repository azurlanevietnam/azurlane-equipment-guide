function initFleetBuilder() {
    const container = document.getElementById('fleet-builder-container');
    if (!container) return;

    console.log("Fleet Builder initialized. Waiting for data...");
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initFleetBuilder);
} else {
    initFleetBuilder();
}