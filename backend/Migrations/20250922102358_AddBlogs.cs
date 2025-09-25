using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebOnlyAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddBlogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Blogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title1 = table.Column<string>(type: "TEXT", nullable: false),
                    Desc1 = table.Column<string>(type: "TEXT", nullable: true),
                    Title2 = table.Column<string>(type: "TEXT", nullable: true),
                    Desc2 = table.Column<string>(type: "TEXT", nullable: true),
                    Features = table.Column<string>(type: "TEXT", nullable: true),
                    Title3 = table.Column<string>(type: "TEXT", nullable: true),
                    Desc3 = table.Column<string>(type: "TEXT", nullable: true),
                    MainImageUrl = table.Column<string>(type: "TEXT", nullable: true),
                    DetailImg1Url = table.Column<string>(type: "TEXT", nullable: true),
                    DetailImg2Url = table.Column<string>(type: "TEXT", nullable: true),
                    DetailImg3Url = table.Column<string>(type: "TEXT", nullable: true),
                    DetailImg4Url = table.Column<string>(type: "TEXT", nullable: true),
                    PublishedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Blogs", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Blogs");
        }
    }
}
