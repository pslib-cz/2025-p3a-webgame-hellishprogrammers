import React, { type ReactElement } from "react";
import { Stage, Layer } from "react-konva";
import { Tile } from "./Game/Tile";
import { useMap } from "../hooks/useMap";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

export default function Game() {
    return <Rendereder size={{width: 1000, height:1000}}/>;
}
