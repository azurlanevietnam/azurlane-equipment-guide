const categories = [
    "DD-gun", "CL-gun", "CA/CB-gun", "BB-gun", "AA-gun", 
    "Surface Torpedo", "Submerged Torpedo", "Fighter", 
    "Dive Bomber", "Torpedo Bomber", "ASW", "Auxiliary", "Augmentation"
];

window.equipData = {};
window.equipDetails = {};

const dataFiles = [
    'bb-gun-data.js',
    'cl-gun-data.js',
    'dd-gun-data.js',
    'ca-gun-data.js',
];

dataFiles.push('equip-script.js');

dataFiles.forEach(fileName => {
    let script = document.createElement('script');
    script.src = fileName;
    script.async = false;
    document.head.appendChild(script);
});