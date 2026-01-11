export type GameResources = {
        moneyBalance: number;
        money: number;
        peopleUsed: number;
        people: number;
        energyUsed: number;
        energy: number;
        industry: number;
        happiness: number;
};

export const defaultGameResources: GameResources = {
    moneyBalance: 750,
    money: 0,
    peopleUsed: 0,
    people: 0,
    energyUsed: 0,
    energy: 0,
    industry: 0,
    happiness: 0,
};