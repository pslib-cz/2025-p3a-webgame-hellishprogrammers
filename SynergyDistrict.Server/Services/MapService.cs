using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using SynergyDistrict.Server.Models.Map;

namespace SynergyDistrict.Server.Services
{
    public class MapService
    {
        public MapTile[][] GenerateMap(MapGenerationOptions options)
        {
            //placeholder implementation
            int width = options.Width;
            int height = options.Height;

            MapTile[][] map = new MapTile[height][];
            for (int y = 0; y < height; y++)
            {
                map[y] = new MapTile[width];
                for (int x = 0; x < width; x++)
                {
                    map[y][x] = new MapTile
                    {
                        TileType = MapTileType.Grass,
                        hasIcon = false
                    };
                }
            }

            return map;
        }
    }
}
