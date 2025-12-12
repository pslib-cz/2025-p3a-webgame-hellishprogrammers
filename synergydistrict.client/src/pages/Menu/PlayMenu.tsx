import TextButton from "../../components/TextButton";
import "../../styles/icons.css";

const PlayMenu = () => {
  return (
    <>
      <TextButton text="game" linkTo="/game" />
      <p className="icon">forest</p>
    </>
  );
};

export default PlayMenu;
