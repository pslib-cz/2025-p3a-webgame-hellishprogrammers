namespace SynergyDistrict.Server.DTOs
{
    public class GameDataDTO
    {
        public required IEnumerable<BuildingDTO> Buildings { get; set; }
        public required IEnumerable<BuildingSynergyDTO> Synergies { get; set; }
        public required IEnumerable<SynergyItemDTO> NaturalFeatures { get; set; }
    }
}
