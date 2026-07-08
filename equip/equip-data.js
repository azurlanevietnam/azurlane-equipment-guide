const categories = [
    "DD-gun", "CL-gun", "CA-gun", "BB-gun", "AA-gun", 
    "Surface Torpedo", "Submerged Torpedo", "Fighter", 
    "Dive Bomber", "Torpedo Bomber", "Seaplane", "ASW", "Auxiliary", "Augmentation"
];

window.equipData = {};
window.equipDetails = {};

const dataFiles = [
    'aircraft-cannon-data.js',
    'aircraft-torpedo-data.js',
    'aircraft-rocket-data.js',
    'aircraft-bomb-data.js',
    'bb-gun-data.js',
    'cl-gun-data.js',
    'dd-gun-data.js',
    'ca-gun-data.js',
    'aa-gun-data.js',
    'fighter-data.js',
    'dive-bomber-data.js',
    'torp-bomber-data.js',
    'seaplane-data.js',
];

dataFiles.push('equip-script.js');
dataFiles.push('plugin-linkex.js');

dataFiles.forEach(fileName => {
    let script = document.createElement('script');
    script.src = 'equip/' + fileName;
    script.async = false;
    document.head.appendChild(script);
});