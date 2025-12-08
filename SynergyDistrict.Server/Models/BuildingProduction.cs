namespace SynergyDistrict.Server.Models
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
        Electricity,
        Industry,
        Happiness
    }
}
