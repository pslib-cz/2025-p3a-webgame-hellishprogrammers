using SynergyDistrict.Server.Models.Buildings;
using SynergyDistrict.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace SynergyDistrict.Server.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDBContext context)
        {
            // Apply any pending migrations
            context.Database.Migrate();

            if (context.Buildings.Any())
            {
                return;
            }

            var synergyItems = new[]
            {
                new SynergyItem { Name = "Lumberjack" },
                new SynergyItem { Name = "Mine" },
                new SynergyItem { Name = "Farm" },
                new SynergyItem { Name = "Factory" },
                new SynergyItem { Name = "House" },
                new SynergyItem { Name = "Park" },
                new SynergyItem { Name = "Town Hall" },
                new SynergyItem { Name = "Market" },

                new SynergyItem { Name = "Grass" },
                new SynergyItem { Name = "Forest" },
                new SynergyItem { Name = "Water" },
                new SynergyItem { Name = "Mountain" }
            };

            context.SynergyItems.AddRange(synergyItems);
            context.SaveChanges();

            var synergyItemMap = synergyItems.ToDictionary(s => s.Name, s => s);

            var buildings = new Building[]
            {
                new Building
                {
                    SynergyItem = synergyItemMap["Lumberjack"],
                    Type = BuildingType.Extractional,
                    Description = "Automated logging unit. Harvests resources from nearby woodlands. Warning: High decibel output affects residential zones.",
                    IconKey = "lumberjack",
                    Cost = 100,
                    Shape =
                    [
                        [BuildingTileType.Solid, BuildingTileType.Icon, BuildingTileType.Empty],
                        [BuildingTileType.Empty, BuildingTileType.Solid, BuildingTileType.Solid]
                    ],
                    BaseProduction = 
                    [
                        new BuildingProduction { Type = BuildingProductionType.People, Value = -3 },
                        new BuildingProduction { Type = BuildingProductionType.Industry, Value = 1 },
                    ]
                },
                new Building
                {
                    SynergyItem = synergyItemMap["Mine"],
                    Type = BuildingType.Extractional,
                    Description = "Deep-crust drilling operation. Maximizes raw material output. Causes severe happiness penalty in the immediate vicinity.",
                    IconKey = "mine",
                    Cost = 300,
                    Shape =
                    [
                        [BuildingTileType.Solid, BuildingTileType.Icon],
                        [BuildingTileType.Empty, BuildingTileType.Solid]
                    ],
                    BaseProduction =
                    [
                        new BuildingProduction { Type = BuildingProductionType.People, Value = -5 },
                        new BuildingProduction { Type = BuildingProductionType.Industry, Value = 4 },
                    ]
                },
                new Building
                {
                    SynergyItem = synergyItemMap["Farm"],
                    Type = BuildingType.Extractional,
                    Description = "Sustainable agricultural zone. Essential for maintaining workforce levels. Benefits from adjacency to other farming units.",
                    IconKey = "farm",
                    Cost = 50,
                    Shape =
                    [
                        [BuildingTileType.Empty, BuildingTileType.Icon, BuildingTileType.Solid],
                        [BuildingTileType.Solid, BuildingTileType.Solid, BuildingTileType.Solid]
                    ],
                    BaseProduction =
                    [
                        new BuildingProduction { Type = BuildingProductionType.People, Value = -10 },
                        new BuildingProduction { Type = BuildingProductionType.Industry, Value = 2 },
                    ]
                },
                new Building
                {
                    SynergyItem = synergyItemMap["Factory"],
                    Type = BuildingType.Industrial,
                    Description = "Processing facility for raw materials. Generates significant economic value but emits pollutants. Requires stable power connection.",
                    IconKey = "factory",
                    Cost = 1000,
                    Shape =
                    [
                        [BuildingTileType.Solid, BuildingTileType.Icon, BuildingTileType.Solid, BuildingTileType.Solid]
                    ],
                    BaseProduction =
                    [
                        new BuildingProduction { Type = BuildingProductionType.People, Value = -15 },
                        new BuildingProduction { Type = BuildingProductionType.Industry, Value = -50 },
                        new BuildingProduction { Type = BuildingProductionType.Money, Value = 20 },
                    ]
                },
                new Building
                {
                    SynergyItem = synergyItemMap["House"],
                    Type = BuildingType.Residential,
                    Description = "Standard living quarters for the workforce. Tax revenue scales dynamically with the satisfaction level of tenants.",
                    IconKey = "house",
                    Cost = 100,
                    Shape =
                    [
                        [BuildingTileType.Solid, BuildingTileType.Icon, BuildingTileType.Solid],
                        [BuildingTileType.Empty, BuildingTileType.Solid, BuildingTileType.Empty]
                    ],
                    BaseProduction =
                    [
                        new BuildingProduction { Type = BuildingProductionType.People, Value = 2 },
                        new BuildingProduction { Type = BuildingProductionType.Happiness, Value = -5 },
                    ]
                },
                new Building
                {
                    SynergyItem = synergyItemMap["Park"],
                    Type = BuildingType.Recreational,
                    Description = "Designated recreational area. Counteracts the negative psychological effects of industrialization. Requires daily upkeep.",
                    IconKey = "park",
                    Cost = 500,
                    Shape =
                    [
                        [BuildingTileType.Solid, BuildingTileType.Solid, BuildingTileType.Icon],
                        [BuildingTileType.Empty, BuildingTileType.Empty, BuildingTileType.Solid]
                    ],
                    BaseProduction =
                    [
                        new BuildingProduction { Type = BuildingProductionType.Money, Value = -3 },
                        new BuildingProduction { Type = BuildingProductionType.Happiness, Value = 2 },
                    ]
                },
                new Building
                {
                    SynergyItem = synergyItemMap["Town Hall"],
                    Type = BuildingType.Commercial,
                    Description = "Administrative center of Synergy District. Coordinates city-wide efficiency and provides the initial power grid setup.",
                    IconKey = "townhall",
                    Cost = 0,
                    Shape =
                    [
                        [BuildingTileType.Icon, BuildingTileType.Solid],
                        [BuildingTileType.Solid, BuildingTileType.Solid]
                    ],
                    BaseProduction = 
                    [
                        new BuildingProduction { Type = BuildingProductionType.Energy, Value = 3 },
                        new BuildingProduction { Type = BuildingProductionType.Money, Value = 1}
                    ]
                },
                new Building
                {
                    SynergyItem = synergyItemMap["Market"],
                    Type = BuildingType.Commercial,
                    Description = "Small-scale commercial outlet. Provides goods for local residents. Operational only when placed near populated areas.",
                    IconKey = "shop",
                    Cost = 500,
                    Shape =
                    [
                        [BuildingTileType.Empty, BuildingTileType.Solid, BuildingTileType.Solid],
                        [BuildingTileType.Solid, BuildingTileType.Icon, BuildingTileType.Empty]
                    ],
                    BaseProduction =
                    [

                    ]
                },
            };

            context.Buildings.AddRange(buildings);
            context.SaveChanges();

            var buildingMap = buildings.ToDictionary(b => b.SynergyItem.Name, b => b);

            var synergies = new List<Synergy>
            {
                new Synergy
                {
                    SourceSynergyItem = buildingMap["Lumberjack"].SynergyItem,
                    TargetSynergyItem = buildingMap["House"].SynergyItem,
                    SynergyProductions =
                    [
                        new BuildingProduction { Type = BuildingProductionType.Happiness, Value = -5 }
                    ]
                },
                new Synergy
                {
                    SourceSynergyItem = buildingMap["Mine"].SynergyItem,
                    TargetSynergyItem = buildingMap["House"].SynergyItem,
                    SynergyProductions =
                    [
                        new BuildingProduction { Type = BuildingProductionType.Happiness, Value = -30 }
                    ]
                },
                new Synergy
                {
                    SourceSynergyItem = buildingMap["Factory"].SynergyItem,
                    TargetSynergyItem = buildingMap["House"].SynergyItem,
                    SynergyProductions =
                    [
                        new BuildingProduction { Type = BuildingProductionType.Happiness, Value = -5 }
                    ]
                },
                new Synergy
                {
                    SourceSynergyItem = buildingMap["House"].SynergyItem,
                    TargetSynergyItem = buildingMap["Market"].SynergyItem,
                    SynergyProductions =
                    [
                        new BuildingProduction { Type = BuildingProductionType.Money, Value = 3 },
                        new BuildingProduction { Type = BuildingProductionType.People, Value = -3 }
                    ]
                },
                new Synergy
                {
                    SourceSynergyItem = buildingMap["House"].SynergyItem,
                    TargetSynergyItem = buildingMap["House"].SynergyItem,
                    SynergyProductions =
                    [
                        new BuildingProduction { Type = BuildingProductionType.People, Value = 1 }
                    ]
                },
                new Synergy
                {
                    SourceSynergyItem = synergyItemMap["Forest"],
                    TargetSynergyItem = buildingMap["Lumberjack"].SynergyItem,
                    SynergyProductions =
                    [
                        new BuildingProduction { Type = BuildingProductionType.People, Value = -1 },
                        new BuildingProduction { Type = BuildingProductionType.Industry, Value = 1 }
                    ]
                },
                new Synergy
                {
                    SourceSynergyItem = synergyItemMap["Mountain"],
                    TargetSynergyItem = buildingMap["Mine"].SynergyItem,
                    SynergyProductions =
                    [
                        new BuildingProduction { Type = BuildingProductionType.Energy, Value = -3 },
                        new BuildingProduction { Type = BuildingProductionType.Industry, Value = 15 }
                    ]
                },
                new Synergy
                {
                    SourceSynergyItem = synergyItemMap["Grass"],
                    TargetSynergyItem = buildingMap["Farm"].SynergyItem,
                    SynergyProductions =
                    [
                        new BuildingProduction { Type = BuildingProductionType.People, Value = -1 },
                        new BuildingProduction { Type = BuildingProductionType.Industry, Value = 2 }
                    ]
                },
                new Synergy
                {
                    SourceSynergyItem = synergyItemMap["Park"],
                    TargetSynergyItem = buildingMap["House"].SynergyItem,
                    SynergyProductions =
                    [
                        new BuildingProduction { Type = BuildingProductionType.Happiness, Value = 2 },
                    ]
                },
                new Synergy
                {
                    SourceSynergyItem = synergyItemMap["Market"],
                    TargetSynergyItem = buildingMap["Park"].SynergyItem,
                    SynergyProductions =
                    [
                        new BuildingProduction { Type = BuildingProductionType.Money, Value = -10 },
                        new BuildingProduction { Type = BuildingProductionType.Happiness, Value = 10 },
                    ]
                },
            };

            
            
            foreach (var building in buildings)
            {
                // Park broadcast
                if (building.SynergyItem.Name != "Park")
                {
                    synergies.Add(new Synergy
                    {
                        SourceSynergyItem = buildingMap["Park"].SynergyItem,
                        TargetSynergyItem = building.SynergyItem,
                        SynergyProductions =
                        [
                            new BuildingProduction { Type = BuildingProductionType.Happiness, Value = 10 }
                        ]
                    });
                }
            }

            context.BuildingSynergies.AddRange(synergies);
            context.SaveChanges();
        }
    }
}