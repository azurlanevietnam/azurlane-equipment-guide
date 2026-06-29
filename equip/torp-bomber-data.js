equipData["Torpedo Bomber"] = {
    subCategories: [
        { id: "tb-light", name: "Giáp Light đơn" }
    ],
    tierlists: {
    }
};

equipDetails["Torpedo Bomber"] = {
    "spearfish": {
        name: "Fairey Spearfish (Prototype)",
        tier: "S++",
        source: ["Gear Lab"],
        stats: ["AVI +65"],
        cannonType: ["4 x 12.7mm MG"],
        cannonDmg: [["1", "69->81"]],
        cannonRld: ["0.60s"],
        cannonRange: ["30"],
        cannonAngle: ["180°"],
        weaponType: ["Torpedo Common", "Rocket RP-3"], 
        weaponMod: ["80% / 110% / 130%", "110% / 100% / 80%"],
        weaponSpread: [null, "12x6"],
        weaponSplash: ["3", "8"],
        weaponSpeed: ["3", "14"],
        dmg: [["4", "288->340"], ["4", "65->77"]], 
        coef: [1.00, 1.00],
        rld: ["10.70s"],
        linkTab: 3,
        desc: [""],
        code: "5/5f/28420",
        box: "rainbow"
    },
    "br-810": {
        name: "Bréguet Br.810",
        tier: "S++",
        source: ["Core Data Shop", "Gear Lab"],
        stats: ["AVI +45"],
        cannonType: ["4 x 7.5mm MG", "1 x 20mm Cannon"],
        cannonDmg: [["1", "35->41"], ["1", "20->24"]],
        cannonRld: ["0.40s", "0.71s"],
        cannonRange: ["24", "36"],
        cannonAngle: ["80°", "80°"],
        weaponType: ["Torpedo Iris"],
        weaponMod: ["80% / 110% / 130%"],
        weaponSpread: [null],
        weaponSplash: ["3"],
        weaponSpeed: ["4"],
        dmg: [["3", "288->340"]],
        coef: [1.00, 1.00],
        rld: ["10.00s", "Đánh chặn: 10.00s"],
        linkTab: 0,
        desc: ["Có thể đánh chặn như Fighter"],
        code: "6/6a/51240",
        box: "yellow"
    },
    "wyvern": {
        name: "Westland Wyvern",
        tier: "S+",
        source: ["Gear Lab"],
        stats: ["AVI +65"],
        cannonType: ["2x 12.7mm M2 (Plane)"],
        cannonDmg: ["11"],
        cannonRld: ["0.60s"],
        cannonRange: ["30"],
        cannonAngle: ["180°"],
        weaponType: ["Torp Wyvern"],
        weaponMod: ["80% / 110% / 130%"],
        weaponSpread: [null],
        weaponSplash: ["3"],
        weaponSpeed: ["3"],
        dmg: [["4", "340->401"]],
        coef: [1.00],
        rld: ["11.64s", "Đánh chặn: 11.64s"],
        linkTab: 0,
        desc: ["Có thể đánh chặn như Fighter"],
        code: "e/e9/28400",
        box: "rainbow"
    }
};