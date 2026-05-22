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
            tier: "SS",
            stats: ["FP +65"],
            ammoType: "AP",
            ammoMod: "40% / 135% / 125%",
            rld: "23.14s",
            linkTab: 0,
            desc: [""]
        },
        "triple-406-mkii": {
            name: "Prototype Triple 406mm Mk.II Main Gun Mount",
            tier: "SS-",
            source: ["A Rose on the High Tower Event Shop"],
            stats: ["FP +65"],
            ammoType: "HE",
            ammoMod: "145% / 110% / 90%",
            rld: "23.34s",
            linkTab: 0,
            desc: [""]
        },
        "triple-406-m1940": {
            name: "Triple 406mm (Improved Model 1940 Prototype)",
            tier: "S+",
            source: ["Paradiso of Shackled Light Event Shop"],
            stats: ["FP +65"],
            ammoType: "SAP",
            ammoMod: "100% / 160% / 50%",
            rld: "24.28s",
            linkTab: 0,
            desc: [""]
        },
        "triple-406-mk7": {
            name: "Triple 406mm (16\"/50 Mk 7)",
            tier: "S+",
            source: ["Mirror Involution Event Shop", "Gear Lab"],
            stats: ["FP +65"],
            ammoType: "HE",
            ammoMod: "140% / 110% / 90%",
            rld: "24.22s",
            linkTab: 0,
            desc: [""]
        },
        "twin-457-mka": {
            name: "Twin 457mm (Mark A Prototype)",
            tier: "S",
            source: ["PR2 Research", "Gear Lab", "Prototype Shop"],
            stats: ["FP +65"],
            ammoType: "AP+",
            ammoMod: "55% / 145% / 125%",
            rld: "20.65s",
            linkTab: 0,
            desc: [""]
        },
        "triple-460-t94": {
            name: "Triple 460mm (Type 94)",
            tier: "S",
            source: ["Violet Tempest, Blooming Lycoris Event Shop"],
            stats: ["FP +65"],
            ammoType: "AP",
            ammoMod: "55% / 140% / 135%",
            rld: "30.59s",
            linkTab: 0,
            desc: [""]
        }
    },
    "CL-gun": {
        "quad-152": {
            name: "Quadruple 152mm",
            tier: "SS",
            stats: ["FP +65"],
            source: ["PR5 Research"],
            linkTab: 0,
            desc: [""]
        }
    }
};