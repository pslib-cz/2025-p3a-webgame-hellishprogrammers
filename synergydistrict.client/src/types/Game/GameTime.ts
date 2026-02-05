export type GameTimeType = {
  timer: number;
  isEnd: boolean;
  // Survival mode specific fields
  nextPayment?: number;
  currentQuarter?: number;
}

export const defaultGameTime: GameTimeType = {
  timer: 0,
  isEnd: false,
  nextPayment: 1000,
  currentQuarter: 1,
};
