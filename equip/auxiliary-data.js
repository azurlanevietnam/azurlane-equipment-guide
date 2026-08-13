equipData["Auxiliary"] = {
    subCategories: [
        { id: "aux-ultility", name: "Đa dụng" }
    ],
    tierlists: {}
};

equipDetails["Auxiliary"] = {
    "rainbow_aux": {
        "t93_pot": {
            name: "Type 93 Pure Oxygen Torpedo",
            tier: "N/A",
            source: ["Core Data Shop"],
            faction: "Heavy Sakura",
            stats: ["TRP +118", "RLD +13"],
            equippable: ["DD", "DDG", "CL", "CA", "CB", "SS", "SSV"],
            linkTab: 3,
            desc: [],
            code: "5/59/2600",
            box: "rainbow"
        },
        "admiralty_fct": {
            name: "Admiralty Fire Control Table",
            tier: "N/A",
            source: ["Core Data Shop"],
            faction: "Royal Navy",
            stats: ["FP +46", "ACC +65"],
            equippable: ["BB", "BC", "BBV", "BM"],
            limit: 1,
            fleetLimit: 2,
            linkTab: 0,
            desc: ["Tàu mang trang bị này được giảm 15% thời gian hồi loạt pháo kích đầu tiên và giảm 2 điểm phân tán của pháo chính."],
            code: "c/c4/3580",
            box: "rainbow"
        },
    },
    "yellow_aux": {
        "rpg-adventure": {
            name: "RPG Adventure Interface",
            tier: "N/A",
            source: ["From Zero to Hero Event Reward"],
            faction: "Universal",
            stats: ["HP +640"],
            fleetLimit: 2,
            linkTab: 0,
            desc: ["Trong trận đấu, kích hoạt ngẫu nhiên một trong ba hiệu ứng sau:"],
            code: "c/c1/150280",
            box: "yellow"
        },
        "hydraulic-rudder": {
            name: "Improved Hydraulic Rudder",
            tier: "N/A",
            source: ["All Series Research"],
            faction: "Eagle Union",
            unequippable: ["IXM", "IXv", "IXs"],
            stats: ["EVA +49", "HP +72"],
            limit: 1,
            linkTab: 0,
            desc: ["Trong trận đấu, mỗi 20s, tàu mang trang bị này có 30% cơ hội kích hoạt hiệu ứng né tránh mọi sát thương trong 2s."],
            code: "4/48/1760",
            box: "yellow"
        },
        "hpfcr": {
            name: "High Performance Fire Control Radar",
            tier: "N/A",
            source: ["PR3/4/5/6/7 Research"],
            faction: "Eagle Union",
            stats: ["FP +46", "ACC +65"],
            equippable: ["BB", "BC", "BBV", "BM"],
            limit: 1,
            linkTab: 0,
            desc: ["Tàu mang trang bị này được giảm 15% thời gian hồi loạt pháo kích đầu tiên."],
            code: "3/3e/1260",
            box: "yellow"
        },
        "6crh-ap": {
            name: "6CRH Armor Piercing Shell",
            tier: "N/A",
            source: ["Core Data Shop"],
            faction: "Royal Navy",
            stats: ["FP +57", "ACC +23"],
            equippable: ["BB", "BC", "BBV", "BM"],
            limit: 1,
            linkTab: 0,
            desc: ["Nếu tàu mang trang bị này có faction là Royal Navy, tăng 30% sát thương chí mạng. Hiệu ứng không cộng dồn."],
            code: "b/bf/1060",
            box: "yellow"
        },
        "frontier_medal": {
            name: "Frontier Medal",
            tier: "N/A",
            source: ["Collection Reward"],
            stats: ["AVI +118", "HP +72"],
            equippable: ["CV", "CVL"],
            linkTab: 0,
            desc: ["Trong chế độ Exercise (PvP), khi được trang bị trên flagship: Tăng 10% sát thương gây ra của CV/CVL hai phe & giảm 10%  sát thương gây ra của BB/BC hai phe."],
            code: "2/22/820",
            box: "yellow"
        },
        "goldburn": {
            name: "Goldburn",
            tier: "N/A",
            source: ["World-Spanning Arclight Event Reward"],
            stats: ["HP +640"],
            limit: 1,
            fleetLimit: 2,
            linkTab: 0,
            desc: ["Nếu tàu mang trang bị này là tàu hàng trước hoặc thuộc faction SSSS, tàu được tăng 38 RLD. Nếu tàu là kỳ hạm, CV hoặc CVL, phóng một loạt barrage đặc biệt 25s sau khi trận đấu bắt đầu."],
            code: "e/e9/89400",
            box: "yellow"
        },
        "steam_catapult": {
            name: "Steam Catapult",
            tier: "N/A",
            source: ["T4/T5 Tech Box"],
            stats: ["AVI +118", "HP +90"],
            equippable: ["CV", "CVL", "BBV"],
            linkTab: 3,
            desc: [""],
            code: "9/96/1400",
            box: "yellow"
        },
        "angels_feather": {
            name: "Angel's Feather",
            tier: "N/A",
            source: ["Core Data Shop"],
            faction: "Iris Orthodoxy",
            stats: ["AVI +106", "HP +15"],
            equippable: ["CV", "CVL", "BBV", "SFS", "SFV", "SFM"],
            linkTab: 0,
            desc: [""],
            code: "5/5f/51260",
            box: "yellow"
        },
    },
    "purple_aux": {
        "albion_erp": {
            name: "Albion's Exercise Report",
            tier: "N/A",
            source: ["Core Data Shop"],
            faction: "Royal Navy",
            stats: ["HP +130", "AVI 32"],
            linkTab: 0,
            fleetLimit: 2,
            desc: ["Trong trận đấu, mỗi 15s, tàu mang trang bị này sẽ kích hoạt ngẫu nhiên một trong các hiệu ứng sau: 1 - Nhận một lớp giáp ảo tương đương 3% HP. 2 - Hồi 2% HP. 3 - Phóng một loạt barrage ngư lôi đặc biệt. 4 - Phóng một loạt barrage đạn pháo đặc biệt."],
            code: "a/a7/3640",
            box: "purple"
        },
        "anti_em_cmd": {
            name: "Anti-EM Commands",
            tier: "N/A",
            source: ["EM Countermeasures -Simulation Experiment- Event Reward"],
            stats: ["HP +530"],
            unequippable: ["IXs", "IXv", "IXm"],
            linkTab: 0,
            fleetLimit: 1,
            desc: ["Trong trận đấu, mỗi 15s, tàu mang trang bị này sẽ kích hoạt ngẫu nhiên một trong các hiệu ứng sau: 1 - Nhận một lớp giáp ảo tương đương 3% HP. 2 - Hồi 2% HP. 3 - Phóng một loạt barrage ngư lôi đặc biệt. 4 - Phóng một loạt barrage đạn pháo đặc biệt."],
            code: "9/95/3980",
            box: "purple"
        },
        "repair_toolkit": {
            name: "Repair Toolkit",
            tier: "N/A",
            source: ["3-4, 10-3, 14-1 Drop", "Any T3/4 Tech Box"],
            stats: ["HP +530"],
            equippable: ["All"],
            linkTab: 3,
            desc: ["Trong trận đấu, mỗi 15s, tàu mang trang bị này sẽ hồi 1% HP."],
            code: "d/d5/2400",
            box: "purple"
        },
        "homing_beacon": {
            name: "Homing Beacon",
            tier: "N/A",
            source: ["Core Data Shop"],
            faction: "Royal Navy",
            stats: ["AVI +65"],
            equippable: ["CV", "CVL", "BBV"],
            limit: 1,
            linkTab: 0,
            desc: ["Giảm 4% thời gian reload không kích."],
            code: "2/24/680",
            box: "purple"
        },
        "aviation_manjuu": {
            name: "Elite Aviation Maintenance Manjuu",
            tier: "N/A",
            source: ["Core Data Shop"],
            stats: ["AVI +65"],
            equippable: ["CV", "CVL", "BBV"],
            limit: 1,
            linkTab: 0,
            desc: ["Tăng 4% sát thương không kích, nhưng đồng thời tăng 4% thời gian reload không kích."],
            code: "c/c9/3940",
            box: "purple"
        },
        "100150_aviation_gasoline": {
            name: "100/150 Aviation Gasoline",
            tier: "N/A",
            source: ["Core Data Shop"],
            faction: "Eagle Union",
            stats: ["AVI +75"],
            equippable: ["CV", "CVL", "BBV"],
            linkTab: 0,
            desc: ["Tăng 5 SPD & 140 HP cho toàn bộ máy bay trên tàu được trang bị. Hiệu ứng không cộng dồn."],
            code: "d/d4/660",
            box: "purple"
        },
        "drop_tank": {
            name: "Drop Tank",
            tier: "N/A",
            source: ["5-3 Drop", "Any T3/T4 Tech Box"],
            stats: ["AVI +75", "HP +64"],
            equippable: ["CV", "CVL", "BBV"],
            linkTab: 3,
            desc: ["Tăng 120 HP cho toàn bộ máy bay trên tàu được trang bị. Hiệu ứng không cộng dồn."],
            code: "2/2b/2100",
            box: "purple"
        },
    }
};