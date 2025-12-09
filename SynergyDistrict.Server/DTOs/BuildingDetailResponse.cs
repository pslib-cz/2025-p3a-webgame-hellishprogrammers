using SynergyDistrict.Server.Models;

namespace SynergyDistrict.Server.DTOs
{
    public class BuildingDetailResponse
    {
        public int BuildingId { get; set; }
        public required string Name { get; set; }
        public BuildingType Type { get; set; }
        public required string Description { get; set; }
        public required string ColorHex { get; set; }
        public required string IconKey { get; set; }
        public int Cost { get; set; }

        public required BuildingTileType[][] Shape { get; set; }

        public ICollection<BuildingProduction> BaseProduction { get; set; } = new List<BuildingProduction>();
        public ICollection<BuildingSynergyResponse> IncomingSynergies { get; set; } = new List<BuildingSynergyResponse>();
        public ICollection<BuildingSynergyResponse> OutgoingSynergies { get; set; } = new List<BuildingSynergyResponse>();
    }
}
