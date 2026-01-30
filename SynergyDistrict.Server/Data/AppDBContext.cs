using Microsoft.EntityFrameworkCore;
using SynergyDistrict.Server.Models;
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
        public DbSet<BuildingUpgrade> BuildingUpgrades { get; set; }
        public DbSet<Synergy> BuildingSynergies { get; set; }

        public DbSet<SynergyItem> SynergyItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

        }
    }
}
