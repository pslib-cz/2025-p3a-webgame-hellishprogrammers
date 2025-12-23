using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SynergyDistrict.Server.Migrations
{
    /// <inheritdoc />
    public partial class seeding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Buildings",
                columns: new[] { "BuildingId", "ColorHex", "Cost", "Description", "IconKey", "Name", "ShapeSerialized", "Type" },
                values: new object[,]
                {
                    { 1, "#1982C4", 50, "Automated logging unit. Harvests resources from nearby woodlands. Warning: High decibel output affects residential zones.", "lumberjack", "Lumberjack", "[[1,2,0],[0,1,1]]", 3 },
                    { 2, "#1982C4", 500, "Deep-crust drilling operation. Maximizes raw material output. Causes severe happiness penalty in the immediate vicinity.", "mine", "Mine", "[[1,2],[0,1]]", 3 },
                    { 3, "#1982C4", 200, "Sustainable agricultural zone. Essential for maintaining workforce levels. Benefits from adjacency to other farming units.", "farm", "Farm", "[[0,2,1],[1,1,1]]", 3 },
                    { 4, "#6A4C93", 800, "Processing facility for raw materials. Generates significant economic value but emits pollutants. Requires stable power connection.", "factory", "Factory", "[[1,2,1,1]]", 2 },
                    { 5, "#FFCA3A", 100, "Standard living quarters for the workforce. Tax revenue scales dynamically with the satisfaction level of tenants.", "house", "House", "[[1,2,1],[0,1,0]]", 0 },
                    { 6, "#8AC926", 300, "Designated recreational area. Counteracts the negative psychological effects of industrialization. Requires daily upkeep.", "park", "Park", "[[1,1,2],[0,0,1]]", 4 },
                    { 7, "#FF595E", 0, "Administrative center of Synergy District. Coordinates city-wide efficiency and provides the initial power grid setup.", "townhall", "Town Hall", "[[2,1],[1,1]]", 1 },
                    { 8, "#FF595E", 150, "Small-scale commercial outlet. Provides goods for local residents. Operational only when placed near populated areas.", "shop", "Market", "[[0,1,1],[1,2,0]]", 1 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Buildings",
                keyColumn: "BuildingId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Buildings",
                keyColumn: "BuildingId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Buildings",
                keyColumn: "BuildingId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Buildings",
                keyColumn: "BuildingId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Buildings",
                keyColumn: "BuildingId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Buildings",
                keyColumn: "BuildingId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Buildings",
                keyColumn: "BuildingId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Buildings",
                keyColumn: "BuildingId",
                keyValue: 8);
        }
    }
}
