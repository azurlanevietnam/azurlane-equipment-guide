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
        box: "rainbow",
        equipSlot: [["CLGM"], ["TRPM"], ["AAGM"]],
        slotAmount: [2, 2, 2],
        slotEff: ["130", "155", "120"],
        customRules: [
            {
                type: "MULTIPLE_SHIP_TYPE_SLOT_EFF_BONUS",
                targetSlotIndex: 0, // Slot 1 (index 0)
                requiredShipType: "CL", // Loại tàu Light Cruiser
                minCount: 2, // Đội hình có từ 2 CL trở lên (tức là ngoài Belfast Kai còn có ít nhất 1 CL khác)
                bonus: 20 // +0.2 slot efficiency tương đương +20%
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