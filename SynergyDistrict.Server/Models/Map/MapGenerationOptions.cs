namespace SynergyDistrict.Server.Models.Map
{
    public class MapGenerationOptions
    {
        public int seed { get; set; }
        public int renderDistanceX { get; set; }
        public int renderDistanceY { get; set; }
        public int chunkSize { get; set; }
        public int positionX { get; set; }
        public int positionY { get; set; }
    }
}
