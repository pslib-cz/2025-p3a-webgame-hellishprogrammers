using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SynergyDistrict.Server.Data;
using SynergyDistrict.Server.DTOs;

namespace SynergyDistrict.Server.Controllers
{
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
        public ActionResult<BuildingPreviewResponse> GetAllBuildings()
        {
            var buildings = _appDBContext.Buildings.AsNoTracking().ToList();
            var buildingPreviews = buildings.Select(b => new DTOs.BuildingPreviewResponse
            {
                BuildingId = b.BuildingId,
                Name = b.Name,
                Type = b.Type,
                ColorHex = b.ColorHex,
                IconKey = b.IconKey,
                Shape = b.Shape
            }).ToList();
            return Ok(buildings);
        }

        [HttpGet("{id}")]
        public ActionResult<BuildingDetailResponse> GetBuildingDetail(int id)
        {
            var building = _appDBContext.Buildings
                .AsNoTracking()
                .Include(b => b.BaseProduction)
                .Include(b => b.IncomingSynergies)
                .Include(b => b.OutgoingSynergies)
                .FirstOrDefault(b => b.BuildingId == id);
            if (building == null) { return NotFound(); }

            if(building.IncomingSynergies == null || building.OutgoingSynergies == null)
            {
                _logger.LogError("Building with ID {BuildingId} has null synergies.", id);
                return StatusCode(500, "Internal server error: Building synergies are not properly loaded.");
            }
            try
            {
                var response = new BuildingDetailResponse
                {
                    BuildingId = building.BuildingId,
                    Name = building.Name,
                    Type = building.Type,
                    Description = building.Description,
                    ColorHex = building.ColorHex,
                    IconKey = building.IconKey,
                    Cost = building.Cost,
                    Shape = building.Shape,
                    BaseProduction = building.BaseProduction,
                    IncomingSynergies = BuildingSynergyResponse.FromModelList(building.IncomingSynergies),
                    OutgoingSynergies = BuildingSynergyResponse.FromModelList(building.OutgoingSynergies)
                };
                return Ok(response);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error while processing synergies for building with ID {BuildingId}.", id);
                return StatusCode(500, "Internal server error: Error while processing building synergies.");
            }
        }
    }
}

