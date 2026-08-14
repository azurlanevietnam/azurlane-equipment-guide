shipDetails["CA"] = {
    "drake": {
        name: "Drake",
        source: ["PR4 Research"],
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
}