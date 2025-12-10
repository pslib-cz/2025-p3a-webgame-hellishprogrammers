using SynergyDistrict.Server.Models.Buildings;

namespace SynergyDistrict.Server.DTOs
{
    public class BuildingSynergyResponse
    {
        public required BuildingSynergyBuildingResponse TargetBuilding { get; set; }
        public required BuildingSynergyBuildingResponse SourceBuilding { get; set; }
        public ICollection<BuildingProduction> SynergyProductions { get; set; } = new List<BuildingProduction>();

        public static BuildingSynergyResponse FromModel(BuildingSynergy synergy)
        {
            if(synergy.TargetBuilding == null)
            {
                throw new ArgumentNullException(nameof(synergy.TargetBuilding), "TargetBuilding cannot be null");
            }
            if(synergy.SourceBuilding == null)
            {
                throw new ArgumentNullException(nameof(synergy.SourceBuilding), "SourceBuilding cannot be null");
            }
            return new BuildingSynergyResponse
            {
                TargetBuilding = new BuildingSynergyBuildingResponse
                {
                    BuildingId = synergy.TargetBuilding.BuildingId,
                    Name = synergy.TargetBuilding.Name,
                    Type = synergy.TargetBuilding.Type,
                    ColorHex = synergy.TargetBuilding.ColorHex,
                },
                SourceBuilding = new BuildingSynergyBuildingResponse
                {
                    BuildingId = synergy.SourceBuilding.BuildingId,
                    Name = synergy.SourceBuilding.Name,
                    Type = synergy.SourceBuilding.Type,
                    ColorHex = synergy.SourceBuilding.ColorHex,
                },
                SynergyProductions = synergy.SynergyProductions
            };
        }

        public static List<BuildingSynergyResponse> FromModelList(IEnumerable<BuildingSynergy> synergies)
        {
            return synergies.Select(FromModel).ToList();
        }
    }
}
