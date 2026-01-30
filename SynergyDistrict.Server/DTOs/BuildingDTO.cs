using SynergyDistrict.Server.Models.Buildings;

namespace SynergyDistrict.Server.DTOs
{
    public class BuildingDTO
    {
        public int BuildingId { get; set; }
        public required string Name { get; set; }
        public BuildingType Type { get; set; }
        public required string Description { get; set; }
        public required string IconKey { get; set; }
        public int Cost { get; set; }
        public required BuildingTileType[][] Shape { get; set; }
        public IEnumerable<BuildingProductionDTO> BaseProduction { get; set; } = [];
        public IEnumerable<BuildingUpgradeDTO> Upgrades { get; set; } = [];
    }
}
