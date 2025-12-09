import { NavLink, Outlet } from "react-router-dom";

const Menu = () => {
  return (
    <>
      <nav style={{ marginBottom: "20px" }}>
        <NavLink to="">Menu</NavLink> {" | "}
        <NavLink to="play">Play</NavLink> {" | "}
        <NavLink to="leaderboard">Leaderboard</NavLink> {" | "}
        <NavLink to="statistics">Statistics</NavLink> {" | "}
        <NavLink to="settings">Settings</NavLink> {" | "}
        <NavLink to="/game">Game</NavLink>
      </nav>
      <Outlet />
    </>
  );
};

export default Menu;
