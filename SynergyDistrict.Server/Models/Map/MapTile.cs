namespace SynergyDistrict.Server.Models.Map
{
    public class MapTile
    {
        public MapTileType TileType { get; set; }
        public bool hasIcon { get; set; }
    }

    public enum MapTileType
    {
        Grass,
        Water,
        Forest,
        Mountain,
    }
}
