export const cardNameToId = new Map([
    // PURPLE 1-14
    ["PURPLE_1", 1],
    ["PURPLE_2", 2],
    ["PURPLE_3", 3],
    ["PURPLE_4", 4],
    ["PURPLE_5", 5],
    ["PURPLE_6", 6],
    ["PURPLE_7", 7],
    ["PURPLE_8", 8],
    ["PURPLE_9", 9],
    ["PURPLE_10", 10],
    ["PURPLE_11", 11],
    ["PURPLE_12", 12],
    ["PURPLE_13", 13],
    ["PURPLE_14", 14],

    // GREEN 1-14
    ["GREEN_1", 15],
    ["GREEN_2", 16],
    ["GREEN_3", 17],
    ["GREEN_4", 18],
    ["GREEN_5", 19],
    ["GREEN_6", 20],
    ["GREEN_7", 21],
    ["GREEN_8", 22],
    ["GREEN_9", 23],
    ["GREEN_10", 24],
    ["GREEN_11", 25],
    ["GREEN_12", 26],
    ["GREEN_13", 27],
    ["GREEN_14", 28],

    // BLACK 1-14
    ["BLACK_1", 29],
    ["BLACK_2", 30],
    ["BLACK_3", 31],
    ["BLACK_4", 32],
    ["BLACK_5", 33],
    ["BLACK_6", 34],
    ["BLACK_7", 35],
    ["BLACK_8", 36],
    ["BLACK_9", 37],
    ["BLACK_10", 38],
    ["BLACK_11", 39],
    ["BLACK_12", 40],
    ["BLACK_13", 41],
    ["BLACK_14", 42],

    // YELLOW 1-14
    ["YELLOW_1", 43],
    ["YELLOW_2", 44],
    ["YELLOW_3", 45],
    ["YELLOW_4", 46],
    ["YELLOW_5", 47],
    ["YELLOW_6", 48],
    ["YELLOW_7", 49],
    ["YELLOW_8", 50],
    ["YELLOW_9", 51],
    ["YELLOW_10", 52],
    ["YELLOW_11", 53],
    ["YELLOW_12", 54],
    ["YELLOW_13", 55],
    ["YELLOW_14", 56],

    // PIRATES
    ["PIRATE_HARRY", 64],
    ["PIRATE_JUANITA", 61],
    ["PIRATE_RASCAL", 60],
    ["PIRATE_ROSIE", 62],
    ["PIRATE_WILL", 63],
    ["PIRATE_TIGRESS", 65],

    // SIMPLE ESCAPE (fuite)
    ["ESCAPE_1", 66],
    ["ESCAPE_2", 67],
    ["ESCAPE_3", 68],
    ["ESCAPE_4", 69],

    // LOOT (butin)
    ["LOOT_1", 70],
    ["LOOT_2", 71],

    // SIRENS
    ["SIREN_1", 58],
    ["SIREN_2", 59],

    // OTHERS
    ["SKULL_KING", 57],
    ["WHALE", 72],
    ["KRAKEN", 73],
]);

export const idToCardName = new Map([...cardNameToId].map(([name, id]) => [id, name]));