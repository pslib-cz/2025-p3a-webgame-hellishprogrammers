using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SynergyDistrict.Server.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Buildings",
                columns: table => new
                {
                    BuildingId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Type = table.Column<int>(type: "INTEGER", nullable: false),
                    ShapeSerialized = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Buildings", x => x.BuildingId);
                });

            migrationBuilder.CreateTable(
                name: "BuildingProductions",
                columns: table => new
                {
                    BuildingProductionId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Value = table.Column<int>(type: "INTEGER", nullable: false),
                    Type = table.Column<int>(type: "INTEGER", nullable: false),
                    BuildingId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuildingProductions", x => x.BuildingProductionId);
                    table.ForeignKey(
                        name: "FK_BuildingProductions_Buildings_BuildingId",
                        column: x => x.BuildingId,
                        principalTable: "Buildings",
                        principalColumn: "BuildingId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BuildingSynergies",
                columns: table => new
                {
                    BuildingSynergyId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TargetBuildingId = table.Column<int>(type: "INTEGER", nullable: false),
                    SourceBuildingId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuildingSynergies", x => x.BuildingSynergyId);
                    table.ForeignKey(
                        name: "FK_BuildingSynergies_Buildings_SourceBuildingId",
                        column: x => x.SourceBuildingId,
                        principalTable: "Buildings",
                        principalColumn: "BuildingId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BuildingSynergies_Buildings_TargetBuildingId",
                        column: x => x.TargetBuildingId,
                        principalTable: "Buildings",
                        principalColumn: "BuildingId",
                        onDelete: ReferentialAction.Restrict);
                });

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
                name: "IX_BuildingProductions_BuildingId",
                table: "BuildingProductions",
                column: "BuildingId");

            migrationBuilder.CreateIndex(
                name: "IX_BuildingSynergies_SourceBuildingId",
                table: "BuildingSynergies",
                column: "SourceBuildingId");

            migrationBuilder.CreateIndex(
                name: "IX_BuildingSynergies_TargetBuildingId",
                table: "BuildingSynergies",
                column: "TargetBuildingId");

            migrationBuilder.CreateIndex(
                name: "IX_BuildingSynergyBuildingSynergy_OutgoingSynergiesBuildingSynergyId",
                table: "BuildingSynergyBuildingSynergy",
                column: "OutgoingSynergiesBuildingSynergyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BuildingProductions");

            migrationBuilder.DropTable(
                name: "BuildingSynergyBuildingSynergy");

            migrationBuilder.DropTable(
                name: "BuildingSynergies");

            migrationBuilder.DropTable(
                name: "Buildings");
        }
    }
}
