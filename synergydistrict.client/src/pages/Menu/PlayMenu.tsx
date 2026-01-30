import InputToggle from "../../components/Inputs/InputToggle";
import InputValue from "../../components/Inputs/InputValue/InputValue";
import TextButton from "../../components/Buttons/TextButton/TextButton";
import ToggleButton from "../../components/Buttons/ToggleButton/ToggleButton";
import { useGameOptions } from "../../hooks/providers/useGameOptions";
import styles from "/src/styles/Menu.module.css";
import { stringToSeed } from "../../utils/optionsUtils";
import { useCallback, useEffect, useState } from "react";
import useGameProperties from "../../hooks/providers/useGameProperties";
import { defaultGameProperties } from "../../types/Game/GameProperties";
import { clearStoredState } from "../../utils/stateStorage";

const SESSION_RESET_KEYS = [
    "gameControl",
    "gameMapData",
    "gameProperties",
    "gameResources",
    "gameTime",
    "buildings",
    "synergies",
];

const PlayMenu = () => {
    const { options, setOptions } = useGameOptions();
    const { setGameProperties } = useGameProperties();
    const [seedString, setSeedString] = useState<string>(options.seed.toString());
    const [hasInfMapChanged, setHasInfMapChanged] = useState(false);
    const handleStart = useCallback(() => {
        setGameProperties(() => ({
            ...defaultGameProperties,
            CHUNK_SIZE: options.mapSize ? options.mapSize : defaultGameProperties.CHUNK_SIZE,
        }));
        clearStoredState(SESSION_RESET_KEYS);
    }, [setGameProperties, options]);

    useEffect(() => {
        const seed = Math.floor(Math.random() * 1000000);
        setOptions({ ...options, seed: seed });
    }, [])

    // Each time user goes to menu there is new seed

    return (
        <>
            <div className={styles.menuContent}>
                <div className={styles.seed}>
                    <InputValue
                        text="Seed"
                        inputType="text"
                        value={seedString}
                        onChange={(val) => {
                            setOptions({ ...options, seed: stringToSeed(val) });
                            setSeedString(val);
                        }}
                    />
                    <div className={`${styles.flex} border`}>
                        <TextButton
                            text={"Generate"}
                            onClick={() => {
                                const seed = Math.floor(Math.random() * 1000000);
                                setOptions({ ...options, seed: seed });
                                setSeedString(seed.toString());
                            }}
                        />
                    </div>
                </div>
                <h3>Gamemode</h3>
                <ToggleButton
                    options={["Time presure", "Survival"]}
                    selectedIndex={options.gameMode === "timePresure" ? 0 : 1}
                    onChange={(index) => setOptions({ ...options, gameMode: index === 0 ? "timePresure" : "survival" })}
                />
                <h3>Options</h3>
                <InputValue
                    text="Duration"
                    inputType="number"
                    value={options.gameDuration || ""}
                    onChange={(val) => setOptions({ ...options, gameDuration: Number(val) })}
                />
                <InputToggle
                    text="Infinite map"
                    options={["ON", "OFF"]}
                    selectedIndex={options.infiniteMap ? 0 : 1}
                    onChange={(index) => {
                        setOptions({ ...options, infiniteMap: index === 0 });
                        setHasInfMapChanged(true);
                    }}
                />
                {!options.infiniteMap ? (
                    <InputValue
                        text="Map size"
                        inputType="number"
                        value={options.mapSize || ""}
                        onChange={(val) => {
                            const numericValue = Number(val);
                            if (!Number.isFinite(numericValue)) return;
                            if (numericValue < 128) {
                                setOptions({ ...options, mapSize: numericValue });
                            }
                        }}
                        animationDelay={!hasInfMapChanged}
                    />
                ) : (
                    <></>
                )}
            </div>
            <div className={`h2 ${styles.right}`}>
                <TextButton text="start" linkTo="/game" onClick={handleStart} />
            </div>
        </>
    );
};

export default PlayMenu;
