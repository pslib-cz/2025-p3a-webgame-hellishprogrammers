using Microsoft.AspNetCore.Mvc;
using SynergyDistrict.Server.Services;
using SynergyDistrict.Server.Models.Map;

namespace SynergyDistrict.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MapController: ControllerBase
    {
        private readonly MapService _mapService;
        public MapController(MapService mapService)
        {
            _mapService = mapService;
        }

        [HttpPost("generate")]
        public ActionResult<MapTile[][]> GenerateMap([FromBody] MapGenerationOptions options)
        {
            var map = _mapService.GetAdjecentChunks(options);
            return Ok(map);
        }
    }
}
