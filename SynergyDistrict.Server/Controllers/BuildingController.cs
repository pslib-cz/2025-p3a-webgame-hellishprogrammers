using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SynergyDistrict.Server.Data;
using SynergyDistrict.Server.DTOs;

namespace SynergyDistrict.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BuildingController : ControllerBase
    {
        private readonly ILogger<BuildingController> _logger;
        private readonly AppDBContext _appDBContext;

        public BuildingController(ILogger<BuildingController> logger, AppDBContext appDBContext)
        {
            _logger = logger;
            _appDBContext = appDBContext;
        }

        [HttpGet]
        public ActionResult<IEnumerable<GetBuildingsResponse>> GetBuildings()
        {
            var buildings = _appDBContext.Buildings
                .AsNoTracking()
                .Include(b => b.BaseProduction)
                .Include(b => b.IncomingSynergies)
                    .ThenInclude(s => s.SourceBuilding)
                .Include(b => b.IncomingSynergies)
                    .ThenInclude(s => s.TargetBuilding)
                .Include(b => b.IncomingSynergies)
                    .ThenInclude(s => s.SynergyProductions)
                .Include(b => b.OutgoingSynergies)
                    .ThenInclude(s => s.SourceBuilding)
                .Include(b => b.OutgoingSynergies)
                    .ThenInclude(s => s.TargetBuilding)
                .Include(b => b.OutgoingSynergies)
                    .ThenInclude(s => s.SynergyProductions)
                .ToList();

            var response = buildings.Select(b => new GetBuildingsResponse
            {
                BuildingId = b.BuildingId,
                Name = b.Name,
                Type = b.Type,
                Description = b.Description,
                IconKey = b.IconKey,
                Cost = b.Cost,
                Shape = b.Shape,
                BaseProduction = b.BaseProduction,
                IncomingSynergies = BuildingSynergyResponse.FromModelList(b.IncomingSynergies),
                OutgoingSynergies = BuildingSynergyResponse.FromModelList(b.OutgoingSynergies)
            }).ToList();

            _logger.LogInformation($"Got {buildings.Count} buildings");
            return Ok(response);
        }
    }
}

