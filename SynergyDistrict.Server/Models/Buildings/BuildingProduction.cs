namespace SynergyDistrict.Server.Models.Buildings
{
    public class BuildingProduction
    {
        public int BuildingProductionId { get; set; }
        public int Value { get; set; }
        public BuildingProductionType Type { get; set; }
        public int BuildingId { get; set; }
        public Building Building { get; set; } = null!;
    }

    public enum BuildingProductionType
    {
        Money,
        People,
        Energy,
        Industry,
        Happiness
    }
}
