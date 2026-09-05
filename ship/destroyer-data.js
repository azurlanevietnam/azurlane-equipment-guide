shipDetails["DD"] = {
    "rainbow_dd": {
        "specialized_bulin_custom_mkiii": {
            name: "Specialized Bulin Custom MKIII",
            source: ["Prototype Shop Shop", "Pass Reward", "Event Reward"],
            faction: "Universal",
            rarity: "Ultra Rare",
            code: "c/cb",
            box: "rainbow",
            equipSlot: [["DDGM"], ["AAGM"], ["AAGM"]],
            slotAmount: [1, 1, 1],
            slotEff: ["100", "100", "100"]
        },
        "eldridge_kai": {
            name: "Eldridge Kai",
            source: ["Eldridge + Prototype Shop"],
            faction: "Eagle Union",
            rarity: "Ultra Rare",
            code: "aierdeliqi_g",
            box: "rainbow",
            equipSlot: [["DDGM"], ["TRPM"], ["AAGM"]],
            slotAmount: [1, 2, 2],
            slotEff: ["140", "130", "125"]
        },
        "laffey_ii": {
            name: "Laffey II",
            source: ["Light-Chasing Sea of Stars Event Shop"],
            faction: "Eagle Union",
            rarity: "Ultra Rare",
            code: "0/0c",
            box: "rainbow",
            equipSlot: [["DDGM"], ["TRPM"], ["AAGM"]],
            slotAmount: [1, 2, 1],
            slotEff: ["140", "140", "180"]
        },
        "william_d_porter": {
            name: "William D. Porter",
            source: ["A Note Through the Firmament Event Shop"],
            faction: "Eagle Union",
            rarity: "Ultra Rare",
            code: "b/bb",
            box: "rainbow",
            equipSlot: [["DDGM"], ["TRPM"], ["AAGM"]],
            slotAmount: [1, 2, 1],
            slotEff: ["140", "140", "180"],
            customRules: [
                {
                    type: "VANGUARD_COUNT_EXCLUDING_SELF_SLOT_EFF_BONUS",
                    targetSlotIndex: 2,
                    minCount: 1,
                    bonus: 50
                }
            ]
        },
        "trafalgar": {
            name: "Trafalgar",
            source: ["A Rose on the High Tower Event Shop"],
            faction: "Royal Navy",
            rarity: "Ultra Rare",
            code: "7/72",
            box: "rainbow",
            equipSlot: [["DDGM"], ["TRPM"], ["AAGM"]],
            slotAmount: [1, 2, 2],
            slotEff: ["125", "120", "160"],
            customRules: [
                {
                    type: "ALWAYS_SLOT_EFF_BONUS",
                    targetSlotIndex: 0,
                    bonus: 15
                }
            ]
        },
        "shimakaze": {
            name: "Shimakaze",
            source: ["Heavy + Special Build", "UR Exchange"],
            faction: "Heavy Sakura",
            rarity: "Ultra Rare",
            code: "9/91",
            box: "rainbow",
            equipSlot: [["DDGM"], ["TRPM"], ["AAGM"]],
            slotAmount: [1, 2, 1],
            slotEff: ["85", "170", "90"],
        },
        "yuudachi_kai": {
            name: "Yuudachi Kai",
            source: ["Yuudachi + Prototype Shop"],
            faction: "Heavy Sakura",
            rarity: "Ultra Rare",
            code: "xili_g",
            box: "rainbow",
            equipSlot: [["DDGM"], ["TRPM"], ["AAGM"]],
            slotAmount: [2, 1, 1],
            slotEff: ["100", "160", "85"],
        },
        "z52": {
            name: "Z52",
            source: ["Substellar Crepuscule Event Shop"],
            faction: "Ironblood",
            rarity: "Ultra Rare",
            code: "e/e4",
            box: "rainbow",
            equipSlot: [["DDGM"], ["TRPM"], ["AAGM"]],
            slotAmount: [1, 2, 1],
            slotEff: ["170", "125", "150"],
        },
        "mogador": {
            name: "Mogador",
            source: ["Light of the Martyrium Event Shop"],
            faction: "Vichya Dominion",
            rarity: "Ultra Rare",
            code: "4/41",
            box: "rainbow",
            equipSlot: [["DDGM"], ["TRPM"], ["AAGM"]],
            slotAmount: [2, 1, 1],
            slotEff: ["130", "130", "120"],
        },
    }
};