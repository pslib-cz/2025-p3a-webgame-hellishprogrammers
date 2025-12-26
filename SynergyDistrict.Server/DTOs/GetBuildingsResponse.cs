using SynergyDistrict.Server.Models.Buildings;

namespace SynergyDistrict.Server.DTOs
{
    public class GetBuildingsResponse
    {
        public int BuildingId { get; set; }
        public required string Name { get; set; }
        public BuildingType Type { get; set; }
        public required string Description { get; set; }
        public required string IconKey { get; set; }
        public int Cost { get; set; }

        public required BuildingTileType[][] Shape { get; set; }

        public ICollection<BuildingProduction> BaseProduction { get; set; } = [];
        public ICollection<BuildingSynergyResponse> IncomingSynergies { get; set; } = [];
        public ICollection<BuildingSynergyResponse> OutgoingSynergies { get; set; } = [];
    }
}
