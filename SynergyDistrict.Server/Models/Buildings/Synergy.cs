using System.ComponentModel.DataAnnotations.Schema;

namespace SynergyDistrict.Server.Models.Buildings
{
    public class Synergy
    {
        public int SynergyId { get; set; }

        public int? BuildingUpgradeId { get; set; }

        public int TargetSynergyItemId { get; set; }
        public SynergyItem TargetSynergyItem { get; set; } = null!;

        public int SourceSynergyItemId { get; set; }
        public SynergyItem SourceSynergyItem { get; set; } = null!;

        public ICollection<BuildingProduction> SynergyProductions { get; set; } = new List<BuildingProduction>();
    }
}
