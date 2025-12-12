using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using SynergyDistrict.Server.Models.Map;

namespace SynergyDistrict.Server.Services
{
    public class MapService
    {
        private readonly float thresholdLand = -0.2f;
        private readonly float treshholdMountain = 0.6f;

        public MapTile[][] GetAdjecentChunks(MapGenerationOptions options)
        {
            Position startChunkPosition = new Position { X = options.positionX - options.renderDistanceX, Y = options.positionY - options.renderDistanceY };
            List<MapTile> tiles = new List<MapTile>();
            int widthChunks = options.renderDistanceX * 2 + 1;
            int heightChunks = options.renderDistanceY * 2 + 1;

            for (int i = 0; i < options.renderDistanceX * 2 + 1; i++)
            {
                for (int j = 0; j < options.renderDistanceY * 2 + 1; j++)
                {
                    tiles.AddRange(GetChunkAt(options,new Position { X = i + startChunkPosition.X, Y = j + startChunkPosition.Y }));
                }
            }

            MapTile[][] map = new MapTile[widthChunks * options.chunkSize][];
            for (int i = 0; i < map.Length; i++)
            {
                map[i] = new MapTile[heightChunks * options.chunkSize];
            }
            var tileFirst = tiles[0];
            Position tileOffsetPosition = new Position { X = tileFirst.Position.X, Y = tileFirst.Position.Y };

            foreach (var tile in tiles)
            {
                map[tile.Position.X - tileOffsetPosition.X][tile.Position.Y - tileOffsetPosition.Y] = tile;
            }

            return map;
        }

        MapTile[] GetChunkAt(MapGenerationOptions options, Position chunkPosition)
        {
            var seedHash = HashCode.Combine(options.seed, chunkPosition.X, chunkPosition.Y);
            var rand = new Random(seedHash);

            int offsetX = chunkPosition.X * options.chunkSize;
            int offsetY = chunkPosition.Y * options.chunkSize;
            List<MapTile> chunk = new List<MapTile>();

            for (int i = 0; i < options.chunkSize; i++)
            {
                for (int j = 0; j < options.chunkSize; j++)
                {
                    var type = getRandomTileType(GetHeight(options.seed, i + offsetX, j + offsetY), rand.NextDouble());
                    chunk.Add(new MapTile
                    {
                        Position = new Position
                        {
                            X = i + offsetX,
                            Y = j + offsetY,
                        },
                        TileType = type,
                        hasIcon = type == MapTileType.Grass || type == MapTileType.Water ? (rand.NextDouble() > .85 ? true : false) : true,

                    });
                }
            }

            return chunk.ToArray();
        }

        private FastNoiseLite Create(int seed)
        {
            var n = new FastNoiseLite(seed);
            n.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);
            n.SetFrequency(0.05f);
            n.SetFractalType(FastNoiseLite.FractalType.FBm);
            n.SetFractalOctaves(3);
            n.SetFractalLacunarity(1.5f);
            n.SetFractalGain(0.4f);
            return n;
        }

        public float GetHeight(int seed, int worldX, int worldY)
        {
            var n = Create(seed);
            return n.GetNoise(worldX, worldY);
        }

        MapTileType getRandomTileType (float h, double f)
        {
            if(h > treshholdMountain)
            {
                return MapTileType.Mountain;
            }
            if(h > thresholdLand)
            {
                if (f > .90)
                {
                    return MapTileType.Forest;
                }
                return MapTileType.Grass;
            }
            return MapTileType.Water;
        }
    }
}
