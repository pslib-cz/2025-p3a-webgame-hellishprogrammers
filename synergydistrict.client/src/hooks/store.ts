import { create } from "zustand";
import type { TileType } from "../types";

interface GameState {
  grid: Record<string, TileType>;
  position: { x: number; y: number };
  setBlock: (x: number, y: number, type: TileType) => void;
}

export const useStore = create<GameState>((set) => ({
  grid: {},
  position: { x: 0, y: 0 }, // Pan position

  setBlock: (x, y, type) =>
    set((state) => ({
      grid: { ...state.grid, [`${x},${y}`]: type },
    })),
}));
