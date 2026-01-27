using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SynergyDistrict.Server.Migrations
{
    /// <inheritdoc />
    public partial class NaturalFeaturesImplementaion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BuildingSynergies_Buildings_SourceBuildingId",
                table: "BuildingSynergies");

            migrationBuilder.DropForeignKey(
                name: "FK_BuildingSynergies_Buildings_TargetBuildingId",
                table: "BuildingSynergies");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Buildings");

            migrationBuilder.RenameColumn(
                name: "TargetBuildingId",
                table: "BuildingSynergies",
                newName: "TargetSynergyItemId");

            migrationBuilder.RenameColumn(
                name: "SourceBuildingId",
                table: "BuildingSynergies",
                newName: "SourceSynergyItemId");

            migrationBuilder.RenameColumn(
                name: "BuildingSynergyId",
                table: "BuildingSynergies",
                newName: "SynergyId");

            migrationBuilder.RenameIndex(
                name: "IX_BuildingSynergies_TargetBuildingId",
                table: "BuildingSynergies",
                newName: "IX_BuildingSynergies_TargetSynergyItemId");

            migrationBuilder.RenameIndex(
                name: "IX_BuildingSynergies_SourceBuildingId",
                table: "BuildingSynergies",
                newName: "IX_BuildingSynergies_SourceSynergyItemId");

            migrationBuilder.AddColumn<int>(
                name: "SynergyItemId",
                table: "Buildings",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "SynergyItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SynergyItems", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_SynergyItemId",
                table: "Buildings",
                column: "SynergyItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Buildings_SynergyItems_SynergyItemId",
                table: "Buildings",
                column: "SynergyItemId",
                principalTable: "SynergyItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BuildingSynergies_SynergyItems_SourceSynergyItemId",
                table: "BuildingSynergies",
                column: "SourceSynergyItemId",
                principalTable: "SynergyItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BuildingSynergies_SynergyItems_TargetSynergyItemId",
                table: "BuildingSynergies",
                column: "TargetSynergyItemId",
                principalTable: "SynergyItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Buildings_SynergyItems_SynergyItemId",
                table: "Buildings");

            migrationBuilder.DropForeignKey(
                name: "FK_BuildingSynergies_SynergyItems_SourceSynergyItemId",
                table: "BuildingSynergies");

            migrationBuilder.DropForeignKey(
                name: "FK_BuildingSynergies_SynergyItems_TargetSynergyItemId",
                table: "BuildingSynergies");

            migrationBuilder.DropTable(
                name: "SynergyItems");

            migrationBuilder.DropIndex(
                name: "IX_Buildings_SynergyItemId",
                table: "Buildings");

            migrationBuilder.DropColumn(
                name: "SynergyItemId",
                table: "Buildings");

            migrationBuilder.RenameColumn(
                name: "TargetSynergyItemId",
                table: "BuildingSynergies",
                newName: "TargetBuildingId");

            migrationBuilder.RenameColumn(
                name: "SourceSynergyItemId",
                table: "BuildingSynergies",
                newName: "SourceBuildingId");

            migrationBuilder.RenameColumn(
                name: "SynergyId",
                table: "BuildingSynergies",
                newName: "BuildingSynergyId");

            migrationBuilder.RenameIndex(
                name: "IX_BuildingSynergies_TargetSynergyItemId",
                table: "BuildingSynergies",
                newName: "IX_BuildingSynergies_TargetBuildingId");

            migrationBuilder.RenameIndex(
                name: "IX_BuildingSynergies_SourceSynergyItemId",
                table: "BuildingSynergies",
                newName: "IX_BuildingSynergies_SourceBuildingId");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Buildings",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_BuildingSynergies_Buildings_SourceBuildingId",
                table: "BuildingSynergies",
                column: "SourceBuildingId",
                principalTable: "Buildings",
                principalColumn: "BuildingId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_BuildingSynergies_Buildings_TargetBuildingId",
                table: "BuildingSynergies",
                column: "TargetBuildingId",
                principalTable: "Buildings",
                principalColumn: "BuildingId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
