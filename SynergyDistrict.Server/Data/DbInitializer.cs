using SynergyDistrict.Server.Models.Buildings;

namespace SynergyDistrict.Server.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDBContext context)
        {
            context.Database.EnsureCreated();

            if (context.Buildings.Any())
            {
                return;
            }

            var buildings = new Building[]
            {
                new Building
                {
                    Name = "Lumberjack",
                    Type = BuildingType.Extractional,
                    Description = "Automated logging unit. Harvests resources from nearby woodlands. Warning: High decibel output affects residential zones.",
                    IconKey = "lumberjack",
                    Cost = 50,
                    Shape =
                    [
                        [BuildingTileType.Solid, BuildingTileType.Icon, BuildingTileType.Empty],
                        [BuildingTileType.Empty, BuildingTileType.Solid, BuildingTileType.Solid]
                    ],
                    BaseProduction = 
                    [
                        new BuildingProduction { Type = BuildingProductionType.People, Value = -1 },
                        new BuildingProduction { Type = BuildingProductionType.Industry, Value = 2 },
                    ]
                },
                new Building
                {
                    Name = "Mine",
                    Type = BuildingType.Extractional,
                    Description = "Deep-crust drilling operation. Maximizes raw material output. Causes severe happiness penalty in the immediate vicinity.",
                    IconKey = "mine",
                    Cost = 500,
                    Shape =
                    [
                        [BuildingTileType.Solid, BuildingTileType.Icon],
                        [BuildingTileType.Empty, BuildingTileType.Solid]
                    ],
                    BaseProduction =
                    [
                        new BuildingProduction { Type = BuildingProductionType.People, Value = -2 },
                        new BuildingProduction { Type = BuildingProductionType.Industry, Value = 4 },
                        new BuildingProduction { Type = BuildingProductionType.Energy, Value = -2 },
                    ]
                },
                new Building
                {
                    Name = "Farm",
                    Type = BuildingType.Extractional,
                    Description = "Sustainable agricultural zone. Essential for maintaining workforce levels. Benefits from adjacency to other farming units.",
                    IconKey = "farm",
                    Cost = 200,
                    Shape =
                    [
                        [BuildingTileType.Empty, BuildingTileType.Icon, BuildingTileType.Solid],
                        [BuildingTileType.Solid, BuildingTileType.Solid, BuildingTileType.Solid]
                    ],
                    BaseProduction =
                    [
                        new BuildingProduction { Type = BuildingProductionType.People, Value = -2 },
                        new BuildingProduction { Type = BuildingProductionType.Money, Value = 2 },
                    ]
                },
                new Building
                {
                    Name = "Factory",
                    Type = BuildingType.Industrial,
                    Description = "Processing facility for raw materials. Generates significant economic value but emits pollutants. Requires stable power connection.",
                    IconKey = "factory",
                    Cost = 800,
                    Shape =
                    [
                        [BuildingTileType.Solid, BuildingTileType.Icon, BuildingTileType.Solid, BuildingTileType.Solid]
                    ],
                    BaseProduction =
                    [
                        new BuildingProduction { Type = BuildingProductionType.People, Value = -3 },
                        new BuildingProduction { Type = BuildingProductionType.Energy, Value = -3 },
                        new BuildingProduction { Type = BuildingProductionType.Industry, Value = 5 },
                        new BuildingProduction { Type = BuildingProductionType.Money, Value = 5 },
                    ]
                },
                new Building
                {
                    Name = "House",
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
                        new BuildingProduction { Type = BuildingProductionType.People, Value = 5 },
                        new BuildingProduction { Type = BuildingProductionType.Energy, Value = -1 },
                        new BuildingProduction { Type = BuildingProductionType.Money, Value = 3 },
                    ]
                },
                new Building
                {
                    Name = "Park",
                    Type = BuildingType.Recreational,
                    Description = "Designated recreational area. Counteracts the negative psychological effects of industrialization. Requires daily upkeep.",
                    IconKey = "park",
                    Cost = 300,
                    Shape =
                    [
                        [BuildingTileType.Solid, BuildingTileType.Solid, BuildingTileType.Icon],
                        [BuildingTileType.Empty, BuildingTileType.Empty, BuildingTileType.Solid]
                    ],
                    BaseProduction =
                    [
                        new BuildingProduction { Type = BuildingProductionType.Money, Value = -2 },
                    ]
                },
                new Building
                {
                    Name = "Town Hall",
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
                        new BuildingProduction { Type = BuildingProductionType.Energy, Value = 10 },
                        new BuildingProduction { Type = BuildingProductionType.Happiness, Value = 20 },
                    ]
                },
                new Building
                {
                    Name = "Market",
                    Type = BuildingType.Commercial,
                    Description = "Small-scale commercial outlet. Provides goods for local residents. Operational only when placed near populated areas.",
                    IconKey = "shop",
                    Cost = 150,
                    Shape =
                    [
                        [BuildingTileType.Empty, BuildingTileType.Solid, BuildingTileType.Solid],
                        [BuildingTileType.Solid, BuildingTileType.Icon, BuildingTileType.Empty]
                    ],
                    BaseProduction =
                    [
                        new BuildingProduction { Type = BuildingProductionType.People, Value = -3 },
                        new BuildingProduction { Type = BuildingProductionType.Money, Value = 3 },
                    ]
                }
            };

            context.Buildings.AddRange(buildings);
            context.SaveChanges();

            var buildingMap = buildings.ToDictionary(b => b.Name, b => b);

            var synergies = new BuildingSynergy[]
            {
                new BuildingSynergy
                {
                    SourceBuilding = buildingMap["Lumberjack"],
                    TargetBuilding = buildingMap["Lumberjack"],
                    SynergyProductions =
                    [
                        new BuildingProduction { Type = BuildingProductionType.Industry, Value = 1 }
                    ]
                },
                new BuildingSynergy
                {
                    SourceBuilding = buildingMap["Lumberjack"],
                    TargetBuilding = buildingMap["House"],
                    SynergyProductions =
                    [
                        new BuildingProduction { Type = BuildingProductionType.Happiness, Value = -5 }
                    ]
                },
            };

            context.BuildingSynergies.AddRange(synergies);
            context.SaveChanges();
        }
    }
}