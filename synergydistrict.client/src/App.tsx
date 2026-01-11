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
import { GamePropertiesProvider } from "./provider/GamePropertiesProvider";
import { GameDataProvider } from "./provider/GameDataProvider";
import { GameControlProvider } from "./provider/GameControlProvider";
import { GameMapDataProvider } from "./provider/GameMapDataProvider";
import { GameResourcesProvider } from "./provider/GameResourcesProvider";
import { GameTimeProvider } from "./provider/GameTimeProvider";

function App() {
    return (
        <>
            <div className="container">
                <GameOptionsProvider>
                    <SettingsProvider>
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
                                <Route path="/game" element={
                                    <GameControlProvider>
                                        <GameMapDataProvider>
                                            <GamePropertiesProvider>
                                                <GameTimeProvider>
                                                    <GameResourcesProvider>
                                                        <GameDataProvider>
                                                            <Game />
                                                        </GameDataProvider>
                                                    </GameResourcesProvider>
                                                </GameTimeProvider>
                                            </GamePropertiesProvider>
                                        </GameMapDataProvider>
                                    </GameControlProvider>
                                } />
                            </Routes>
                        </BrowserRouter>
                    </SettingsProvider>
                </GameOptionsProvider>
            </div>
        </>
    );
}

export default App;
