using SynergyDistrict.Server.Models.Buildings;

namespace SynergyDistrict.Server.DTOs
{
    public class BuildingSynergyBuildingResponse
    {
        public int BuildingId { get; set; }
        public required string Name { get; set; }
        public BuildingType Type { get; set; }
    }
}
