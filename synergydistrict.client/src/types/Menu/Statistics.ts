export type Statistics = {
    moneyMade: number;
    moneySpend: number;
    buildingsPlaced: number;
    buildingsDemolished: number;
    buildingsUpgraded: number;
    buildingsPlacedByType: Record<string, number>;
    timeSpendPlaying: number;
    bestScore: number;
    gamesPlayed: number;
};

export const defaultStatistics: Statistics = {
    moneyMade: 0,
    moneySpend: 0,
    buildingsPlaced: 0,
    buildingsDemolished: 0,
    buildingsUpgraded: 0,
    buildingsPlacedByType: {},
    timeSpendPlaying: 0,
    bestScore: 0,
    gamesPlayed: 0,
};
