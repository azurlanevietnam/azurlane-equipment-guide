shipDetails["CB"] = {
    "guam": {
        name: "Guam",
        source: ["Light-Chasing Sea of Stars Event Build"],
        faction: "Eagle Union",
        rarity: "Ultra Rare",
        code: "0/06",
        box: "rainbow",
        equipSlot: [["CBGM"], ["DDGM"], ["AAGM"]],
        slotAmount: [2, 1, 2],
        slotEff: ["115", "65", "150"]
    },
    "azuma": {
        name: "Azuma",
        source: ["PR2 Research"],
        faction: "Heavy Sakura",
        rarity: "Decisive",
        code: "2/25",
        box: "rainbow",
        equipSlot: [["CBGM", "CAGM"], ["DDGM"], ["AAGM"]],
        slotAmount: [2, 1, 1],
        slotEff: ["100", "60", "110"],
        customRules: [
            {
                type: "SLOT_EFF_BONUS",
                slotIndex: 0,
                equipCategory: "CBGM",
                bonus: 12
            }
        ]
    },
    "agir": {
        name: "Ägir",
        source: ["PR4 Research"],
        faction: "Ironblood",
        rarity: "Decisive",
        code: "c/c8",
        box: "rainbow",
        equipSlot: [["CBGM", "CAGM"], ["TRPM"], ["AAGM"]],
        slotAmount: [2, 1, 1],
        slotEff: ["120", "110", "110"],
        customRules: [
            {
                type: "SLOT_EFF_BONUS",
                slotIndex: 0,
                equipCategory: "CBGM",
                bonus: 12
            }
        ]
    },
    "kronstadt": {
        name: "Kronshtadt",
        source: ["Heavy + Special Build", "UR Exchange"],
        faction: "Northern Parliament",
        rarity: "Ultra Rare",
        code: "7/70",
        box: "rainbow",
        equipSlot: [["CBGM", "CAGM"], ["CLGM"], ["AAGM"]],
        slotAmount: [2, 1, 1],
        slotEff: ["110", "55", "100"],
        customRules: [
            {
                type: "FACTION_SLOT_EFF_BONUS",
                targetSlotIndex: 1, // slot 2 (index 1)
                requiredFaction: "Northern Parliament",
                minCount: 1,
                bonus: 45
            }
        ]
    },
    "brest": {
        name: "Brest",
        source: ["PR5 Research"],
        faction: "Iris Libre",
        rarity: "Decisive",
        code: "b/b2",
        box: "rainbow",
        equipSlot: [["CBGM", "CAGM"], ["DDGM"], ["AAGM"]],
        slotAmount: [2, 1, 1],
        slotEff: ["110", "110", "120"],
    },
    "cherbourg": {
        name: "Cherbourg",
        source: ["Miracle by Midnight Event Build"],
        faction: "Iris Libre",
        rarity: "Super Rare",
        code: "6/6c",
        box: "yellow",
        equipSlot: [["CBGM", "CAGM"], ["CLGM"], ["AAGM"]],
        slotAmount: [2, 1, 1],
        slotEff: ["110", "45", "100"],
        customRules: [
            {
                type: "SLOT_EFF_BONUS",
                slotIndex: 0,
                equipCategory: "CBGM",
                bonus: 10
            }
        ]
    },
    "kala_ideas": {
        name: "Kala Ideas",
        source: ["The Alchemist and the Archipelago of Secrets Event Reward"],
        faction: "Atelier Ryza",
        rarity: "Super Rare",
        code: "7/7b",
        box: "yellow",
        equipSlot: [["CBGM", "CAGM"], ["CLGM"], ["AAGM"]],
        slotAmount: [2, 1, 1],
        slotEff: ["110", "45", "100"],
    },
    "little_agir": {
        name: "Little Ägir",
        source: ["Little Ruler of the Abyssal Kingdom Event Reward"],
        faction: "Ironblood",
        rarity: "Elite",
        code: "c/c0",
        box: "purple",
        equipSlot: [["CBGM", "CAGM"], ["TRPM"], ["AAGM"]],
        slotAmount: [2, 1, 1],
        slotEff: ["120", "110", "110"],
    },
};