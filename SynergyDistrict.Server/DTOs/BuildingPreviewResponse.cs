using SynergyDistrict.Server.Models;

namespace SynergyDistrict.Server.DTOs
{
    public class BuildingPreviewResponse
    {
        public int BuildingId { get; set; }
        public required string Name { get; set; }
        public BuildingType Type { get; set; }
        public required string ColorHex { get; set; }
        public required string IconKey { get; set; }
        public required BuildingTileType[][] Shape { get; set; }
    }
}
