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
import { useEffect, useState } from "react";
import { HistoryProvider } from "./provider/HistoryProvider";
import { StatisticsProvider } from "./provider/StatisticsProvider";
import CreditsMenu from "./pages/Menu/CreditsMenu";
import InputValue from "./components/Inputs/InputValue/InputValue";

function AppContent() {
    const { gameSettings, setGameSettings } = useSettings();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [uiScaleInput, setUiScaleInput] = useState(gameSettings.uiScale.toString());

    useEffect(() => {
        setUiScaleInput(gameSettings.uiScale.toString());
    }, [gameSettings.uiScale]);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const baseFontSize = window.innerWidth <= 1600 ? 12 : 16;
        const scaledFontSize = (baseFontSize * gameSettings.uiScale) / 100;
        document.documentElement.style.fontSize = `${scaledFontSize}px`;
    }, [gameSettings.uiScale]);

    const minRequiredWidth = Math.round(1000 * (gameSettings.uiScale / 100));

    const handleUiScaleInputChange = (value: string) => {
        setUiScaleInput(value);
    };

    const commitUiScaleChange = () => {
        const numValue = parseInt(uiScaleInput) || 100;
        const clampedValue = Math.max(50, Math.min(200, numValue));
        setUiScaleInput(clampedValue.toString());
        setGameSettings({ ...gameSettings, uiScale: clampedValue });
    };

    return (
        <>
            <CRTEffect intensity={gameSettings.crtIntensity} />
            {screenWidth < minRequiredWidth && (
                <div className="screen-size-warning">
                    <div className="screen-size-warning__content">
                        <h2>Screen Size Not Supported</h2>
                        <p>This application requires a minimum screen width of {minRequiredWidth}px.</p>
                        <p>Current width: {screenWidth}px</p>
                        <p>Please use a larger screen or increase your browser window size.</p>
                        
                        <div className="screen-size-warning__ui-scale">
                            <h3>Or Adjust UI Scale:</h3>
                            <InputValue
                                text="UI Scale (%)"
                                inputType="number"
                                value={uiScaleInput}
                                onChange={handleUiScaleInputChange}
                                onBlur={commitUiScaleChange}
                                onEnter={commitUiScaleChange}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className="container">
                <HistoryProvider>
                    <StatisticsProvider>
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
                                                <Route path="credits" element={<CreditsMenu/>} />
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
                    </StatisticsProvider>
                </HistoryProvider>
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
