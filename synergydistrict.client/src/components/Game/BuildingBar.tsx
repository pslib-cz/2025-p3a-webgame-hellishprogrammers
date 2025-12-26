import { useState, type FC } from "react";
import { BuildingApi } from "../../api/BuildingApi";

export const BuildingBar: FC = () => {
    const buildings = new BuildingApi();

    return (
        <div className="bar">

        </div>
    );
};
