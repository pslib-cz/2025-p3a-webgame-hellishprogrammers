# Building System - Quick Reference

## How to Place Buildings

1. **Open GameBar** - Select a building from the available options
2. **Rotate (Optional)** - Spin mouse wheel to rotate the building (4 rotations)
3. **Place** - Left-click on the map where you want to place it
4. **Placed!** - Building appears on map, synergies calculate automatically

## How to Manage Buildings

| Action           | How                                  |
| ---------------- | ------------------------------------ |
| **Select**       | Left-click on the building           |
| **Deselect**     | Left-click on empty area             |
| **Rotate**       | Mouse wheel (during placement mode)  |
| **Remove**       | Right-click OR select + press Delete |
| **View Details** | Click building to select it          |

## Visual Indicators

-   **Selected Building**: Gold shadow effect with reduced opacity
-   **Building Outline**: Shows building category color
-   **Placement Preview**: Updates as you move mouse during placement

## Synergy System

Synergies are **automatically detected** when:

-   Buildings are placed next to each other
-   Adjacent buildings have synergy rules defined

### Example Synergies

```
Industrial → Residential: Happiness boost
Commercial → Residential: Money boost
Factory → Industrial: Production boost
```

Production is automatically added to your **Game Values**:

-   Money/tick increases
-   Other production types update as synergies trigger

## Game Integration

### Current Production Tracking

-   **moneyPerTick**: Total money production (buildings + synergies)

### Add More Production Types

In `src/components/Game/KonvaNew/GameCanvas.tsx`, update the production mapping:

```typescript
for (const [type, value] of totalProduction) {
    if (type === "money") updated.moneyPerTick = value;
    if (type === "energy") updated.energyMax = value; // Example
    if (type === "happiness") updated.happiness = value; // Example
}
```

## Developer Notes

### Rotation Values

-   `0` = 0° (original)
-   `1` = 90° clockwise
-   `2` = 180°
-   `3` = 270° clockwise

### Building Instance ID

Each placed building gets a unique ID: `{buildingId}-{counter}`
This allows tracking individual instances of the same building type.

### Synergy Detection Algorithm

1. Get all tiles occupied by each building
2. Check 4-directional neighbors for each tile
3. Look up synergy rules between building types
4. Sum production from all synergies

### Performance Notes

-   Building bitmaps are cached with `useMemo`
-   Only visible buildings render on canvas
-   Synergy detection runs on building changes only
