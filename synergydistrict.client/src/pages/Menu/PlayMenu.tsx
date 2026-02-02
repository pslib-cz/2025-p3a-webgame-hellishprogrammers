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

const SEED_STRINGS_LIST = [
    "skibidi",
    "sigma",
    "67",
    "kayda"
]

const PlayMenu = () => {
    const { options, setOptions } = useGameOptions();
    const { setGameProperties } = useGameProperties();
    const [seedString, setSeedString] = useState<string>(options.seed.toString());
    const [durationString, setDurationString] = useState<string>(options.gameDuration?.toString() || "");
    const [mapSizeString, setMapSizeString] = useState<string>(options.mapSize?.toString() || "");
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

    return (
        <>
            <div className={styles.menuContent}>
                <div className={styles.seed}>
                    <InputValue
                        text="Seed"
                        inputType="text"
                        value={seedString}
                        onChange={(val) => setSeedString(val)}
                        onBlur={() => {
                            const seed = stringToSeed(seedString);
                            setOptions({ ...options, seed });
                        }}
                        onEnter={() => {
                            const seed = stringToSeed(seedString);
                            setOptions({ ...options, seed });
                        }}
                    />
                    <div className={`${styles.flex} border`}>
                        <TextButton
                            text={"Generate"}
                            onClick={() => {
                                const string = SEED_STRINGS_LIST[Math.floor(Math.random() * SEED_STRINGS_LIST.length)];
                                setSeedString(string);
                                const seed = stringToSeed(string)
                                setOptions({ ...options, seed: seed });
                            }}
                        />
                    </div>
                </div>
                <h3>Gamemode</h3>
                <ToggleButton
                    options={["Time presure", "Survival"]}
                    selectedIndex={0}
                    onChange={(index) => index === 0 && setOptions({ ...options, gameMode: "timePresure" })}
                    disabledIndices={[1]}
                />
                <h3>Options</h3>
                <InputValue
                    text="Duration"
                    inputType="number"
                    value={durationString}
                    onChange={(val) => setDurationString(val)}
                    onBlur={() => {
                        let numericValue = Number(durationString);
                        if (!Number.isFinite(numericValue)) {
                            setDurationString(options.gameDuration?.toString() || "");
                            return;
                        }
                        numericValue = Math.max(0.1, Math.min(999, numericValue));
                        setOptions({ ...options, gameDuration: numericValue });
                        setDurationString(numericValue.toString());
                    }}
                    onEnter={() => {
                        let numericValue = Number(durationString);
                        if (!Number.isFinite(numericValue)) {
                            setDurationString(options.gameDuration?.toString() || "");
                            return;
                        }
                        numericValue = Math.max(0.1, Math.min(999, numericValue));
                        setOptions({ ...options, gameDuration: numericValue });
                        setDurationString(numericValue.toString());
                    }}
                />
                <InputToggle
                    text="Infinite map"
                    options={["ON", "OFF"]}
                    selectedIndex={options.infiniteMap ? 0 : 1}
                    onChange={(index) => {
                        const defaultMapSize = defaultGameProperties.CHUNK_SIZE;
                        if (index === 0) {
                            setOptions({ ...options, infiniteMap: true, mapSize: defaultMapSize });
                            setMapSizeString(defaultMapSize.toString());
                        } else {
                            setOptions({ ...options, infiniteMap: false, mapSize: defaultMapSize });
                            setMapSizeString(defaultMapSize.toString());
                        }
                        setHasInfMapChanged(true);
                    }}
                />
                {!options.infiniteMap ? (
                    <InputValue
                        text="Map size"
                        inputType="number"
                        value={mapSizeString}
                        onChange={(val) => setMapSizeString(val)}
                        onBlur={() => {
                            let numericValue = Number(mapSizeString);
                            if (!Number.isFinite(numericValue)) {
                                setMapSizeString(options.mapSize?.toString() || "");
                                return;
                            }
                            numericValue = Math.max(1, Math.min(127, Math.floor(numericValue)));
                            setOptions({ ...options, mapSize: numericValue });
                            setMapSizeString(numericValue.toString());
                        }}
                        onEnter={() => {
                            let numericValue = Number(mapSizeString);
                            if (!Number.isFinite(numericValue)) {
                                setMapSizeString(options.mapSize?.toString() || "");
                                return;
                            }
                            numericValue = Math.max(1, Math.min(127, Math.floor(numericValue)));
                            setOptions({ ...options, mapSize: numericValue });
                            setMapSizeString(numericValue.toString());
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
