using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SynergyDistrict.Server.Migrations
{
    /// <inheritdoc />
    public partial class HydroPlant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BuildingUpgradeId",
                table: "BuildingSynergies",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BuildingSynergies_BuildingUpgradeId",
                table: "BuildingSynergies",
                column: "BuildingUpgradeId");

            migrationBuilder.AddForeignKey(
                name: "FK_BuildingSynergies_BuildingUpgrades_BuildingUpgradeId",
                table: "BuildingSynergies",
                column: "BuildingUpgradeId",
                principalTable: "BuildingUpgrades",
                principalColumn: "BuildingUpgradeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BuildingSynergies_BuildingUpgrades_BuildingUpgradeId",
                table: "BuildingSynergies");

            migrationBuilder.DropIndex(
                name: "IX_BuildingSynergies_BuildingUpgradeId",
                table: "BuildingSynergies");

            migrationBuilder.DropColumn(
                name: "BuildingUpgradeId",
                table: "BuildingSynergies");
        }
    }
}
