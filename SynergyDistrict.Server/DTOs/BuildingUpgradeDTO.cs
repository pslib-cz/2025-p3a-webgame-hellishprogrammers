using SynergyDistrict.Server.Models.Buildings;

namespace SynergyDistrict.Server.DTOs
{
    public class BuildingUpgradeDTO
    {
        public int? UpgradeCost { get; set; }
        public int DeleteCost { get; set; }
        public required IEnumerable<BuildingProductionDTO> UpgradeProductions { get; set; }
        public required IEnumerable<BuildingSynergyDTO> UpgradeSynergies { get; set; }
    }
}
