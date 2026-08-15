shipDetails["CL"] = {
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
    "belfast_kai": {
        name: "Belfast Kai",
        source: ["Belfast + ... Event Reward"],
        faction: "Royal Navy",
        rarity: "Super Rare",
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
};