using SynergyDistrict.Server.Models.Buildings;

namespace SynergyDistrict.Server.DTOs
{
    public class BuildingSynergyDTO
    {
        public int TargetBuildingId { get; set; }
        public int SourceBuildingId { get; set; }

        public required IEnumerable<BuildingProductionDTO> SynergyProductions { get; set; }
    }
}
