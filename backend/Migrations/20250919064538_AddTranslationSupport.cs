using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebOnlyAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddTranslationSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DescriptionAz",
                table: "EquipmentTags",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionRu",
                table: "EquipmentTags",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameAz",
                table: "EquipmentTags",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameRu",
                table: "EquipmentTags",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionAz",
                table: "EquipmentCategories",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionRu",
                table: "EquipmentCategories",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameAz",
                table: "EquipmentCategories",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameRu",
                table: "EquipmentCategories",
                type: "TEXT",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DescriptionAz",
                table: "EquipmentTags");

            migrationBuilder.DropColumn(
                name: "DescriptionRu",
                table: "EquipmentTags");

            migrationBuilder.DropColumn(
                name: "NameAz",
                table: "EquipmentTags");

            migrationBuilder.DropColumn(
                name: "NameRu",
                table: "EquipmentTags");

            migrationBuilder.DropColumn(
                name: "DescriptionAz",
                table: "EquipmentCategories");

            migrationBuilder.DropColumn(
                name: "DescriptionRu",
                table: "EquipmentCategories");

            migrationBuilder.DropColumn(
                name: "NameAz",
                table: "EquipmentCategories");

            migrationBuilder.DropColumn(
                name: "NameRu",
                table: "EquipmentCategories");
        }
    }
}
