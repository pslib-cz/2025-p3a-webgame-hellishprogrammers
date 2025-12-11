using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using SynergyDistrict.Server.Models.Map;

namespace SynergyDistrict.Server.Services
{
    public class MapService
    {
        public MapTile[][] GetAdjecentChunks(MapGenerationOptions options)
        {
            Position startChunkPosition = new Position { X = options.positionX - options.renderDistanceX, Y = options.positionY - options.renderDistanceY };
            List<MapTile> tiles = new List<MapTile>();
            int widthChunks = options.renderDistanceX * 2 + 1;
            int heightChunks = options.renderDistanceY * 2 + 1;
            Console.WriteLine($"Width in chunks: {widthChunks}");
            Console.WriteLine($"Height in chunks: {heightChunks}");

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
            int chunkSeed = HashCode.Combine(options.seed, chunkPosition.X, chunkPosition.Y);
            var rand = new Random(chunkSeed);

            int offsetX = chunkPosition.X * options.chunkSize;
            int offsetY = chunkPosition.Y * options.chunkSize;
            List<MapTile> chunk = new List<MapTile>();

            for (int i = 0; i < options.chunkSize; i++)
            {
                for (int j = 0; j < options.chunkSize; j++)
                {
                    chunk.Add(new MapTile
                    {
                        Position = new Position 
                        {
                            X = i + offsetX,
                            Y = j + offsetY,
                        },
                        TileType = getRandomTileType(rand.Next(4)),
                        hasIcon = false,
                        
                    });
                }
            }

            return chunk.ToArray();
        }

        MapTileType getRandomTileType (int randomNum)
        {
            switch (randomNum)
            {
                case 0:
                    return MapTileType.Grass;
                case 1:
                    return MapTileType.Water;
                case 2:
                    return MapTileType.Mountain;
                case 3:
                    return MapTileType.Forest;
                default: 
                    return MapTileType.Grass;
            }
        }
    }
}
