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
    // <>
    //  <div>
    // <h2>HOW TO PLAY SYNERGY DISTRICT</h2>
    // <p>Synergy District is a grid based city building game where buildings
    //      interact with each other and the map via synergies.
    //      The map is made of 4 tile types</p>
    // </div>
    // <canvas ref={canvasRef}/>
    // <p>Water and mountain tiles cannot support buildings. The extractional type of buildings have synergies with the nature tiles so watch out for them as they can help you out.
    //     You can find the synergies of buildings on the left bar. It shows up when a building is selected to build. Here you can see interactions with other buildins.
    //     Example of Synergies for House</p>
    // <img alt="Synergy display" src="../../../images/synergydisplay.png"/>
    // <p> 
    //      The synergy hub shows you what synergies does the bulding get from other buildings and what
    //      buildings it gives to other buildings and what synergies will be made after building the building.
    //      It also shows the stats.
    //      Stats are values that will give you your score at the end of the game.</p>
    //      <div className={`${styles.flex} ${styles.wrap} ${styles.gap} ${styles.justify}`}>
    //     <ValuesBox iconKey="money" text="1 pt per 1$" style={{ border: '0.25rem solid var(--text, #fefae0)', padding:'0.5rem'}} />
    //     <ValuesBox iconKey="people" text="50 pts per head" style={{ border: '0.25rem solid var(--text, #fefae0)', padding:'0.5rem'}}/>
    //     <ValuesBox iconKey="industry" text="10 pts per unit" style={{ border: '0.25rem solid var(--text, #fefae0)', padding:'0.5rem' }}/>
    //     <ValuesBox iconKey="happiness" text="Is a multiplayer 50% = ×1" style={{ border: '0.25rem solid var(--text, #fefae0)', padding:'0.5rem' }}/>

    //     </div>
    
    // </>
    <Construction />
    );
    
}

export default TutorialMenu;
