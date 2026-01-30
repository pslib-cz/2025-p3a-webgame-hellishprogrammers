using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SynergyDistrict.Server.Migrations
{
    /// <inheritdoc />
    public partial class sdgsdgsdg : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "UpgradeCost",
                table: "BuildingUpgrades",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "UpgradeCost",
                table: "BuildingUpgrades",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);
        }
    }
}
