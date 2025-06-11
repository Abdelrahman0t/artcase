export class PhoneSettings {
    type : string;
    modell : string;
    stock : boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
    cameraX: number;
    cameraY: number;
    cameraWidth: number;
    cameraHeight: number;
    cameraRadius: number;
    url : string
    price : number;

    constructor(
        type : string,

        modell : string,
        stock : boolean,
        
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        cameraX: number,
        cameraY: number,
        cameraWidth: number,
        cameraHeight: number,
        cameraRadius: number,
        url : string,
    price : number

    ) {
        this.type = type;
        this.modell = modell;
        this.stock = stock;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.cameraX = cameraX;
        this.cameraY = cameraY;
        this.cameraWidth = cameraWidth;
        this.cameraHeight = cameraHeight;
        this.cameraRadius = cameraRadius;
        this.url = url;
        this.price = price
    }
}















export class PhoneSettingsT {
    type : string;

    modell : string;
    stock : boolean;
    bwidth : number;
    bheight : number;

    sku : string;
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
    cameraX: number;
    cameraY: number;
    cameraWidth: number;
    cameraHeight: number;
    cameraRadius: number;
    url : string;
    price : number;


    constructor(
        type : string,

        modell : string,
        stock : boolean,
        bwidth : number,
        bheight : number,

        sku : string,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        cameraX: number,
        cameraY: number,
        cameraWidth: number,
        cameraHeight: number,
        cameraRadius: number,
        url : string,
      price : number

    ) {
        this.type = type;
        this.modell = modell;
        this.stock = stock;
        this.bwidth = bwidth;
        this.bheight = bheight;

        this.sku = sku;
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.cameraX = cameraX;
        this.cameraY = cameraY;
        this.cameraWidth = cameraWidth;
        this.cameraHeight = cameraHeight;
        this.cameraRadius = cameraRadius;
        this.url = url;
        this.price = price
    }}


export const iphone_14_t = new PhoneSettingsT(
    'customed rubber case',
    'iphone 14',
    true,
    1176,
    2060,
    'PremiumPhoneCase-iPhone-14-SnapCaseGloss',
    (1176 - 835)  / 2,        // x
    (2060 - 1730) / 2,        // y
    1176 - 341,        // width
    2060 - 330,        // height
    135,         // radius

    (1176 - 820)  / 2,        // cameraX
    (2060 - 1730) / 2,        // cameraY
    480,        // cameraWidth
    500,        // cameraHeight
    150,          // cameraRadius
    '/tough/iPhone_14_t.png',
    30
);



export const iphone_14_plus_t = new PhoneSettingsT(
    'customed rubber case',
    'iphone 14 plus',

    true,

    1290 ,
    2220 ,
    'PremiumPhoneCase-iPhone-14-Plus-SnapCaseGloss',
    (1176 - 835)  / 2,        // x
    (2060 - 1730) / 2,        // y
    1176 - 341,        // width
    2060 - 330,        // height
    135,         // radius

    (1176 - 825)  / 2,        // cameraX
    (2060 - 1740) / 2,        // cameraY
    377,        // cameraWidth
    395,        // cameraHeight
    120 ,         // cameraRadius
    'tough/iPhone_14_Plus_t.png',
    30
);



export const iphone_14_pro_t = new PhoneSettingsT(
    'customed rubber case',
    'iphone 14 pro',

    true,

    1176,
    2060,
    'PremiumPhoneCase-iPhone-14-Pro-SnapCaseGloss',
    (1176 - 835)  / 2,        // x
    (2060 - 1730) / 2,        // y
    1176 - 341,        // width
    2060 - 330,        // height
    135,         // radius

    (1176 - 820)  / 2,        // cameraX
    (2060 - 1730) / 2,        // cameraY
    485,        // cameraWidth
    505,        // cameraHeight
    135 ,         // cameraRadius
    'tough/iPhone_14_Pro_t.png',
    30
);



export const iphone_14_pro_max_t = new PhoneSettingsT(
    'customed rubber case',
    'iphone 14 pro max',

    true,

    1251 ,
    2218,
    'PremiumPhoneCase-iPhone-14-Pro-Max-ToughCaseGloss',
    (1176 - 865)  / 2,        // x
    (2060 - 1750) / 2,        // y
    1176 - 315,        // width
    2060 - 310,        // height
    139,         // radius

    (1176 - 824)  / 2,        // cameraX
    (2060 - 1720) / 2,        // cameraY
    440,        // cameraWidth
    445,        // cameraHeight
    120,          // cameraRadius
    'tough/iPhone_14_Pro_Max_t.png',
    30
);





export const iphone_15_t = new PhoneSettingsT(
    'customed rubber case',
    'iphone 15',

    true,

    1176,
    2060,
    'PremiumPhoneCase-iPhone-15-ToughCaseGloss',
    (1176 - 835)  / 2,        // x
    (2060 - 1730) / 2,        // y
    1176 - 341,        // width
    2060 - 330,        // height
    135,         // radius

    (1176 - 799)  / 2,        // cameraX
    (2060 - 1730) / 2,        // cameraY
    390,        // cameraWidth
    425,        // cameraHeight
    120 ,         // cameraRadius
    'tough/iPhone_15_t.png',
    30
);




export const iphone_15_plus_t = new PhoneSettingsT(
    'customed rubber case',
    'iphone 15 plus',

    true,

    1320  ,
    2250  ,
    'PremiumPhoneCase-iPhone-15-Plus-ToughCaseGloss',
    (1176 - 860)  / 2,        // x
    (2060 - 1775) / 2,        // y
    1176 - 325,        // width
    2060 - 290,        // height
    145,         // radius

    (1176 - 815)  / 2,        // cameraX
    (2060 - 1760) / 2,        // cameraY
    375,        // cameraWidth
    400,        // cameraHeight
    120,          // cameraRadius
    'tough/iPhone_15_Plus_t.png',
    30
);



export const iphone_15_pro_t = new PhoneSettingsT(
    'customed rubber case',
    'iphone 15 pro',

    true,

    1176,
    2060,
    'PremiumPhoneCase-iPhone-15-Pro-ToughCaseGloss',
    (1176 - 855)  / 2,        // x
    (2060 - 1730) / 2,        // y
    1176 - 328,        // width
    2060 - 330,        // height
    139,         // radius

    (1176 - 793)  / 2,        // cameraX
    (2060 - 1685) / 2,        // cameraY
    465,        // cameraWidth
    480,        // cameraHeight
    130,          // cameraRadius
    'tough/iPhone_15_Pro_t.png',
    30
);



export const iphone_15_pro_max_t = new PhoneSettingsT(
    'customed rubber case',
    'iphone 15 pro max',

    true,

    1251 ,
    2218,
    'PremiumPhoneCase-iPhone-15-Pro-Max-ToughCaseGloss',
    (1176 - 875)  / 2,        // x
    (2060 - 1770) / 2,        // y
    1176 - 311,        // width
    2060 - 310,        // height
    139,         // radius

    (1176 - 823)  / 2,        // cameraX
    (2060 - 1705) / 2,        // cameraY
    435,        // cameraWidth
    440,        // cameraHeight
    130,          // cameraRadius
    'tough/iPhone_15_Pro_Max_t.png',
    30
);


export const iphone_16_pro_t = new PhoneSettingsT(
    'customed rubber case',
    'iphone 16 pro',
    true,

    1211 ,
    2049 ,
    'PremiumPhoneCase-iPhone-16-Pro-ToughCaseGloss',
    (1176 - 800)  / 2,        // x
    (2060 - 1750) / 2,        // y
    1176 - 370,        // width
    2060 - 310,        // height
    139,         // radius

    (1176 - 745)  / 2,        // cameraX
    (2060 - 1680) / 2,        // cameraY
    470,        // cameraWidth
    505,        // cameraHeight
    140,          // cameraRadius
    'tough/iPhone_16_Pro_t.png',
    30
);



export const iphone_16_pro_max_t = new PhoneSettingsT(
    'customed rubber case',
    'iphone 16 max',
    true,

    1311,
    2197,
    'PremiumPhoneCase-iPhone-16-Pro-Max-ToughCaseGloss',
    (1176 - 800)  / 2,        // x
    (2060 - 1750) / 2,        // y
    1176 - 370,        // width
    2060 - 310,        // height
    139,         // radius

    (1176 - 738)  / 2,        // cameraX
    (2060 - 1690) / 2,        // cameraY
    425,        // cameraWidth
    470,        // cameraHeight
    130 ,         // cameraRadius
    'tough/iPhone_16_Pro_Max_t.png',
    30
);





// =================================================================


export const iphone_se = new PhoneSettings(
    'customed clear case',
    'iphone se',
    false,

    (600 - 223) / 2,        // x
    (600 - 465) / 2,        // y
    222,        // width
    465,        // height
    32,         // radius

    (600 - 245) / 2 + 20,        // cameraX
    (600 - 488) / 2 + 20,        // cameraY
    85,        // cameraWidth
    50,        // cameraHeight
    30,          // cameraRadius
    'normal/iphone_se.png',
    30
);


export const iphone_7 = new PhoneSettings(
    'customed clear case',
    'iphone 7',

    false,

    (600 - 223) / 2,        // x
    (600 - 465) / 2,        // y
    222,        // width
    465,        // height
    32,         // radius

    (600 - 245) / 2 + 20,        // cameraX
    (600 - 488) / 2 + 20,        // cameraY
    85,        // cameraWidth
    50,        // cameraHeight
    30 ,         // cameraRadius
    'normal/iphone_7_8.png',
    30
);


export const iphone_8 = new PhoneSettings(
    'customed clear case',
    'iphone 8',

    false,

    (600 - 223) / 2,        // x
    (600 - 465) / 2,        // y
    222,        // width
    465,        // height
    32,         // radius

    (600 - 245) / 2 + 20,        // cameraX
    (600 - 488) / 2 + 20,        // cameraY
    85,        // cameraWidth
    50,        // cameraHeight
    30 ,         // cameraRadius,
    'normal/iphone_7_8.png',
    30
);


export const iphone_12 = new PhoneSettings(
    'customed clear case',
    'iphone 12',

    false,

    (600 - 219) / 2,        // x
    (600 - 420) / 2,        // y
    213,        // width
    445,        // height
    33,         // radius

    (600 - 245) / 2 + 20,        // cameraX
    (600 - 445) / 2 + 20,        // cameraY
    95,        // cameraWidth
    100,        // cameraHeight
    28,          // cameraRadius
    'normal/iphone_12.png',
    30
);




export const iphone_12_mini = new PhoneSettings(
    'customed clear case',
    'iphone 12 mini',

    false,

    (600 - 203) / 2,        // x
    (600 - 338) / 2,        // y
    194,        // width
    403,        // height
    29,         // radius

    (600 - 234) / 2 + 20,        // cameraX
    (600 - 370) / 2 + 20,        // cameraY
    100,        // cameraWidth
    100,        // cameraHeight
    30,          // cameraRadius
    'normal/iphone_12_mini.png',
    30
);

export const iphone_12_pro = new PhoneSettings(
    'customed clear case',
    'iphone 12 pro',

    false,

    (600 - 216) / 2,        // x
    (600 - 419) / 2,        // y
    212,        // width
    443,        // height
    30,         // radius

    (600 - 247) / 2 + 20,        // cameraX
    (600 - 447) / 2 + 20,        // cameraY
    97,        // cameraWidth
    104,        // cameraHeight
    28,          // cameraRadius
    'normal/iphone_12_pro.png',
    30
);




export const iphone_12_pro_max = new PhoneSettings(
    'customed clear case',
    'iphone 12 pro max',

    false,

    (600 - 235) / 2,        // x
    (600 - 485) / 2,        // y
    230,        // width
    475,        // height
    33,         // radius

    (600 - 265) / 2 + 20,        // cameraX
    (600 - 517) / 2 + 20 ,        // cameraY
    110,        // cameraWidth
    120,        // cameraHeight
    30,          // cameraRadius
    'normal/iphone_12_pro_max.png',
    30
);



export const iphone_13 = new PhoneSettings(
    'customed clear case',
    'iphone 13',

    false,

    (600 - 219) / 2,        // x
    (600 - 420) / 2,        // y
    213,        // width
    445,        // height
    33,         // radius

    (600 - 250) / 2 + 20,        // cameraX
    (600 - 450) / 2 + 20,        // cameraY
    100,        // cameraWidth
    100,        // cameraHeight
    30,          // cameraRadius
    'normal/iphone_13.png',
    30
);




export const iphone_13_mini = new PhoneSettings(
    'customed clear case',
    'iphone 13 mini',

    false,

    (600 - 203) / 2,        // x
    (600 - 338) / 2,        // y
    194,        // width
    403,        // height
    29,         // radius

    (600 - 234) / 2 + 20,        // cameraX
    (600 - 370) / 2 + 20,        // cameraY
    100,        // cameraWidth
    100,        // cameraHeight
    30          // cameraRadius
    ,'normal/iphone_13_mini.png',
    30
);


export const iphone_13_pro = new PhoneSettings(
    'customed clear case',
    'iphone 13 pro',

    false,

    (600 - 216) / 2,        // x
    (600 - 417) / 2,        // y
    212,        // width
    441,        // height
    30,         // radius

    (600 - 247) / 2 + 20,        // cameraX
    (600 - 447) / 2 + 20,        // cameraY
    115,        // cameraWidth
    120,        // cameraHeight
    30          // cameraRadius
    ,'normal/iphone_13_pro.png',
    30
);


export const iphone_13_pro_max = new PhoneSettings(
    'customed clear case',
    'iphone 13 pro max',

    false,

    (600 - 238) / 2,        // x
    (600 - 503) / 2,        // y
    232,        // width
    485,        // height
    33,         // radius

    (600 - 269) / 2 + 20,        // cameraX
    (600 - 534) / 2 + 20 ,        // cameraY
    115,        // cameraWidth
    120,        // cameraHeight
    30          // cameraRadius
    ,'normal/iphone_13_pro_max.png',
    30
);




export const iphone_14 = new PhoneSettings(
    'customed clear case',
    'iphone 14',

    false,

    (600 - 238) / 2,        // x
    (600 - 510) / 2,        // y
    235,        // width
    489,        // height
    30,         // radius
    (600 - 265) / 2 + 20,        // cameraX
    (600 - 540) / 2 + 20,        // cameraY
    100,        // cameraWidth
    100,        // cameraHeight
    27          // cameraRadius
    ,'normal/iphone_14.png',
    30
);




export const iphone_14_plus = new PhoneSettings(
    'customed clear case',
    'iphone 14 plus',

    false,

    (600 - 210) / 2,        // x
    (600 - 417) / 2,        // y
    210,        // width
    443,        // height
    30,         // radius
    (600 - 242) / 2 + 20,        // cameraX
    (600 - 441) / 2 + 20,        // cameraY
    130,        // cameraWidth
    130,        // cameraHeight
    35          // cameraRadius
    ,'normal/iphone_14_plus.png',
    30
)


export const iphone_14_pro = new PhoneSettings(
    'customed clear case',
    'iphone 14 pro',

    false,

    (600 - 210) / 2,        // x
    (600 - 417) / 2,        // y
    210,        // width
    443,        // height
    30,         // radius

    (600 - 242) / 2 + 20,        // cameraX
    (600 - 441) / 2 + 20,        // cameraY
    130,        // cameraWidth
    130,        // cameraHeight
    35          // cameraRadius
    ,'normal/iphone_14_pro.png',
    30
)

export const iphone_14_pro_max = new PhoneSettings(
    'customed clear case',
    'iphone 14 pro max',

    false,

    (600 - 235) / 2,        // x
    (600 - 510) / 2,        // y
    232,        // width
    488,        // height
    32,         // radius

    (600 - 262) / 2 + 20,        // cameraX
    (600 - 531) / 2 + 20,        // cameraY
    130,        // cameraWidth
    133,        // cameraHeight
    30          // cameraRadius
    ,'normal/iphone_14_pro_max.png',
    30
)


export const samsung_a34 = new PhoneSettings(
    'customed clear case',
    'samsung a34',

    false,

    (600 - 243) / 2,        // x
    (600 - 510) / 2,        // y
    242,        // width
    510,        // height
    32,         // radius

    (600 - 260) / 2 + 20,        // cameraX
    (600 - 528) / 2 + 20 ,        // cameraY
    83,        // cameraWidth
    150,        // cameraHeight
    30          // cameraRadius
    ,'normal/samsung_a34.jpg',
    30
);



export const samsung_a54 = new PhoneSettings(
    'customed clear case',
    'samsung a54',

    false,

    (600 - 223) / 2,        // x
    (600 - 460) / 2,        // y
    225,        // width
    460,        // height
    31,         // radius

    (600 - 227) / 2 + 20,        // cameraX
    (600 - 485) / 2 + 20 ,        // cameraY
    48,        // cameraWidth
    143,        // cameraHeight
    30          // cameraRadius
    ,'normal/samsung_a54.png',
    30
);

export const samsung_galaxy_note_8 = new PhoneSettings(
    'customed clear case',
    'samsung galaxy note 8',

    false,

    (600 - 235) / 2,        // x
    (600 - 520) / 2,        // y
    233,        // width
    510,        // height
    15,         // radius

    (600 - 170) / 2 + 20,        // cameraX
    (600 - 455) / 2 + 20 ,        // cameraY
    130,        // cameraWidth
    50,        // cameraHeight
    14          // cameraRadius
    ,'normal/samsung_galaxy_note_8.png',
    30
);


export const samsung_galaxy_note_12 = new PhoneSettings(
    'customed clear case',
    'samsung galaxy note 12',

    false,

    (600 - 230) / 2,        // x
    (600 - 545) / 2,        // y
    249,        // width
    540,        // height
    15,         // radius

    (600 - 233) / 2 + 20,        // cameraX
    (600 - 559) / 2 + 20 ,        // cameraY
    80,        // cameraWidth
    135,        // cameraHeight
    17,          // cameraRadius
    'normal/samsung_galaxy_note_12.png',
    30
);


export const samsung_galaxy_s23 = new PhoneSettings(
    'customed clear case',
    'samsung galaxy s23',

    false,

    (600 - 255) / 2,        // x
    (600 - 543) / 2,        // y
    259,        // width
    545,        // height
    35,         // radius

    (600 - 280) / 2 + 20,        // cameraX
    (600 - 566) / 2 + 20 ,        // cameraY
    100,        // cameraWidth
    178,        // cameraHeight
    30          // cameraRadius
    ,'normal/samsung_galaxy_s23.webp',
    30
);



export const oppo_a60 = new PhoneSettings(
    'customed clear case',
    'oppo a60',

    false,

    (600 - 245) / 2,        // x
    (600 - 563) / 2,        // y
    249,        // width
    560,        // height
    25,         // radius

    (600 - 275) / 2 + 20,        // cameraX
    (600 - 595) / 2 + 20 ,        // cameraY
    105,        // cameraWidth
    235,        // cameraHeight
    75          // cameraRadius
    ,'normal/oppo_a60.jpg',
    30
);


export const oppo_reno_4z = new PhoneSettings(
    'customed clear case',
    'oppo reno 4z',
    false,

    (600 - 240) / 2,        // x
    (600 - 510) / 2,        // y
    240,        // width
    497,        // height
    40,         // radius

    (600 - 263) / 2 + 20 ,        // cameraX
    (600 - 535) / 2 + 20 ,        // cameraY
    110,        // cameraWidth
    120,        // cameraHeight
    34          // cameraRadius
    ,'normal/oppo_reno_4z.avif',
    30
);


export const oppo_reno_5_lite = new PhoneSettings(
    'customed clear case',
    'oppo reno 5 lite',

    false,

    (600 - 251) / 2,        // x
    (600 - 557) / 2,        // y
    258,        // width
    560,        // height
    32,         // radius

    (600 - 255) / 2 + 20 ,        // cameraX
    (600 - 565) / 2 + 20 ,        // cameraY
    77,        // cameraWidth
    110,        // cameraHeight
    15          // cameraRadius
    ,'normal/oppo_reno_5_lite.avif',
    30
);


export const oppo_reno_6 = new PhoneSettings(
    'customed clear case',
    "oppo reno 6",
    false,

    (600 - 267) / 2,        // x
    (600 - 580) / 2,        // y
    286,        // width
    580,        // height
    32,         // radius

    (600 - 269) / 2 + 20 ,        // cameraX
    (600 - 590) / 2 + 20 ,        // cameraY
    100,        // cameraWidth
    150,        // cameraHeight
    15          // cameraRadius
    ,'normal/oppo_reno_6.jpg',
    30
);


export const oppo_reno_12 = new PhoneSettings(
    'customed clear case',
    'oppo reno 12',
    false,

    (600 - 280) / 2,        // x
    (600 - 580) / 2,        // y
    263,        // width
    583,        // height
    25,         // radius

    (600 - 255) / 2 + 20 ,        // cameraX
    (600 - 580) / 2 + 20 ,        // cameraY
    200,        // cameraWidth
    200,        // cameraHeight
    100          // cameraRadius
    ,'normal/oppo_reno_12.jpg',
    30
);


export const redmi_13_pro = new PhoneSettings(
    'customed clear case',
    'redmi 13 pro',
    false,

    (600 - 215) / 2,        // x
    (600 - 480) / 2,        // y
    215,        // width
    480,        // height
    25,         // radius

    (600 - 245) / 2 + 20 ,        // cameraX
    (600 - 513) / 2 + 20 ,        // cameraY
    138,        // cameraWidth
    143,        // cameraHeight
    20          // cameraRadius
    ,'normal/redmi_13_pro.webp',
    30
);



export const redmi_a3 = new PhoneSettings(
    'customed clear case',
    "redmi a3",
    false,

    (600 - 235) / 2,        // x
    (600 - 540) / 2,        // y
    238,        // width
    540,        // height
    25,         // radius

    (600 - 240) / 2 + 20  ,        // cameraX
    (600 - 558) / 2 + 20 ,        // cameraY
    200,        // cameraWidth
    200,        // cameraHeight
    100          // cameraRadius
    ,'normal/redmi_a3.avif',
    30
);



export const redmi_note_12 = new PhoneSettings(
    'customed clear case',
    "redmi note 12",
    false,

    (600 - 235) / 2,        // x
    (600 - 545) / 2,        // y
    250,        // width
    547,        // height
    25,         // radius

    (600 - 250) / 2 + 20  ,        // cameraX
    (600 - 575) / 2 + 20 ,        // cameraY
    115,        // cameraWidth
    149,        // cameraHeight
    15          // cameraRadius
    ,'normal/redmi_note_12.jpg',
    30
);


export const redmi_note_11_pro = new PhoneSettings(
    'customed clear case',
    'redmi note 11 pro',
    false,

    (600 - 248) / 2,        // x
    (600 - 525) / 2,        // y
    245,        // width
    527,        // height
    25,         // radius

    (600 - 255) / 2 + 20  ,        // cameraX
    (600 - 540) / 2 + 20 ,        // cameraY
    90,        // cameraWidth
    149,        // cameraHeight
    15          // cameraRadius
    ,'normal/redmi_note_11_pro.avif',
    30
);


export const redmi_note_10 = new PhoneSettings(
    'customed clear case',
    'redmi note 10',
    false,

    (600 - 255) / 2,        // x
    (600 - 560) / 2,        // y
    255,        // width
    565,        // height
    25,         // radius

    (600 - 280) / 2 + 20 ,        // cameraX
    (600 - 580) / 2 + 20 ,        // cameraY
    85,        // cameraWidth
    145,        // cameraHeight
    28          // cameraRadius
    ,'normal/redmi_note_10.jpg',
    30
);