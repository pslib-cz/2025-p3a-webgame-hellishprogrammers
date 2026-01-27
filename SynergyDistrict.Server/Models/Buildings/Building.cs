using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace SynergyDistrict.Server.Models.Buildings
{
    public class Building
    {
        public int BuildingId { get; set; }
        public int SynergyItemId { get; set; }
        public SynergyItem SynergyItem { get; set; } = null!;
        public BuildingType Type { get; set; }
        public required string Description { get; set; }
        public required string IconKey { get; set; }
        public int Cost { get; set; }

        [NotMapped]
        public BuildingTileType[][] Shape
        {
            get => string.IsNullOrEmpty(ShapeSerialized)
                ? Array.Empty<BuildingTileType[]>()
                : JsonSerializer.Deserialize<BuildingTileType[][]>(ShapeSerialized)!;
            set => ShapeSerialized = JsonSerializer.Serialize(value);
        }

        public string ShapeSerialized { get; set; } = string.Empty;

        public ICollection<BuildingProduction> BaseProduction { get; set; } = [];
    }

    public enum BuildingType
    {
        Residential,
        Commercial,
        Industrial,
        Extractional,
        Recreational
    }

    public enum BuildingTileType
    {
        Empty,
        Solid,
        Icon
    }
}
