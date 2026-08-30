shipDetails["CL"] = {
    "rainbow_cl": {
        "san_diego_kai": {
            name: "San Diego Kai",
            source: ["San Diego + Prototype Shop"],
            faction: "Eagle Union",
            rarity: "Ultra Rare",
            code: "shengdiyage_g",
            box: "rainbow",
            equipSlot: [["CLGM", "DDGM"], ["TRPM"], ["AAGM"]],
            slotAmount: [2, 2, 1],
            slotEff: ["115", "135", "185"],
        },
        "belfast_kai": {
            name: "Belfast Kai",
            source: ["Belfast + Sealane Protector Event Reward"],
            faction: "Royal Navy",
            rarity: "Ultra Rare",
            code: "beierfasite_g",
            box: "rainbow",
            equipSlot: [["CLGM"], ["TRPM"], ["AAGM"]],
            slotAmount: [2, 2, 2],
            slotEff: ["130", "155", "120"],
            customRules: [
                {
                    type: "MULTIPLE_SHIP_TYPE_SLOT_EFF_BONUS",
                    targetSlotIndex: 0,
                    requiredShipType: "CL",
                    minCount: 2,
                    bonus: 20
                },
                {
                    type: "ALWAYS_SLOT_EFF_BONUS",
                    targetSlotIndex: 2,
                    bonus: 30
                }
            ]
        },
        "plymouth": {
            name: "Plymouth",
            source: ["PR5 Research"],
            faction: "Royal Navy",
            rarity: "Decisive",
            code: "e/e3",
            box: "rainbow",
            equipSlot: [["CLGM"], ["TRPM"], ["AAGM"]],
            slotAmount: [3, 1, 1],
            slotEff: ["120", "165", "130"]
        },
    },
    "purple_cl": {
        "aurora": {
            name: "Aurora",
            source: ["Light Pool Build"],
            faction: "Royal Navy",
            rarity: "Elite",
            code: "5/50",
            box: "purple",
            equipSlot: [["CLGM"], ["TRPM"], ["AAGM"]],
            slotAmount: [1, 2, 1],
            slotEff: ["135", "155", "130"]
        },
    },
};