shipDetails["BB"] = {
    "new_jersey": {
        name: "New Jersey",
        source: ["Heavy + Special Build", "UR Exchange"],
        faction: "Eagle Union",
        rarity: "Ultra Rare",
        code: "d/d5",
        box: "rainbow",
        equipSlot: [["BBGM"], ["DDGM"], ["AAGM", "AATFGM"]],
        slotAmount: [3, 3, 1],
        slotEff: ["155", "210", "130"]
    },
    "lion": {
        name: "Lion",
        source: ["A Rose on the High Tower Event Build"],
        faction: "Royal Navy",
        rarity: "Ultra Rare",
        code: "1/1a",
        box: "rainbow",
        equipSlot: [["BBGM"], ["CLGM", "DDGM"], ["AAGM", "AATFGM"]],
        slotAmount: [3, 3, 1],
        slotEff: ["170", "200", "120"]
    },
    "vanguard": {
        name: "Vanguard",
        source: ["Heavy + Special Build", "UR Exchange"],
        faction: "Royal Navy",
        rarity: "Ultra Rare",
        code: "c/c2",
        box: "rainbow",
        equipSlot: [["BBGM"], ["CLGM", "DDGM"], ["AAGM", "AATFGM"]],
        slotAmount: [3, 3, 1],
        slotEff: ["145", "180", "130"],
        customRules: [
            {
                type: "FACTION_SLOT_EFF_BONUS",
                targetSlotIndex: 2,           // Slot 3 (index 2 - AA Gun)
                requiredFaction: "Royal Navy", // Faction yêu cầu
                minCount: 1,                  // Tối thiểu 1 trang bị
                bonus: 30                     // Tăng +30% hiệu suất
            }
        ]
    },
    "warspite_kai": {
        name: "Warspite Kai",
        source: ["Warspite + Prototype Shop"],
        faction: "Royal Navy",
        rarity: "Ultra Rare",
        code: "yanzhan_g",
        box: "rainbow",
        equipSlot: [["BBGM"], ["CLGM", "DDGM"], ["AAGM", "AATFGM"]],
        slotAmount: [3, 3, 1],
        slotEff: ["140", "200", "115"],
        customRules: [
            {
                type: "EQUIP_ID_SLOT_EFF_BONUS",
                targetSlotIndex: 0,
                requiredEquipId: "oldladys_royalsword",
                bonus: 10
            }
        ]
    },
};