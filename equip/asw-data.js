equipDetails["ASW"] = {
    "yellow_asw": {
        "hedgehog": {
            name: "Hedgehog",
            aswType: "dc", // <-- Phân loại Depth Charge
            tier: "N/A",
            source: ["Daily Raid Task Reward"],
            faction: "Royal Navy",
            equippable: ["DD", "CL"],
            stats: ["ASW +45"],
            fleetLimit: 1,
            limit: 1,
            rld: ["3.33s"],
            dmg: ["1", "279"],
            linkTab: 0,
            desc: [""],
            code: "4/42/25800",
            box: "yellow",
        },
        "i-sonar": {
            name: "Improved Sonar",
            aswType: "sonar", // <-- Phân loại Sonar
            tier: "N/A",
            source: ["Daily Raid Task Reward"],
            faction: "Universal",
            equippable: ["DD", "CL"],
            stats: ["ASW +44", "ACC +15"],
            limit: 1,
            linkTab: 3,
            desc: ["Tăng 8 đơn vị tầm quét sonar. Tàu ngầm địch bị quét trúng sẽ giảm 5% chỉ số TRP."],
            code: "f/f6/3000",
            box: "yellow",
        },
        "tbm-3s-asw": {
            name: "General Motors TBM-3S Avenger (ASW)",
            aswType: "airborne", // <-- Phân loại Máy bay ASW
            tier: "N/A",
            source: ["Light-Chasing Sea of Stars Event Shop"],
            faction: "Eagle Union",
            equippable: ["BB", "CVL"],
            stats: ["ASW +45"],
            rld: ["2.86s"],
            dmg: ["1", "120"],
            linkTab: 0,
            desc: [""],
            box: "yellow",
            code: "f/fb/4360"
        },
        "gannet": {
            name: "Fairey Gannet",
            aswType: "airborne", // <-- Phân loại Máy bay ASW
            tier: "N/A",
            source: ["Gear Lab"],
            faction: "Royal Navy",
            equippable: ["BB", "CVL"],
            stats: ["ASW +45"],
            rld: ["3.06s"],
            dmg: ["2", "91"],
            linkTab: 0,
            desc: ["Mỗi 10s, phóng bổ sung một máy bay Fairey Gannet (mang theo một ngư lôi). Giới hạn kích hoạt năm lần mỗi trận."],
            box: "yellow",
            code: "4/42/4260"
        },
    },
    "purple_asw": {
        "improved-dc": {
            name: "Improved Depth Charge",
            aswType: "dc", // <-- Phân loại Depth Charge
            tier: "N/A",
            source: ["Daily Raid Reward"],
            faction: "Eagle Union",
            equippable: ["DD", "CL"],
            stats: ["ASW +25"],
            limit: 1,
            rld: ["2.99s"],
            dmg: ["3", "61"],
            linkTab: 3,
            desc: [""],
            box: "purple",
            code: "a/aa/4100"
        },
        "fi-282": {
            name: "Flettner Fl 282 Kolibri",
            aswType: "koln", // <-- Phân loại Độc quyền Köln
            source: ["Core Data Shop"],
            faction: "Ironblood",
            exclusive: ["köln_kai", "köln_meta"],
            stats: ["ASW +27"],
            linkTab: 0,
            desc: [""],
            code: "c/c7/740",
            box: "purple",
        },
    },
};