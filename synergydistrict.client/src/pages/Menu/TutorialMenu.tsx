// import { useEffect, useRef } from "react";
// import ValuesBox from "../../components/Game/ValuesBox/ValuesBox";
// import useTileBitmaps from "../../hooks/providers/useTileBitmaps";
// import styles from "../../styles/Menu.module.css";

import Construction from "../../components/Construction";




const TutorialMenu = () => {
    // const { tileBitmaps, tileSize, loading } = useTileBitmaps()
    // const canvasRef = useRef<HTMLCanvasElement | null>(null)
    // useEffect(() => {
    //     const canvas = canvasRef.current!;
    //     const context = canvas?.getContext("2d");
    //     const numberOfTiles = Object.entries(tileBitmaps).length
    //     const totalWidth = tileSize * numberOfTiles;
    //     const scale = totalWidth > canvas.width ? canvas.width / totalWidth : 1;
    //     const scaledTileSize = tileSize * scale;
    //     let gap = Math.abs((canvas.width - scaledTileSize * numberOfTiles) / (numberOfTiles + 1))
    //     const minGapPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
    //     gap = Math.max(gap, minGapPx);
    //     context?.clearRect(0, 0, canvas?.width, canvas?.height);
    //     for (let i = 0; i < numberOfTiles; i++) {
    //         const element = tileBitmaps[Object.keys(tileBitmaps)[i]];
    //         const x = (i + 1) * gap + i * scaledTileSize;
    //         const y = canvas.height / 2 - scaledTileSize / 2;
    //         context?.drawImage(element.bitmap, x, y, scaledTileSize, scaledTileSize);
    //     }
        
    // }, [canvasRef, loading]);
    return (
    <div>
     <div>
    <h2>Basic Controls</h2>
    <p>To move around the map, left-click and drag.
         You can zoom in and out using the scroll wheel.
         To place a building, select one from the menu at the bottom of your screen.
         Once selected, right-click to rotate the building and left-click to place it.
        Press escape to pause the game.</p>
    </div>
    <div>
    <h2>Game Loop</h2>
    <p>Buildings cost money but produce statistics.
        You can view the statistics a building generates in the sidebar on the left.
        Key metrics/statistics like money and population determine your final score,
        while happiness acts as a score multiplier.
        To achieve the highest score possible,
        you must find the ideal balance between the different types of buildings.</p>
    </div>
    <div>
        <h2>Synergies</h2>
        <p>Buildings have synergies with each other and the map.
            When a building is selected, you can view these synergies in the sidebar on the left.
            Synergies are applied through shared edges, the number of edges a building shares determines the number of synergies it receives.
            Filtering Synergies
            At the bottom of the left sidebar, you will see three icons:
            <ul>
                <li>Incoming Synergies: Shows the benefits the building is currently receiving.</li>
                <li>Outgoing Synergies: Shows the benefits the building is providing to others.</li>
                <li>Preview Synergies: Shows the potential synergies you would gain by placing the building in the hovered location.</li>
            </ul>
            
           
            </p>
    </div>
    <div>
        <h2>Upgrades</h2>
        <p>When left clicked on a building on the map on the right a bar will show up.
             You can delete or upgrade buildings there.
             You see what the next upgrade gives you.</p>
    </div>
    
    </div>
    );
    
}

export default TutorialMenu;
