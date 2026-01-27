using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SynergyDistrict.Server.Data;
using SynergyDistrict.Server.DTOs;
using SynergyDistrict.Server.Models.Buildings;

namespace SynergyDistrict.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BuildingController : ControllerBase
    {
        private readonly ILogger<BuildingController> _logger;
        private readonly AppDBContext _context;

        public BuildingController(ILogger<BuildingController> logger, AppDBContext appDBContext)
        {
            _logger = logger;
            _context = appDBContext;
        }

        [HttpGet]
        public ActionResult<GameDataDTO> GetGameData()
        {
            var buildings = _context.Buildings
                .AsNoTracking()
                .Select(b => new BuildingDTO
                {
                    BuildingId = b.BuildingId,
                    Name = b.Name,
                    Type = b.Type,
                    Description = b.Description,
                    IconKey = b.IconKey,
                    Cost = b.Cost,
                    Shape = b.Shape,
                    BaseProduction = b.BaseProduction.Select(p => new BuildingProductionDTO
                    {
                        Value = p.Value,
                        Type = p.Type,
                    })
                })
                .ToList();

            var synergies = _context.BuildingSynergies
                .AsNoTracking()
                .Select(s => new BuildingSynergyDTO
                {
                    BuildingSynergyId = s.BuildingSynergyId,
                    TargetBuildingId = s.TargetBuildingId,
                    SourceBuildingId = s.SourceBuildingId,
                    SynergyProductions = s.SynergyProductions.Select(p => new BuildingProductionDTO
                    {
                        Value = p.Value,
                        Type = p.Type,
                    })
                })
                .ToList();

            return Ok(new GameDataDTO { Buildings = buildings, Synergies = synergies });
        }
    }
}

