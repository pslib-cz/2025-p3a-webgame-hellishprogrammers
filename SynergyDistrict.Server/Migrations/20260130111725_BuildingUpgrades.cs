using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SynergyDistrict.Server.Migrations
{
    /// <inheritdoc />
    public partial class BuildingUpgrades : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BuildingUpgradeId",
                table: "BuildingProductions",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "BuildingUpgrades",
                columns: table => new
                {
                    BuildingUpgradeId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UpgradeCost = table.Column<int>(type: "INTEGER", nullable: false),
                    DeleteCost = table.Column<int>(type: "INTEGER", nullable: false),
                    BuildingId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuildingUpgrades", x => x.BuildingUpgradeId);
                    table.ForeignKey(
                        name: "FK_BuildingUpgrades_Buildings_BuildingId",
                        column: x => x.BuildingId,
                        principalTable: "Buildings",
                        principalColumn: "BuildingId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_BuildingProductions_BuildingUpgradeId",
                table: "BuildingProductions",
                column: "BuildingUpgradeId");

            migrationBuilder.CreateIndex(
                name: "IX_BuildingUpgrades_BuildingId",
                table: "BuildingUpgrades",
                column: "BuildingId");

            migrationBuilder.AddForeignKey(
                name: "FK_BuildingProductions_BuildingUpgrades_BuildingUpgradeId",
                table: "BuildingProductions",
                column: "BuildingUpgradeId",
                principalTable: "BuildingUpgrades",
                principalColumn: "BuildingUpgradeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BuildingProductions_BuildingUpgrades_BuildingUpgradeId",
                table: "BuildingProductions");

            migrationBuilder.DropTable(
                name: "BuildingUpgrades");

            migrationBuilder.DropIndex(
                name: "IX_BuildingProductions_BuildingUpgradeId",
                table: "BuildingProductions");

            migrationBuilder.DropColumn(
                name: "BuildingUpgradeId",
                table: "BuildingProductions");
        }
    }
}
