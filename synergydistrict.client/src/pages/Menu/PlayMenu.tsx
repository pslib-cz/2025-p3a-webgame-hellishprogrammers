import InputToggle from "../../components/Inputs/InputToggle";
import InputValue from "../../components/Inputs/InputValue";
import TextButton from "../../components/TextButton";
import ToggleButton from "../../components/ToggleButton";

const PlayMenu = () => {
  return (
    <>
      <h3>Gamemode</h3>
      <ToggleButton options={["Time presure", "Survival"]} />
      <h3>Options</h3>
      <InputValue text="Duration" inputType="number" />
      <InputToggle text="Infinite map" options={["ON", "OFF"]} />
      <InputValue text="Map size" inputType="text" />
      <TextButton text="game" linkTo="/game" />
    </>
  );
};

export default PlayMenu;
