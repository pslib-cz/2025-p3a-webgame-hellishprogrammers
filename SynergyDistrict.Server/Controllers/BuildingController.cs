using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SynergyDistrict.Server.Data;
using SynergyDistrict.Server.DTOs;
using SynergyDistrict.Server.Models.Buildings;
using SynergyDistrict.Server.Models.Map;

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
                    Name = b.SynergyItem.Name,
                    Type = b.Type,
                    Description = b.Description,
                    IconKey = b.IconKey,
                    Cost = b.Cost,
                    Shape = b.Shape,
                    BaseProduction = b.BaseProduction.Select(p => new BuildingProductionDTO
                    {
                        Value = p.Value,
                        Type = p.Type,
                    }),
                    Upgrades = b.Upgrades.Select(u => new BuildingUpgradeDTO
                    {
                        UpgradeCost = u.UpgradeCost,
                        DeleteCost = u.DeleteCost,
                        UpgradeProductions = u.UpgradeProductions.Select(p => new BuildingProductionDTO
                        {
                            Value = p.Value,
                            Type = p.Type,
                        }),
                        UpgradeSynergies = u.UpgradeSynergies.Select(s => new BuildingSynergyDTO
                        {
                            TargetBuildingId = s.TargetSynergyItemId,
                            SourceBuildingId = s.SourceSynergyItemId,
                            SynergyProductions = s.SynergyProductions.Select(p => new BuildingProductionDTO
                            {
                                Value = p.Value,
                                Type = p.Type,
                            })
                        })
                    })
                })
                .ToList();

            var synergies = _context.BuildingSynergies
                .AsNoTracking()
                .Where(s => s.BuildingUpgradeId == null)
                .Select(s => new BuildingSynergyDTO
                {
                    TargetBuildingId = s.TargetSynergyItemId,
                    SourceBuildingId = s.SourceSynergyItemId,
                    SynergyProductions = s.SynergyProductions.Select(p => new BuildingProductionDTO
                    {
                        Value = p.Value,
                        Type = p.Type,
                    })
                })
                .ToList();

            var tileTypeNames = Enum.GetNames(typeof(MapTileType));
            var naturalFeatures = _context.SynergyItems
                .AsNoTracking()
                .Where(i => tileTypeNames.Contains(i.Name))
                .Select(i => new SynergyItemDTO
                {
                    SynergyItemId = i.Id,
                    Name = i.Name,
                });

            return Ok(new GameDataDTO { Buildings = buildings, Synergies = synergies, NaturalFeatures = naturalFeatures });
        }
    }
}

