using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace SynergyDistrict.Server.Models
{
    public class Building
    {
        public int BuildingId { get; set; }
        public required string Name { get; set; }
        public BuildingType Type { get; set; }

        [NotMapped]
        public BuildingTileType[][] Shape
        {
            get => string.IsNullOrEmpty(ShapeSerialized)
                ? Array.Empty<BuildingTileType[]>()
                : JsonSerializer.Deserialize<BuildingTileType[][]>(ShapeSerialized)!;
            set => ShapeSerialized = JsonSerializer.Serialize(value);
        }

        public string ShapeSerialized { get; set; } = string.Empty;

        public ICollection<BuildingProduction> BaseProduction { get; set; } = new List<BuildingProduction>();
        public ICollection<BuildingSynergy> Synergies { get; set; } = new List<BuildingSynergy>();
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
        Filled,
        Icon
    }
}
