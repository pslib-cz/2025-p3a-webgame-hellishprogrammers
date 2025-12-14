import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Menu from "./pages/Menu";
import LeaderboardMenu from "./pages/Menu/LeaderboardMenu";
import MainMenu from "./pages/Menu/MainMenu";
import PlayMenu from "./pages/Menu/PlayMenu";
import SettingsMenu from "./pages/Menu/SettingsMenu";
import StatisticsMenu from "./pages/Menu/StatisticsMenu";
import Game from "./pages/Game";
import { GameOptionsProvider } from "./provider/GameOptionsProvider";

function App() {
  return (
    <>
      <div className="container">
        <GameOptionsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to={"/menu"} />} />
              <Route path="/menu" element={<Menu />}>
                <Route path="" element={<MainMenu />} />
                <Route path="play" element={<PlayMenu />} />
                <Route path="leaderboard" element={<LeaderboardMenu />} />
                <Route path="statistics" element={<StatisticsMenu />} />
                <Route path="settings" element={<SettingsMenu />} />
              </Route>
              <Route path="/game" element={<Game />} />
            </Routes>
          </BrowserRouter>
        </GameOptionsProvider>
      </div>
    </>
  );
}

export default App;
