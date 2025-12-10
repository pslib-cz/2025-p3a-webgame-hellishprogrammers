using Microsoft.EntityFrameworkCore;
using SynergyDistrict.Server.Models.Buildings;

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
        }
    }
}
