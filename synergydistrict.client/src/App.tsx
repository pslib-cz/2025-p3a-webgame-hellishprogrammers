import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import Splash from "./pages/Splash";
import Menu from "./pages/Menu";
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
import { TileBitmapProvider } from "./provider/TileBitmapProvider";
import TutorialMenu from "./pages/Menu/TutorialMenu";
import CRTEffect from "./components/CRTEffect/CRTEffect";
import { useSettings } from "./hooks/providers/useSettings";
import { useEffect } from "react";

function AppContent() {
    const { gameSettings } = useSettings();

    useEffect(() => {
        const baseFontSize = window.innerWidth <= 1600 ? 12 : 16;
        const scaledFontSize = (baseFontSize * gameSettings.uiScale) / 100;
        document.documentElement.style.fontSize = `${scaledFontSize}px`;
    }, [gameSettings.uiScale]);

    return (
        <>
            <CRTEffect intensity={gameSettings.crtIntensity} />
            <div className="container">
                <GameOptionsProvider>
                    <GamePropertiesProvider>
                        <TileBitmapProvider>
                            <BrowserRouter>
                                <Routes>
                                    <Route path="/" element={<Splash />} />
                                    <Route path="/menu" element={<Menu />}>
                                        <Route path="" element={<MainMenu />} />
                                        <Route path="play" element={<PlayMenu />} />
                                        <Route path="tutorial" element={<TutorialMenu />} />
                                        <Route path="statistics" element={<StatisticsMenu />} />
                                        <Route path="settings" element={<SettingsMenu />} />
                                    </Route>
                                    <Route
                                        path="/game"
                                        element={
                                            <GameControlProvider>
                                                <GameMapDataProvider>
                                                    <GameTimeProvider>
                                                        <GameResourcesProvider>
                                                            <GameDataProvider>
                                                                <Game />
                                                            </GameDataProvider>
                                                        </GameResourcesProvider>
                                                    </GameTimeProvider>
                                                </GameMapDataProvider>
                                            </GameControlProvider>
                                        }
                                    />
                                </Routes>
                            </BrowserRouter>
                        </TileBitmapProvider>
                    </GamePropertiesProvider>
                </GameOptionsProvider>
            </div>
        </>
    );
}

function App() {
    return (
        <SettingsProvider>
            <AppContent />
        </SettingsProvider>
    );
}

export default App;
