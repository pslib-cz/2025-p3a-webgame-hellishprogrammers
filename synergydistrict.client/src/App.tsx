import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import Menu from "./pages/Menu";
import LeaderboardMenu from "./pages/Menu/LeaderboardMenu";
import MainMenu from "./pages/Menu/MainMenu";
import PlayMenu from "./pages/Menu/PlayMenu";
import SettingsMenu from "./pages/Menu/SettingsMenu";
import StatisticsMenu from "./pages/Menu/StatisticsMenu";
import Game from "./pages/Game";
import { GameOptionsProvider } from "./provider/GameOptionsProvider";
import { SettingsProvider } from "./provider/SettingsProvider";
import { GameVariablesProvider } from "./provider/GameVariablesProvider";
import { GamePropertiesProvider } from "./provider/GamePropertiesProvider";
import { GameDataProvider } from "./provider/GameDataProvider";

function App() {
    return (
        <>
            <div className="container">
                <GameOptionsProvider>
                    <SettingsProvider>
                        <GamePropertiesProvider>
                            <GameVariablesProvider>
                                <GameDataProvider>
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
                                </GameDataProvider>
                            </GameVariablesProvider>
                        </GamePropertiesProvider>
                    </SettingsProvider>
                </GameOptionsProvider>
            </div>
        </>
    );
}

export default App;
