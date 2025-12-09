namespace SynergyDistrict.Server.Models
{
    public class BuildingSynergy
    {
        public int BuildingSynergyId { get; set; }

        public int TargetBuildingId { get; set; }
        public Building TargetBuilding { get; set; } = null!;

        public int SourceBuildingId { get; set; }
        public Building SourceBuilding { get; set; } = null!;

        public ICollection<BuildingProduction> SynergyProductions { get; set; } = new List<BuildingProduction>();
    }
}
