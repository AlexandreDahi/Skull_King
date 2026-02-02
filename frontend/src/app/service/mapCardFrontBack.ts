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

    // YELLOW 1-14
    ["YELLOW_1", 29],
    ["YELLOW_2", 30],
    ["YELLOW_3", 31],
    ["YELLOW_4", 32],
    ["YELLOW_5", 33],
    ["YELLOW_6", 34],
    ["YELLOW_7", 35],
    ["YELLOW_8", 36],
    ["YELLOW_9", 37],
    ["YELLOW_10", 38],
    ["YELLOW_11", 39],
    ["YELLOW_12", 40],
    ["YELLOW_13", 41],
    ["YELLOW_14", 42],

    // BLACK 1-14
    ["BLACK_1", 43],
    ["BLACK_2", 44],
    ["BLACK_3", 45],
    ["BLACK_4", 46],
    ["BLACK_5", 47],
    ["BLACK_6", 48],
    ["BLACK_7", 49],
    ["BLACK_8", 50],
    ["BLACK_9", 51],
    ["BLACK_10", 52],
    ["BLACK_11", 53],
    ["BLACK_12", 54],
    ["BLACK_13", 55],
    ["BLACK_14", 56],

    ["SKULL_KING", 57],

    // SIRENS
    ["SIREN_1", 58],
    ["SIREN_2", 59],

    // PIRATES
    ["PIRATE_RASCAL", 60],
    ["PIRATE_JUANITA", 61],
    ["PIRATE_ROSIE", 62],
    ["PIRATE_WILL", 63],
    ["PIRATE_HARRY", 64],
    ["PIRATE_TIGRESS", 65],

    // SIMPLE ESCAPE
    ["ESCAPE_1", 66],
    ["ESCAPE_2", 67],
    ["ESCAPE_3", 68],
    ["ESCAPE_4", 69],

    // LOOT (butin)
    ["LOOT_1", 70],
    ["LOOT_2", 71],

    // OTHERS
    ["WHALE", 72],
    ["KRAKEN", 73],
]);

export const idToCardName = new Map([...cardNameToId].map(([name, id]) => [id, name]));