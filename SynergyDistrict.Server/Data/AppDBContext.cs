using Microsoft.EntityFrameworkCore;
using SynergyDistrict.Server.Models.Buildings;
using System.Text.Json;

namespace SynergyDistrict.Server.Data
{
    public class AppDBContext: DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
        {
        }

        public DbSet<Building> Buildings { get; set; }
        public DbSet<BuildingProduction> BuildingProductions { get; set; }
        public DbSet<BuildingSynergy> BuildingSynergies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BuildingSynergy>()
                .HasOne(bs => bs.TargetBuilding)
                .WithMany(b => b.IncomingSynergies)
                .HasForeignKey(bs => bs.TargetBuildingId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BuildingSynergy>()
                .HasOne(bs => bs.SourceBuilding)
                .WithMany(b => b.OutgoingSynergies)
                .HasForeignKey(bs => bs.SourceBuildingId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Building>().HasData(
                new Building
                {
                    BuildingId = 1,
                    Name = "Lumberjack",
                    Type = BuildingType.Extractional,
                    Description = "Automated logging unit. Harvests resources from nearby woodlands. Warning: High decibel output affects residential zones.",
                    ColorHex = "#1982C4",
                    IconKey = "lumberjack",
                    Cost = 50,
                    Shape =
                    [
                        [BuildingTileType.Solid, BuildingTileType.Icon, BuildingTileType.Empty],
                        [BuildingTileType.Empty, BuildingTileType.Solid, BuildingTileType.Solid]
                    ]
                },
                new Building
                {
                    BuildingId = 2,
                    Name = "Mine",
                    Type = BuildingType.Extractional,
                    Description = "Deep-crust drilling operation. Maximizes raw material output. Causes severe happiness penalty in the immediate vicinity.",
                    ColorHex = "#1982C4",
                    IconKey = "mine",
                    Cost = 500,
                    Shape =
                    [
                        [BuildingTileType.Solid, BuildingTileType.Icon],
                        [BuildingTileType.Empty, BuildingTileType.Solid]
                    ]
                },
                new Building
                {
                    BuildingId = 3,
                    Name = "Farm",
                    Type = BuildingType.Extractional,
                    Description = "Sustainable agricultural zone. Essential for maintaining workforce levels. Benefits from adjacency to other farming units.",
                    ColorHex = "#1982C4",
                    IconKey = "farm",
                    Cost = 200,
                    Shape =
                    [
                        [BuildingTileType.Empty, BuildingTileType.Icon, BuildingTileType.Solid],
                        [BuildingTileType.Solid, BuildingTileType.Solid, BuildingTileType.Solid]
                    ]
                },
                new Building
                {
                    BuildingId = 4,
                    Name = "Factory",
                    Type = BuildingType.Industrial,
                    Description = "Processing facility for raw materials. Generates significant economic value but emits pollutants. Requires stable power connection.",
                    ColorHex = "#6A4C93",
                    IconKey = "factory",
                    Cost = 800,
                    Shape =
                    [
                        [BuildingTileType.Solid, BuildingTileType.Icon, BuildingTileType.Solid, BuildingTileType.Solid]
                    ]
                },
                new Building
                {
                    BuildingId = 5,
                    Name = "House",
                    Type = BuildingType.Residential,
                    Description = "Standard living quarters for the workforce. Tax revenue scales dynamically with the satisfaction level of tenants.",
                    ColorHex = "#FFCA3A",
                    IconKey = "house",
                    Cost = 100,
                    Shape =
                    [
                        [BuildingTileType.Solid, BuildingTileType.Icon, BuildingTileType.Solid],
                        [BuildingTileType.Empty, BuildingTileType.Solid, BuildingTileType.Empty]
                    ]
                },
                new Building
                {
                    BuildingId = 6,
                    Name = "Park",
                    Type = BuildingType.Recreational,
                    Description = "Designated recreational area. Counteracts the negative psychological effects of industrialization. Requires daily upkeep.",
                    ColorHex = "#8AC926",
                    IconKey = "park",
                    Cost = 300,
                    Shape =
                    [
                        [BuildingTileType.Solid, BuildingTileType.Solid, BuildingTileType.Icon],
                        [BuildingTileType.Empty, BuildingTileType.Empty, BuildingTileType.Solid]
                    ]
                },
                new Building
                {
                    BuildingId = 7,
                    Name = "Town Hall",
                    Type = BuildingType.Commercial,
                    Description = "Administrative center of Synergy District. Coordinates city-wide efficiency and provides the initial power grid setup.",
                    ColorHex = "#FF595E",
                    IconKey = "townhall",
                    Cost = 0,
                    Shape =
                    [
                        [BuildingTileType.Icon, BuildingTileType.Solid],
                        [BuildingTileType.Solid, BuildingTileType.Solid]
                    ]
                },
                new Building
                {
                    BuildingId = 8,
                    Name = "Market",
                    Type = BuildingType.Commercial,
                    Description = "Small-scale commercial outlet. Provides goods for local residents. Operational only when placed near populated areas.",
                    ColorHex = "#FF595E",
                    IconKey = "shop",
                    Cost = 150,
                    Shape =
                    [
                        [BuildingTileType.Empty, BuildingTileType.Solid, BuildingTileType.Solid],
                        [BuildingTileType.Solid, BuildingTileType.Icon, BuildingTileType.Empty]
                    ]
                }
            );
        }
    }
}
