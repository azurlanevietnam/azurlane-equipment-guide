shipDetails["CA"] = {
    "rainbow_ca": {
        "drake": {
            name: "Drake",
            source: ["PR3 Research"],
            faction: "Royal Navy",
            rarity: "Decisive",
            code: "d/da",
            box: "rainbow",
            equipSlot: [["CAGM"], ["TRPM"], ["AAGM"]],
            slotAmount: [2, 1, 1],
            slotEff: ["130", "120", "125"],
            customRules: [
                {
                    type: "EQUIP_ID_SLOT_EFF_BONUS",
                    targetSlotIndex: 0, // Slot 1 (index 0)
                    requiredEquipId: "privateers_heroism", // Yêu cầu trang bị Augment này
                    bonus: 10 // +10% Slot Efficiency
                }
            ]
        },
        "unzen": {
            name: "Unzen",
            source: ["Effulgence Before Eclipse Event Build"],
            faction: "Heavy Sakura",
            rarity: "Ultra Rare",
            code: "a/a4",
            box: "rainbow",
            equipSlot: [["CAGM"], ["TRPM"], ["AAGM"]],
            slotAmount: [2, 2, 1],
            slotEff: ["140", "150", "130"],
        },
        "hindenburg": {
            name: "Hindenburg",
            source: ["PR6 Research"],
            faction: "Ironblood",
            rarity: "Decisive",
            code: "d/db",
            box: "rainbow",
            equipSlot: [["CAGM"], ["TRPM"], ["CAGM", "AAGM"]],
            slotAmount: [2, 1, 1],
            slotEff: ["130", "110", "130"],
        },
        "napoli": {
            name: "Napoli",
            source: ["PR7 Research"],
            faction: "Sardegna Empire",
            rarity: "Decisive",
            code: "b/b8",
            box: "rainbow",
            equipSlot: [["CAGM"], ["CLGM"], ["AAGM"]],
            slotAmount: [1, 2, 1],
            slotEff: ["150", "70", "105"],
        },
        "moskva": {
            name: "Moskva",
            source: ["Springtide Inn Online Event Build"],
            faction: "Northern Parliament",
            rarity: "Ultra Rare",
            code: "6/6e",
            box: "rainbow",
            equipSlot: [["CAGM"], ["DDGM"], ["AAGM"]],
            slotAmount: [2, 1, 1],
            slotEff: ["135", "100", "135"],
        },
        "gouden_leeuw": {
            name: "Gouden Leeuw",
            source: ["PR8 Research"],
            faction: "Kingdom of Tulipa",
            rarity: "Decisive",
            code: "1/11",
            box: "rainbow",
            equipSlot: [["CBGM", "CAGM"], ["DDGM"], ["AAGM"]],
            slotAmount: [2, 1, 2],
            slotEff: ["105", "55", "175"],
            customRules: [
                {
                    type: "SLOT_EFF_BONUS",
                    triggerSlotIndex: 0,
                    slotIndex: 0,
                    equipCategory: "CBGM",
                    bonus: 15
                },
                {
                    type: "SLOT_EFF_BONUS",
                    triggerSlotIndex: 0,
                    slotIndex: 1,
                    equipCategory: "CBGM",
                    bonus: 15
                }
            ]
        },
    },
}