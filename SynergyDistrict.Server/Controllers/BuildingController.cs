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

        //[HttpGet]
        //public ActionResult<IEnumerable<BuildingDTO>> GetBuildings()
        //{
        //    var buildings = _appDBContext.Buildings
        //        .AsNoTracking()
        //        .Include(b => b.BaseProduction)
        //        .Include(b => b.IncomingSynergies)
        //            .ThenInclude(s => s.SourceBuilding)
        //        //.Include(b => b.IncomingSynergies)
        //        //    .ThenInclude(s => s.TargetBuilding)
        //        .Include(b => b.IncomingSynergies)
        //            .ThenInclude(s => s.SynergyProductions)
        //        //.Include(b => b.OutgoingSynergies)
        //        //    .ThenInclude(s => s.SourceBuilding)
        //        .Include(b => b.OutgoingSynergies)
        //            .ThenInclude(s => s.TargetBuilding)
        //        .Include(b => b.OutgoingSynergies)
        //            .ThenInclude(s => s.SynergyProductions)
        //        .ToList();

        //    var response = buildings.Select(b => new BuildingDTO
        //    {
        //        BuildingId = b.BuildingId,
        //        Name = b.Name,
        //        Type = b.Type,
        //        Description = b.Description,
        //        IconKey = b.IconKey,
        //        Cost = b.Cost,
        //        Shape = b.Shape,
        //        BaseProduction = b.BaseProduction,
        //        IncomingSynergies = BuildingSynergyResponse.FromModelList(b.IncomingSynergies),
        //        OutgoingSynergies = BuildingSynergyResponse.FromModelList(b.OutgoingSynergies)
        //    }).ToList();

        //    _logger.LogInformation($"Got {buildings.Count} buildings");
        //    return Ok(response);
        //}

        [HttpGet]
        public ActionResult<GameDataDTO> GetGameData()
        {
            var buildings = _context.Buildings
                .AsNoTracking()
                .Include(b => b.BaseProduction)
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
                        //BuildingProductionId = p.BuildingProductionId,
                        Value = p.Value,
                        Type = p.Type,
                        //BuildingId = p.BuildingId,
                    })
                })
                .ToList();

            var synergies = _context.BuildingSynergies
                .AsNoTracking()
                .Include(s => s.SynergyProductions)
                .Select(s => new BuildingSynergyDTO
                {
                    BuildingSynergyId = s.BuildingSynergyId,
                    TargetBuildingId = s.TargetBuildingId,
                    SourceBuildingId = s.SourceBuildingId,
                    SynergyProductions = s.SynergyProductions.Select(p => new BuildingProductionDTO
                    {
                        //BuildingProductionId = p.BuildingProductionId,
                        Value = p.Value,
                        Type = p.Type,
                        //BuildingId = p.BuildingId,
                    })
                })
                .ToList();

             return Ok(new GameDataDTO { Buildings = buildings, Synergies = synergies });
        }
    }
}

