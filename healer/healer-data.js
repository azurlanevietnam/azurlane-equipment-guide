const characterData = [
    {
        name: "Raffaello",
        link: "https://azurlane.koumakan.jp/wiki/Raffaello",
        image: "https://azurlane.netojuu.com/images/0/03/RaffaelloShipyardIcon.png",
        bgClass: "box-rainbow",
        tier: "SS++",
        roles: ["Heal", "Giáp ảo", "Dmg chủ lực", "Buff dmg"],
        equipSlots: [
            ["twin-457-mka", "quad-305-skc", "triple-406-mkii", "twin-406-mk4", "triple-380-skc", "triple-380-mle", "triple-406-mle", "triple-406-mk6"],
            ["quad-152", "triple-180-b1pi", "triple-152-mkxxv", "twin-150-tbtsk", "triple-180-b1p", "triple-155-t3k", "triple-155-t3"],
            ["twin-76-mk37", "twin-134-mki-tf", "staag", "twin-134-mki", "twin-40-haze"],
            ["afct", "hpfcr", "t1-apc", "shs", "npov", "autoloader"],
            ["t1-apc", "shs", "npov", "autoloader"],
            ["bowgun", "officers-sword"]
        ],
        desc: [
            "BB dmg chủ lực nhưng lại sở hữu khả năng heal và tạo giáp ảo cực khủng. Đặc biệt bọc lót cực tốt cho những tàu có %HP thấp trong đội hình.",
            "Bá Vương số 1 từ W14+ đổ lên, bất kể dưới vai trò healer hay là một tàu chủ lực."
        ]
    },
    {
        name: "Unicorn Kai",
        link: "https://azurlane.koumakan.jp/wiki/Unicorn",
        image: "https://azurlane.netojuu.com/images/c/ce/UnicornKaiShipyardIcon.png",
        bgClass: "box-yellow",
        tier: "SS",
        roles: ["Heal chủ lực", "Preload", "Dmg", "Phòng không", "Buff dmg"],
        equipSlots: [
            ["f4u-vf17", "xf5u-ff", "f7f-tigercat", "f6f-hellcat", "bf-109g-cb", "la-9-cb", "f6f-hvar"],
            ["spearfish", "br810", "wyvern", "barracuda", "saiun-t21"],
            ["twin-76-mk37", "staag", "twin-40-haze"],
            ["steam-cata", "frontier-medal"],
            ["steam-cata", "homing-beacon", "tbm-vt-51", "tbm-asw", "swordfish-asw", "aviation-gas"],
            ["hunting-bow", "scepter"]
        ],
        desc: [
            "Healer chuyên heal hàng trước với hiệu suất cực khủng, đồng thời sở hữu cả khả năng heal hàng sau tương đối ấn tượng.",
            "Sát thương rất tốt nhờ có preload, phù hợp với mọi môi trường từ đi farm cho tới mở map mới.",
            "Nhược điểm là tàu khá mỏng, dễ hẹo trong các môi trường có khả năng sát thương hàng sau mạnh."
        ]
    },
    {
        name: "Cowpens",
        link: "https://azurlane.koumakan.jp/wiki/Cowpens",
        image: "https://azurlane.netojuu.com/images/d/d8/CowpensShipyardIcon.png",
        bgClass: "box-yellow",
        tier: "SS-",
        roles: ["Heal", "Dmg chủ lực", "Buff dmg", "Phòng không"],
        equipSlots: [
            ["la-9-cb", "bf-109g-cb", "f4u-vf17", "xf5u-ff", "f7f-tigercat", "f6f-hellcat", "f6f-hvar"],
            ["spearfish", "br810", "saiun-t21", "wyvern", "barracuda"],
            ["twin-76-mk37", "staag", "twin-40-haze"],
            ["steam-cata", "frontier-medal"],
            ["steam-cata", "homing-beacon", "evmm", "tbm-vt-51", "tbm-asw", "swordfish-asw", "aviation-gas"],
            ["hunting-bow", "scepter"]
        ],
        desc: [
            "Healer có khả năng heal cả hàng trước lẫn hàng sau, đặc biệt heal hàng sau mạnh nhất nhì game thời điểm hiện tại.",
            "Khả năng gây sát thương cực khủng, thậm chí có thể san sẻ vai trò sát thương chủ lực với BB UR.",
            "Trong môi trường W14+ mạnh ngang ngửa Unicorn nếu kẹp cùng đội hình với nhau."
        ]
    },
    {
        name: "Aquila",
        link: "https://azurlane.koumakan.jp/wiki/Aquila",
        image: "https://azurlane.netojuu.com/images/9/93/AquilaShipyardIcon.png",
        bgClass: "box-yellow",
        tier: "S++",
        roles: ["Heal", "Giáp ảo", "Dmg", "Phòng không", "Buff AA"],
        equipSlots: [
            ["f4u-vf17", "xf5u-ff", "f7f-tigercat", "f6f-hellcat", "bf-109g-cb", "la-9-cb", "f6f-hvar"],
            ["f4u-vf17", "xf5u-ff", "f7f-tigercat", "f6f-hellcat", "bf-109g-cb", "la-9-cb", "f6f-hvar"],
            ["spearfish", "br810", "wyvern", "barracuda", "saiun-t21"],
            ["steam-cata", "frontier-medal"],
            ["steam-cata", "homing-beacon", "aviation-gas"],
            ["hunting-bow", "scepter"]
        ],
        desc: [
            "Healer có khả năng heal cả hàng trước lẫn hàng sau, sát thương đầu ra mạnh và khả năng chống sốc dmg rất tốt",
            "Ưu tiên sử dụng trong các đội hình đánh Boss kể từ W13+."
        ]
    },
    {
        name: "Volga",
        link: "https://azurlane.koumakan.jp/wiki/Volga",
        image: "https://azurlane.netojuu.com/images/f/fe/VolgaShipyardIcon.png",
        bgClass: "box-yellow",
        tier: "S+",
        roles: ["Heal", "Dmg"],
        equipSlots: [
            ["xf5u-ff", "f7f-tigercat", "f6f-hellcat", "f4u-vf17", "bf-109g-cb", "la-9-cb", "f6f-hvar"],
            ["tenrai", "skyraider", "xsb3c", "sb2c"],
            ["spearfish", "br810", "wyvern", "barracuda", "saiun-t21"],
            ["steam-cata", "frontier-medal"],
            ["steam-cata", "homing-beacon", "evmm", "aviation-gas"],
            ["hunting-bow", "scepter"]
        ],
        desc: [
            "Healer có khả năng heal cả hàng trước lẫn hàng sau, vừa multi-heal vừa heal chỉ định các tàu có %HP thấp tốt, sát thương đầu ra tốt.",
            "Là phiên bản yếu hơn của Cowpens, ưu tiên lựa chọn nếu không sở hữu Cowpens."
        ]
    },
    {
        name: "Zuihou",
        link: "https://azurlane.koumakan.jp/wiki/Zuihou",
        image: "https://azurlane.netojuu.com/images/6/6e/ZuihouShipyardIcon.png",
        bgClass: "box-yellow",
        tier: "S+",
        roles: ["Heal chủ lực", "Phòng không"],
        equipSlots: [
            ["f4u-vf17", "xf5u-ff", "f7f-tigercat", "f6f-hellcat", "bf-109g-cb", "la-9-cb", "f6f-hvar"],
            ["spearfish", "br810", "wyvern", "barracuda", "saiun-t21"],
            ["twin-76-mk37", "staag", "twin-40-haze"],
            ["steam-cata", "frontier-medal"],
            ["steam-cata", "homing-beacon", "tbm-vt-51", "tbm-asw", "swordfish-asw", "aviation-gas"],
            ["hunting-bow", "scepter"]
        ],
        desc: [
            "Healer có khả năng heal cả hàng trước lẫn hàng sau, năng lực heal khủng nhất nhì game thời điểm hiện tại.",
            "Nhược điểm là thủ quá mỏng, dễ bị đột tử nếu hàng sau bị dồn dmg liên tục."
        ]
    },
    {
        name: "Perseus",
        link: "https://azurlane.koumakan.jp/wiki/Perseus",
        image: "https://azurlane.netojuu.com/images/7/72/PerseusShipyardIcon.png",
        bgClass: "box-yellow",
        tier: "S",
        roles: ["Heal chủ lực", "Cross-heal", "Preload"],
        equipSlots: [
            ["f4u-vf17", "xf5u-ff", "f7f-tigercat", "f6f-hellcat", "bf-109g-cb", "la-9-cb", "f6f-hvar"],
            ["spearfish", "br810", "wyvern", "barracuda", "saiun-t21"],
            ["twin-76-mk37", "staag", "twin-40-haze"],
            ["steam-cata", "frontier-medal"],
            ["steam-cata", "homing-beacon", "tbm-vt-51", "tbm-asw", "swordfish-asw", "aviation-gas"],
            ["hunting-bow", "scepter"]
        ],
        desc: [
            "Healer có khả năng heal cả hàng trước lẫn hàng sau, trên lý thuyết là healer có lực heal mạnh nhất game.",
            "Thực tế sử dụng khi auto, gần như toàn bộ heal & sát thương đều bị dồn hết vào 5s đầu game, dẫn tới bị overkill và overheal, sát thương & khả năng heal duy trì đều rất tệ trong phần còn lại của trận.",
            "Do có cross heal và preload, thực tê đây vẫn là một trong những lựa chọn rất thân thiện đối với newbie giai đoạn đầu game."
        ]
    },
    {
        name: "Painlevé",
        link: "https://azurlane.koumakan.jp/wiki/Painlevé",
        image: "https://azurlane.netojuu.com/images/e/e2/Painlev%C3%A9ShipyardIcon.png",
        bgClass: "box-yellow",
        tier: "S",
        roles: ["Heal chủ lực", "Dmg", "Buff dmg", "Buff thủ"],
        equipSlots: [
            ["f4u-vf17", "xf5u-ff", "f7f-tigercat", "f6f-hellcat", "bf-109g-cb", "la-9-cb", "f6f-hvar"],
            ["f4u-vbf-94", "suisei-t12a", "tenrai", "sb2c"],
            ["spearfish", "br810", "wyvern", "barracuda", "saiun-t21"],
            ["steam-cata", "frontier-medal"],
            ["steam-cata", "homing-beacon", "aviation-gas"],
            ["hunting-bow", "scepter"]
        ],
        desc: [
            "Healer chuyên heal hàng trước với hiệu suất rất tốt.",
            "Dmg cơ bản lẫn khả năng bổ trợ dmg & phòng thủ cho team đều khá tốt."
        ]
    },
    {
        name: "Ryuuhou",
        link: "https://azurlane.koumakan.jp/wiki/Ryuuhou",
        image: "https://azurlane.netojuu.com/images/b/bd/RyuuhouShipyardIcon.png",
        bgClass: "box-yellow",
        tier: "S-",
        roles: ["Heal chủ lực", "Phòng không"],
        equipSlots: [
            ["f4u-vf17", "xf5u-ff", "f7f-tigercat", "f6f-hellcat", "bf-109g-cb", "la-9-cb", "f6f-hvar"],
            ["spearfish", "br810", "wyvern", "barracuda", "saiun-t21"],
            ["twin-76-mk37", "staag", "twin-40-haze"],
            ["steam-cata", "frontier-medal"],
            ["steam-cata", "homing-beacon", "tbm-vt-51", "tbm-asw", "swordfish-asw", "aviation-gas"],
            ["hunting-bow", "scepter"]
        ],
        desc: [
            "Healer đơn mục tiêu có hiệu suất mạnh nhất, tuy nhiên hạn sử dụng chỉ vỏn vẹn đúng 3 lượt heal mỗi trận.",
            "Thủ khá mỏng, dễ bị đột tử nếu hàng sau bị dồn dmg liên tục."
        ]
    },
    {
        name: "North Carolina",
        link: "https://azurlane.koumakan.jp/wiki/North_Carolina",
        image: "https://azurlane.netojuu.com/images/4/47/North_CarolinaShipyardIcon.png",
        bgClass: "box-yellow",
        tier: "S-",
        roles: ["Heal chủ lực", "Dmg", "Phòng không", "Buff thủ"],
        equipSlots: [
            ["quad-305-skc", "triple-406-mkii", "twin-457-mka", "triple-406-m1940", "triple-406-mk7", "triple-406-mle", "triple-380-mle", "triple-406-mk6"],
            ["quad-152", "triple-180-b1pi", "triple-152-mkxxv", "twin-150-tbtsk", "triple-180-b1p", "triple-155-t3k", "triple-155-t3"],
            ["twin-134-mki-tf", "twin-105-skc-tf", "twin-127-mk38-tf"],
            ["afct", "hpfcr", "t1-apc", "shs", "npov", "autoloader"],
            ["t1-apc", "shs", "npov", "autoloader"],
            ["north-caro-aug"]
        ],
        desc: [
            "BB healer chuyên heal hàng trước, sở hữu hiệu suất heal rất tốt. Tuy nhiên, khả năng heal chỉ được kích hoạt trong môi trường địch có máy bay, đạt hiệu quả tối ưu ở W13, W15 & W16.",
            "Khả năng gây sát thương, phòng không và buff thủ cho hàng sau khá tốt."
        ]
    },
    {
        name: "Shouhou Kai",
        link: "https://azurlane.koumakan.jp/wiki/Shouhou",
        image: "https://azurlane.netojuu.com/images/7/71/ShouhouKaiShipyardIcon.png",
        bgClass: "box-purple",
        tier: "A",
        roles: ["Heal chủ lực", "Buff dmg"],
        equipSlots: [
            ["tenrai", "f4u-vbf-94", "suisei-t12a", "skyraider", "xsb3c", "sb2c"],
            ["spearfish", "br810", "wyvern", "barracuda", "saiun-t21", "ryuusei-kai", "vit-2-mc"],
            ["twin-76-mk37", "staag", "twin-40-haze"],
            ["steam-cata", "frontier-medal"],
            ["steam-cata", "homing-beacon", "evmm", "tbm-vt-51", "tbm-asw", "swordfish-asw", "aviation-gas"],
            ["scepter", "hunting-bow"]
        ],
        desc: [
            "Healer chuyên heal hàng trước với khả năng heal khá tốt, đồng thời có khả năng buff sát thương cho CV cùng team khá tốt.",
            "Thủ khá mỏng, dễ bị đột tử nếu hàng sau bị dồn dmg liên tục."
        ]
    }
];