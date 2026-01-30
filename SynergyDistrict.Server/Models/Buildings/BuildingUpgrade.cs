namespace SynergyDistrict.Server.Models.Buildings
{
    public class BuildingUpgrade
    {
        public int BuildingUpgradeId { get; set; }
        public int? UpgradeCost { get; set; }
        public int DeleteCost { get; set; }
        public ICollection<BuildingProduction> UpgradeProductions { get; set; } = [];
    }
}
