equipData["CA-gun"] = {
    subCategories: [
        { id: "ca-light", name: "Giáp Light Đơn" }
    ],
    tierlists: {
    },
    filterConfig: {
        property: "gunType",
        fallbackItemValue: "ca",
        buttons: [
            { value: "all", label: "Danh sách tổng" },
            { value: "ca", label: "Chỉ CA-Gun" },
            { value: "cb", label: "Chỉ CB-Gun" }
        ]
    }
};

equipDetails["CA-gun"] = {
    "triple-220": {
        name: "Triple 220mm (SM-40 Prototype)",
        gunType: "ca",
        tier: "SS",
        source: ["Springtide Inn Online Event Shop"],
        stats: ["FP +65"],
        ammoType: "AP",
        ammoMod: "80% / 125% / 85%",
        rld: ["7.40s", "Volley Time: 0.50s"],
        linkTab: 0,
        desc: [""],
        code: "c/ca/85800",
        box: "rainbow"
    },
    "triple-203-skcp": {
        name: "Triple 203mm (SKC Prototype)",
        gunType: "ca",
        tier: "SS-",
        source: ["PR6 Research"],
        stats: ["FP +65"],
        ammoType: "AP",
        ammoMod: "85% / 120% / 85%",
        rld: ["7.32s", "Volley Time: 0.50s"],
        linkTab: 0,
        desc: [""],
        code: "5/5c/43160",
        box: "rainbow"
    },
    "single-305-mk8": {
        name: "Triple 305mm (12\"/50 Mk 8)",
        gunType: "cb",
        tier: "S++",
        source: ["Light-Chasing Sea of Stars Event Shop"],
        stats: ["FP +65"],
        ammoType: "AP",
        ammoMod: "60% / 120% / 100%",
        rld: ["8.50s", "Volley Time: 0.00s"],
        linkTab: 0,
        desc: [""],
        code: "c/c2/14000",
        box: "rainbow"
    }
};