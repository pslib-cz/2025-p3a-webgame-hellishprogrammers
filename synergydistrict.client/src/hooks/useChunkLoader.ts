import { useEffect, useMemo, useState } from "react";
import { useMap } from "./fetches/useMap";
import type { MapGeneratingOptions, MapTile, Position } from "../types/Game/Grid";

type ViewportDimensions = {
	width: number;
	height: number;
};

type UseChunkLoaderOptions = {
	seed: number;
	chunkSize: number;
	renderDistanceChunks: number;
	maxLoadedChunks: number;
	tileSize: number;
	stageScale: number;
	stagePosition: Position;
	viewport: ViewportDimensions;
	allowDynamicLoading?: boolean;
};

type UseChunkLoaderResult = {
	loadedChunks: Record<string, MapTile[]>;
	loading: boolean;
	error: string | null;
	centerChunk: Position | null;
	mapOptions: MapGeneratingOptions;
};

const createInitialOptions = (
	seed: number,
	chunkSize: number,
	renderDistanceChunks: number,
): MapGeneratingOptions => ({
	seed,
	chunkSize,
	startChunkPos: { x: -renderDistanceChunks, y: -renderDistanceChunks },
	endChunkPos: { x: renderDistanceChunks, y: renderDistanceChunks },
});

const useChunkLoader = ({
	seed,
	chunkSize,
	renderDistanceChunks,
	maxLoadedChunks,
	tileSize,
	stageScale,
	stagePosition,
	viewport,
	allowDynamicLoading = true,
}: UseChunkLoaderOptions): UseChunkLoaderResult => {
	const initialOptions = useMemo(
		() => createInitialOptions(seed, chunkSize, renderDistanceChunks),
		[seed, chunkSize, renderDistanceChunks],
	);

	const [mapOptions, setMapOptions] = useState<MapGeneratingOptions>(initialOptions);
	const [centerChunk, setCenterChunk] = useState<Position | null>(null);
	const [loadedChunks, setLoadedChunks] = useState<Record<string, MapTile[]>>({});

	useEffect(() => {
		setMapOptions(initialOptions);
		setLoadedChunks({});
	}, [initialOptions]);

	useEffect(() => {
		if (allowDynamicLoading) return;

		setMapOptions(initialOptions);
		setLoadedChunks((prev) => {
			if (!Object.keys(prev).length) {
				return prev;
			}

			const { startChunkPos, endChunkPos } = initialOptions;
			const filtered: Record<string, MapTile[]> = {};

			for (const [key, tiles] of Object.entries(prev)) {
				const [chunkX, chunkY] = key.split(";").map(Number);
				if (
					chunkX >= startChunkPos.x &&
					chunkX <= endChunkPos.x &&
					chunkY >= startChunkPos.y &&
					chunkY <= endChunkPos.y
				) {
					filtered[key] = tiles;
				}
			}

			return filtered;
		});
	}, [allowDynamicLoading, initialOptions]);

	useEffect(() => {
		const { width, height } = viewport;
		if (!width || !height) return;
		if (stageScale === 0) return;

		const chunkSizeInPixels = chunkSize * tileSize;
		if (chunkSizeInPixels === 0) return;

		const worldCenterX = (width / 2 - stagePosition.x) / stageScale;
		const worldCenterY = (height / 2 - stagePosition.y) / stageScale;

		const nextCenter = {
			x: Math.floor(worldCenterX / chunkSizeInPixels),
			y: Math.floor(worldCenterY / chunkSizeInPixels),
		};

		setCenterChunk((prev) => {
			if (prev && prev.x === nextCenter.x && prev.y === nextCenter.y) {
				return prev;
			}
			return nextCenter;
		});
	}, [viewport.width, viewport.height, stagePosition.x, stagePosition.y, stageScale, chunkSize, tileSize]);

	useEffect(() => {
		if (!allowDynamicLoading) return;
		if (!centerChunk) return;

		const startChunkPos = {
			x: centerChunk.x - renderDistanceChunks,
			y: centerChunk.y - renderDistanceChunks,
		};
		const endChunkPos = {
			x: centerChunk.x + renderDistanceChunks,
			y: centerChunk.y + renderDistanceChunks,
		};

		setMapOptions((prev) => {
			if (
				prev.seed === seed &&
				prev.chunkSize === chunkSize &&
				prev.startChunkPos.x === startChunkPos.x &&
				prev.startChunkPos.y === startChunkPos.y &&
				prev.endChunkPos.x === endChunkPos.x &&
				prev.endChunkPos.y === endChunkPos.y
			) {
				return prev;
			}

			return {
				seed,
				chunkSize,
				startChunkPos,
				endChunkPos,
			};
		});
	}, [allowDynamicLoading, centerChunk, renderDistanceChunks, seed, chunkSize]);

	const { data: newChunks, loading, error } = useMap(mapOptions);

	useEffect(() => {
		if (!newChunks) return;

		setLoadedChunks((prev) => {
			let hasChanges = false;
			const combined: Record<string, MapTile[]> = { ...prev };

			for (const [key, value] of Object.entries(newChunks)) {
				if (combined[key] !== value) {
					combined[key] = value;
					hasChanges = true;
				}
			}

			let finalChunks = combined;

			if (centerChunk && maxLoadedChunks > 0) {
				const keys = Object.keys(combined);
				if (keys.length > maxLoadedChunks) {
					const sorted = keys
						.map((key) => {
							const [chunkX, chunkY] = key.split(";").map(Number);
							const distance = Math.hypot(chunkX - centerChunk.x, chunkY - centerChunk.y);
							return { key, distance };
						})
						.sort((a, b) => a.distance - b.distance);

					finalChunks = sorted.slice(0, maxLoadedChunks).reduce<Record<string, MapTile[]>>((acc, entry) => {
						acc[entry.key] = combined[entry.key];
						return acc;
					}, {});

					hasChanges = true;
				}
			}

			return hasChanges ? finalChunks : prev;
		});
	}, [newChunks, centerChunk, maxLoadedChunks]);

	return {
		loadedChunks,
		loading,
		error,
		centerChunk,
		mapOptions,
	};
};

export default useChunkLoader;
