equipData["AA-gun"] = {
    subCategories: [
        { id: "aa-dps", name: "DPS Thuần" },
        { id: "aa-stat", name: "Cộng Chỉ Số"},
        { id: "aa-rr", name: "Kéo Range/Reload"}
    ],
    tierlists: {
        "aa-dps": {
            "SS": ["twin-57-mle"],
            "SS-": ["twin-76-mk37"],
            "S++": ["twin-100-mle1945"],
            "S+": ["twin-113-mki"]
        },
        "aa-stat": {
            "SS-": ["twin-76-mk37"],
            "S++": ["twin-57-mle"],
            "S+": ["twin-40-staag"],
            "S": ["twin-134-mki", "twin-80", "twin-40-haze"]
        },
        "aa-rr": {
            "SS-": []
        },
    constants: {
        absoluteCooldown: 0.5
    }
}
};

equipDetails["AA-gun"] = {
    "twin-76-mk37": {
        name: "Twin 76mm RF Mk 37 Gun Mount",
        tier: "SS",
        source: ["Gear lab"],
        stats: ["AA +50", "ACC +15"],
        range: "32",
        reload: 1.00,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "3/31/16480",
        box: "rainbow"
    },
    "twin-57-mle": {
        name: "Twin 57mm Bofors (Mle 1951)",
        tier: "SS-",
        source: ["Gear lab"],
        stats: ["AA +65"],
        range: "30",
        reload: 0.78,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "c/c6/50620",
        box: "rainbow"
    },
    "twin-100-mle1945": {
        name: "Twin 100mm Mle1945 High-Angle Gun",
        tier: "SS-",
        source: ["Gear Lab"],
        stats: ["AA +45"],
        range: "35",
        reload: 1.15,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "9/95/50660",
        box: "yellow"
    },
    "twin-113-mki": {
        name: "Twin 113mm AA (QF Mark I)",
        tier: "S+",
        source: ["7-2, 11-4 Drop", "T4/T5 Royal Tech Box", "Gear Lab"],
        stats: ["AA +45"],
        range: "35",
        reload: 1.36,
        dmg: 142,
        coef: 1.18,
        linkTab: 3,
        desc: [""],
        code: "3/3f/26500",
        box: "yellow"
    },
    "twin-40-staag": {
        name: "Twin 40mm Bofors STAAG",
        tier: "S+",
        source: ["PR1/4/5/6/7 Research", "Gear Lab"],
        stats: ["AA +45", "ACC +10"],
        range: "30",
        reload: 0.80,
        dmg: 142,
        coef: 1.18,
        linkTab: 3,
        desc: [""],
        code: "1/18/26600",
        box: "yellow"
    },
    "twin-134-mki": {
        name: "Twin 134mm AA (QF Mark I)",
        tier: "S",
        source: ["Gear Lab"],
        stats: ["AA +30", "FP +15"],
        range: "35",
        reload: 1.76,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "b/bf/21500",
        box: "yellow"
    },
    "twin-105-skc-na": {
        name: "Twin 105mm AA (SK C/33 na)",
        tier: "S",
        source: ["Gear Lab"],
        stats: ["AA +45"],
        range: "32",
        reload: 1.20,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "3/3d/46360",
        box: "yellow"
    },
    "twin-90-m1939": {
        name: "Twin 90mm AA (Model 1939 Prototype)",
        tier: "S",
        source: ["Gear Lab"],
        stats: ["AA +45"],
        range: "31",
        reload: 1.03,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "6/65/55160",
        box: "yellow"
    },
    "twin-76-mk27": {
        name: "Twin 76mm AA (Mk 27 Mount)",
        tier: "S",
        source: ["Gear Lab"],
        stats: ["AA +45"],
        range: "30",
        reload: 0.72,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "6/60/16080",
        box: "yellow"
    },
    "sextuple-40": {
        name: "Sextuple 40mm Bofors",
        tier: "S",
        source: ["PR3 Research", "Gear Lab"],
        stats: ["AA +45"],
        range: "28",
        reload: 1.18,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "4/4d/26660",
        box: "yellow"
    },
    "twin-127-t89-m2": {
        name: "Twin 127mm AA (Type 89 A1 Mod 2)",
        tier: "S-",
        source: ["Gear Lab"],
        stats: ["AA +45"],
        range: "35",
        reload: 1.50,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "0/06/36660",
        box: "yellow"
    },
    "twin-105-skc": {
        name: "Twin 105mm AA (SK C/33)",
        tier: "S-",
        source: ["9-1, 10-1 Drop", "T4/T4 Ironblood Gear Box", "Gear Lab"],
        stats: ["AA +45"],
        range: "32",
        reload: 1.24,
        dmg: 142,
        coef: 1.18,
        linkTab: 3,
        desc: [""],
        code: "e/e6/46300",
        box: "yellow"
    },
    "twin-100-t98-aa": {
        name: "Twin 100mm AA (Type 98)",
        tier: "S-",
        source: ["PR1 Research"],
        stats: ["AA +45"],
        range: "32",
        reload: 1.28,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "2/20/36560",
        box: "yellow"
    },
    "single-90-m1939": {
        name: "Single 90mm AA (Model 1939)",
        tier: "S-",
        source: ["Gear Lab"],
        stats: ["AA +45"],
        range: "31",
        reload: 0.90,
        dmg: 142,
        coef: 1.18,
        linkTab: 3,
        desc: [""],
        code: "f/fd/55100",
        box: "yellow"
    },
    "twin-40-haze": {
        name: "Twin 40mm Bofors Hazemeyer",
        tier: "S-",
        source: ["PR2/3/4/5/6/7 Research", "Gear Lab"],
        stats: ["AA +45", "ACC +5"],
        range: "30",
        reload: 0.87,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "2/2f/26620",
        box: "yellow"
    },
    "single-55": {
        name: "Single 55mm Gerät 58 AA (Prototype)",
        tier: "A+",
        source: ["Gear Lab"],
        stats: ["AA +45"],
        range: "28",
        reload: 0.45,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "9/9b/46420",
        box: "yellow"
    },
    "quad-40-mk2": {
        name: "Quadruple 40mm Bofors (Mk 2 Mount)",
        tier: "A+",
        source: ["5-4, 11-3, 14-1 Drop", "T4/T5 Eagle Tech Box", "Gear Lab"],
        stats: ["AA +45"],
        range: "28",
        reload: 1.04,
        dmg: 142,
        coef: 1.18,
        linkTab: 3,
        desc: [""],
        code: "c/c1/16400",
        box: "yellow"
    },
    "twin-40-t5": {
        name: "Twin 40mm Bofors (Type 5)",
        tier: "A",
        source: ["PR2 Research", "Gear Lab"],
        stats: ["AA +45"],
        range: "29",
        reload: 0.71,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "0/06/36700",
        box: "yellow"
    },
    "quad-30": {
        name: "Prototype Quadruple 30mm AA Gun Mount",
        tier: "A",
        source: ["PR5 Research", "Gear Lab"],
        stats: ["AA +45"],
        range: "30",
        reload: 0.90,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "8/8d/46400",
        box: "yellow"
    },
    "sextuple-20-m1941": {
        name: "Prototype Sextuple 20mm Scotti AA Gun (Model 1941)",
        tier: "A",
        source: ["PR8 Research"],
        stats: ["AA +45"],
        range: "25",
        reload: 1.00,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "1/12/56260",
        box: "yellow"
    },
    "twin-80": {
        name: "Twin 80mm AA (Type 98)",
        tier: "B+",
        source: ["Gear Lab"],
        stats: ["AA +45"],
        range: "29",
        reload: 1.28,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: ["Khi trang bị trên tàu vanguard của Sakura Empire, tàu +5% FP, giảm còn +2.5% FP trong 3s khi AA-gun khai hỏa."],
        code: "4/48/36740",
        box: "yellow"
    },
    "twin-37-mle": {
        name: "Twin 37mm ACAD (Mle 1936)",
        tier: "B+",
        source: ["PR2 Research", "Gear Lab"],
        stats: ["AA +45"],
        range: "28",
        reload: 0.73,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "a/a8/50600",
        box: "yellow"
    },
    "triple-25-t96": {
        name: "Triple 25mm AA (Type 96 Blast Shield)",
        tier: "B+",
        source: ["PR2 Research", "Gear Lab"],
        stats: ["AA +45"],
        range: "28",
        reload: 0.56,
        dmg: 142,
        coef: 1.18,
        linkTab: 0,
        desc: [""],
        code: "6/63/36360",
        box: "yellow"
    },
    "octuple-40": {
        name: "Octuple 40mm Pom-Pom",
        tier: "B",
        source: ["7-1, 14-2 Drop", "T4/T5 Royal Tech Box", "Gear Lab"],
        stats: ["AA +45"],
        range: "25",
        reload: 1.17,
        dmg: 142,
        coef: 1.18,
        linkTab: 3,
        desc: [""],
        code: "2/2c/26200",
        box: "yellow"
    }
};
for (let key in equipDetails["AA-gun"]) {
    let item = equipDetails["AA-gun"][key];
    if (typeof item.reload === 'number') {
        let volleyTime = 0.75 - (item.reload * 0.2);
        item.rld = [`${item.reload.toFixed(2)}s`, `Volley Time: ${volleyTime.toFixed(2)}s`];
    }
}