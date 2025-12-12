import { IconClose } from "../../components/Icons";
import TextButton from "../../components/TextButton";

const PlayMenu = () => {
  return (
    <>
      <TextButton text="game" linkTo="/game" />
      <IconClose />
    </>
  );
};

export default PlayMenu;
