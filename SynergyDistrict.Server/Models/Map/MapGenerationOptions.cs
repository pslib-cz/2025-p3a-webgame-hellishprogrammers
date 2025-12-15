namespace SynergyDistrict.Server.Models.Map
{
    public class MapGenerationOptions
    {
        public int seed { get; set; }
        public int chunkSize { get; set; }
        public Position startChunkPos { get; set; }
        public Position endChunkPos { get; set; }
    }
}
