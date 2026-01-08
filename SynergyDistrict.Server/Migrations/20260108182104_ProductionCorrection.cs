using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SynergyDistrict.Server.Migrations
{
    /// <inheritdoc />
    public partial class ProductionCorrection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BuildingProductions_Buildings_BuildingId",
                table: "BuildingProductions");

            migrationBuilder.AlterColumn<int>(
                name: "BuildingId",
                table: "BuildingProductions",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_BuildingProductions_Buildings_BuildingId",
                table: "BuildingProductions",
                column: "BuildingId",
                principalTable: "Buildings",
                principalColumn: "BuildingId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BuildingProductions_Buildings_BuildingId",
                table: "BuildingProductions");

            migrationBuilder.AlterColumn<int>(
                name: "BuildingId",
                table: "BuildingProductions",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_BuildingProductions_Buildings_BuildingId",
                table: "BuildingProductions",
                column: "BuildingId",
                principalTable: "Buildings",
                principalColumn: "BuildingId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
