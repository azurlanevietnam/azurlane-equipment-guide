equipData["Surface Torpedo"] = {
    subCategories: [
        { id: "trp-light", name: "Giáp Light Đơn" }
    ],
    tierlists: {
    },
    filterConfig: {
        property: "torpType",
        fallbackItemValue: "trp",
        buttons: [
            { value: "all", label: "Danh Sách Tổng" },
            { value: "trp", label: "Chỉ Torpedo" },
            { value: "gm", label: "Chỉ Missile" }
        ]
    }
};

equipDetails["Surface Torpedo"] = {
    "quint-610": {
        name: "610mm Quintuple Torpedo Mount",
        torpType: "trp",
        tier: "N/A",
        source: ["Gear Lab"],
        faction: "Heavy Sakura",
        stats: ["TRP +70"],
        ammoType: "Torp",
        ammoMod: "80% / 100% / 130%",
        rld: ["28.60s"],
        dmg: ["5", "190"],
        range: "80-120",
        coef: 1.00,
        linkTab: 0,
        desc: [],
        code: "0/05/35300",
        box: "rainbow"
    },
    "quint-533-hom": {
        name: "533mm Quintuple Homing Torpedo Mount",
        torpType: "trp",
        tier: "N/A",
        source: ["Gear Lab"],
        faction: "Ironblood",
        stats: ["TRP +70"],
        ammoType: "Torp",
        ammoMod: "80% / 100% / 130%",
        rld: ["29.40s"],
        dmg: ["5", "145"],
        range: "70-110",
        coef: 1.00,
        linkTab: 0,
        desc: ["Ngư lôi từ trường."],
        code: "7/7b/45200",
        box: "rainbow"
    },
    "quad-533-mag": {
        name: "533mm Improved Quadruple Magnetic Torpedo Mount",
        torpType: "trp",
        tier: "N/A",
        source: ["Welcome to Little Academy Mileston Event Shop", "Substellar Crepuscule Event Shop"],
        faction: "Ironblood",
        stats: ["TRP +45"],
        ammoType: "Torp",
        ammoMod: "80% / 100% / 130%",
        rld: ["25.70s"],
        dmg: ["4", "157"],
        range: "70-110",
        coef: 1.00,
        linkTab: 0,
        desc: ["Ngư lôi từ trường."],
        code: "6/64/45160",
        box: "yellow"
    },
    "sy_1a": {
        name: "SY-1A Missile",
        torpType: "gm",
        tier: "N/A",
        source: ["Spring Festive Fiasco Event Reward"],
        faction: "Dragon Empery",
        stats: ["TRP +45"],
        ammoType: "Missile",
        ammoMod: "130% / 110% / 80%",
        rld: ["25.60s"],
        dmg: ["4", "317"],
        range: "115-125",
        coef: 1.00,
        linkTab: 0,
        desc: ["Tên lửa dẫn đường.", "Có 50% khả năng gây cháy (phân loại cháy DD)."],
        code: "0/05/56020",
        box: "yellow"
    },
    "sy_1": {
        name: "SY-1 Missile",
        torpType: "gm",
        tier: "N/A",
        source: ["Core Data Shop"],
        faction: "Dragon Empery",
        stats: ["TRP +45"],
        ammoType: "Missile",
        ammoMod: "130% / 110% / 80%",
        rld: ["26.27s"],
        dmg: ["4", "264"],
        range: "120",
        coef: 1.00,
        linkTab: 0,
        desc: ["Tên lửa dẫn đường.", "Có 50% khả năng gây cháy (phân loại cháy DD)."],
        code: "7/77/56000",
        box: "yellow"
    },
}