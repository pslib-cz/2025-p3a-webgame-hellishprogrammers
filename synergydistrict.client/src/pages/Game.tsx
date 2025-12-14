import { Rendereder } from "../components/Game/Canvas/GameCanvas";
import { useGameOptions } from "../hooks/useGameOptions";

export default function Game() {
  const { options } = useGameOptions();
  console.log("Game started with options:", options);

  return <Rendereder />;
}
