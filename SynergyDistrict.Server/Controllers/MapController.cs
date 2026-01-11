using Microsoft.AspNetCore.Mvc;
using SynergyDistrict.Server.Models.Map;
using SynergyDistrict.Server.Services;

namespace SynergyDistrict.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MapController : ControllerBase
    {
        private readonly MapService _mapService;

        public MapController(MapService mapService)
        {
            _mapService = mapService;
        }

        [HttpPost("generate")]
        public ActionResult<Dictionary<string, MapTile[]>> GenerateMap(
            [FromBody] MapGenerationOptions options
        )
        {
            var map = _mapService.GetAdjecentChunks(options);
            return Ok(map);
        }
    }
}
