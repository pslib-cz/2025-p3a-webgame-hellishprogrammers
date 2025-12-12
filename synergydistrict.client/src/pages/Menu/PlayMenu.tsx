import { IconClose, IconHappiness, IconMountain } from "../../components/Icons";
import TextButton from "../../components/TextButton";
import "../../styles/icons.css";

const PlayMenu = () => {
  return (
    <>
      <TextButton text="game" linkTo="/game" />
      <IconMountain />
    </>
  );
};

export default PlayMenu;
