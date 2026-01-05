# Building Placement, Selection, and Synergy Detection System

## Overview

Implemented a complete building placement system with selection, removal, rotation, synergy detection, and automatic game value updates.

## Components Created/Modified

### 1. **PlacedBuildingsProvider** (`src/provider/PlacedBuildingsProvider.tsx`)

-   Manages the state of all placed buildings on the map
-   Provides methods for:
    -   `placeBuilding()`: Add a new building at a position with rotation
    -   `removeBuilding()`: Remove a building by its instance ID
    -   `selectBuilding()`: Select/deselect a building for interaction
    -   `getSelectedBuilding()`: Get the currently selected building

### 2. **usePlacedBuildings Hook** (`src/hooks/providers/usePlacedBuildings.ts`)

-   React hook to access the PlacedBuildingsProvider context
-   Must be used within a `<PlacedBuildingsProvider>` wrapper

### 3. **Building Utilities** (`src/utils/buildingUtils.ts`)

Key functions:

-   `rotateBuildingShape()`: Rotates a building's shape by 0-3 rotations (90° increments)
-   `detectSynergies()`: Detects adjacent building synergies (4-directional)
-   `calculateTotalProduction()`: Sums base production + synergy production
-   `getRotatedBuildingDimensions()`: Gets dimensions of a rotated building

### 4. **GameCanvas Updates** (`src/components/Game/KonvaNew/GameCanvas.tsx`)

Enhanced with:

-   **Placement Mode**: Enter when a building is selected, exit after placement
-   **Rotation Control**: Mouse wheel changes building rotation during placement
-   **Click to Place**: Left-click places building at current tile
-   **Mouse Hover**: Tracks mouse position for preview placement
-   **Auto-synergy Detection**: Detects synergies when buildings are placed
-   **Auto-value Updates**: Updates GameVariables when buildings change

### 5. **BuildingsLayer** (`src/components/Game/KonvaNew/Buildings/BuildingsLayer.tsx`)

Renders all placed buildings with:

-   **Selection Visual**: Shadow effect when building is selected
-   **Click Selection**: Left-click to select/deselect buildings
-   **Right-click Removal**: Right-click to remove building
-   **Delete Key Removal**: Press Delete to remove selected building
-   **Rotation Rendering**: Buildings display with correct rotation

### 6. **Type Updates** (`src/types/Game/Grid.ts`)

Updated `MapBuilding` type to include:

```typescript
type MapBuilding = {
    building: BuildingType;
    position: Position;
    edges: Edge[];
    isSelected: boolean;
    rotation: number; // 0, 1, 2, 3 for 0°, 90°, 180°, 270°
    buildingInstanceId: string; // Unique ID for each placed building
};
```

### 7. **Game.tsx Updates** (`src/pages/Game.tsx`)

Wrapped GameCanvas with `<PlacedBuildingsProvider>` to enable building placement

## Usage Flow

### 1. **Building Placement**

```
User selects building from GameBar
→ GameCanvas enters placement mode
→ Mouse wheel rotates preview
→ Click on map to place
→ Building placed, synergies detected
→ GameVariables updated
```

### 2. **Building Selection**

```
Click on placed building
→ Building becomes selected (shadow effect)
→ Can be deleted or modified
```

### 3. **Building Removal**

```
Option A: Right-click on building → removed
Option B: Select building, press Delete → removed
```

### 4. **Synergy Detection**

-   Checks 4-directional neighbors (up, down, left, right)
-   Maps building synergies from data
-   Accumulates production from synergies
-   Automatically updates when buildings placed/removed

## Synergy System

The system detects synergies based on building adjacency:

1. Each placed building tracks which tiles it occupies
2. For each tile, checks adjacent tiles (4-directional)
3. If adjacent tile contains another building, checks if a synergy exists
4. Synergy production is added to total production

Example:

```
Industrial Building (50 money/tick) next to Residential Building
→ If synergy exists: Residential gets +20 happiness
→ Total production updated to reflect synergy boost
```

## Game Variables Integration

When buildings are placed/removed, the following variables update:

-   `moneyPerTick`: Total money production from all buildings + synergies
-   Additional production types can be mapped (energy, people, etc.)

Current mapping in GameCanvas:

```typescript
for (const [type, value] of totalProduction) {
    if (type === "money") updated.moneyPerTick = value;
    // Add mapping for other types as needed
}
```

## Key Features

✅ **Place Buildings**: Click after selecting from menu
✅ **Rotate Buildings**: Mouse wheel during placement
✅ **Select Buildings**: Click placed building to select
✅ **Remove Buildings**: Right-click or Delete key on selected
✅ **Synergy Detection**: Automatic adjacent building detection
✅ **Production Calculation**: Sum base + synergy production
✅ **Value Updates**: Auto-update GameVariables on changes
✅ **Visual Feedback**: Selection shadow, opacity changes

## Future Enhancements

-   [ ] Preview building placement before clicking
-   [ ] Show synergy indicators between buildings
-   [ ] Collision detection (prevent overlapping)
-   [ ] Building cost validation before placement
-   [ ] Undo/Redo system
-   [ ] Save/Load building placements
-   [ ] Building upgrade system

## Files Modified

-   `src/provider/PlacedBuildingsProvider.tsx` (created)
-   `src/hooks/providers/usePlacedBuildings.ts` (created)
-   `src/utils/buildingUtils.ts` (created)
-   `src/components/Game/KonvaNew/GameCanvas.tsx` (updated)
-   `src/components/Game/KonvaNew/Buildings/BuildingsLayer.tsx` (updated)
-   `src/types/Game/Grid.ts` (updated)
-   `src/pages/Game.tsx` (updated)
