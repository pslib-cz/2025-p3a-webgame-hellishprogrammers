using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SynergyDistrict.Server.Migrations
{
    /// <inheritdoc />
    public partial class SynergyModelFix01 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BuildingSynergyBuildingSynergy");

            migrationBuilder.AddColumn<string>(
                name: "ColorHex",
                table: "Buildings",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Cost",
                table: "Buildings",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Buildings",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "IconKey",
                table: "Buildings",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "BuildingSynergyId",
                table: "BuildingProductions",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BuildingProductions_BuildingSynergyId",
                table: "BuildingProductions",
                column: "BuildingSynergyId");

            migrationBuilder.AddForeignKey(
                name: "FK_BuildingProductions_BuildingSynergies_BuildingSynergyId",
                table: "BuildingProductions",
                column: "BuildingSynergyId",
                principalTable: "BuildingSynergies",
                principalColumn: "BuildingSynergyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BuildingProductions_BuildingSynergies_BuildingSynergyId",
                table: "BuildingProductions");

            migrationBuilder.DropIndex(
                name: "IX_BuildingProductions_BuildingSynergyId",
                table: "BuildingProductions");

            migrationBuilder.DropColumn(
                name: "ColorHex",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "Cost",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "IconKey",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "BuildingSynergyId",
                table: "BuildingProductions");

            migrationBuilder.CreateTable(
                name: "BuildingSynergyBuildingSynergy",
                columns: table => new
                {
                    IncomingSynergiesBuildingSynergyId = table.Column<int>(type: "INTEGER", nullable: false),
                    OutgoingSynergiesBuildingSynergyId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuildingSynergyBuildingSynergy", x => new { x.IncomingSynergiesBuildingSynergyId, x.OutgoingSynergiesBuildingSynergyId });
                    table.ForeignKey(
                        name: "FK_BuildingSynergyBuildingSynergy_BuildingSynergies_IncomingSynergiesBuildingSynergyId",
                        column: x => x.IncomingSynergiesBuildingSynergyId,
                        principalTable: "BuildingSynergies",
                        principalColumn: "BuildingSynergyId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BuildingSynergyBuildingSynergy_BuildingSynergies_OutgoingSynergiesBuildingSynergyId",
                        column: x => x.OutgoingSynergiesBuildingSynergyId,
                        principalTable: "BuildingSynergies",
                        principalColumn: "BuildingSynergyId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BuildingSynergyBuildingSynergy_OutgoingSynergiesBuildingSynergyId",
                table: "BuildingSynergyBuildingSynergy",
                column: "OutgoingSynergiesBuildingSynergyId");
        }
    }
}
