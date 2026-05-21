const categories = [
    "DD-gun", "CL-gun", "CA/CB-gun", "BB-gun", "AA-gun", 
    "Surface Torpedo", "Submerged Torpedo", "Fighter", 
    "Dive Bomber", "Torpedo Bomber", "ASW", "Auxiliary", "Augmentation"
];

const equipData = {
    "BB-gun": {
        subCategories: [
            { id: "bb-light", name: "Mục tiêu giáp Light" }
        ],
        tierlists: {
            "bb-light": {
                "SS": ["triple-406-mkii"],
            }
        }
    },
    "CL-gun": {
        subCategories: [
            { id: "cl-ap", name: "AP CL Gun" }
        ],
        tierlists: {
            "cl-ap": {
                "SS": ["quad-152"]
            }
        }
    }
};

const equipDetails = {
    "BB-gun": {
        "quad-305-skc": {
            name: "Quadruple 305mm (SK C39 Prototype)",
            source: ["PR8 Research"],
            tier: "SS+",
            stats: ["FP +65"],
            ammoType: "AP",
            ammoMod: "40% / 135% / 125%",
            desc: ["Gây sát thương rất tốt trên diện rộng, phù hợp dọn dẹp mob."]
        },
        "triple-406-mkii": {
            name: "Prototype Triple 406mm Mk.II Main Gun Mount",
            tier: "SS",
            source: ["A Rose on the High Tower Event Shop"],
            stats: ["FP +65"],
            ammoType: "HE",
            ammoMod: "145% / 110% / 90%",
            desc: ["Đạn HE mạnh nhất game, ưu tiên tuyệt đối cho boss giáp nhẹ."]
        },
        "triple-406-m1940": {
            name: "Triple 406mm (Improved Model 1940 Prototype)",
            tier: "S++",
            source: ["Paradiso of Shackled Light Event Shop"],
            stats: ["FP +65"],
            ammoType: "SAP",
            ammoMod: "100% / 160% / 50%",
            desc: ["Đạn HE mạnh nhất game, ưu tiên tuyệt đối cho boss giáp nhẹ."]
        },
        "twin-457-mka": {
            name: "Twin 457mm (Mark A Prototype)",
            tier: "S+",
            source: ["PR2 Research", "Gear Lab", "Prototype Shop"],
            stats: ["FP +65"],
            ammoType: "AP+",
            ammoMod: "55% / 145% / 125%",
            desc: ["Súng BB bắn nhanh nhất hiện tại, mạnh nhất khi đối đầu với giáp Hạng Nặng."]
        }
    },
    "CL-gun": {
        "quad-152": {
            name: "Quadruple 152mm",
            tier: "SS",
            stats: ["FP +45", "AA +15"],
            source: ["Nghiên cứu PR5"],
            desc: ["Súng CL đa dụng tốt nhất."]
        }
    }
};