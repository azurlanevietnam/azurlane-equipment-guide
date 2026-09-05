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
    }
};