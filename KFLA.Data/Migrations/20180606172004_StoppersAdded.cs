using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace KFLA.Data.Migrations
{
    public partial class StoppersAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StopperTypes",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StopperTypes", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Stoppers",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true),
                    NotProblem = table.Column<string>(nullable: true),
                    Problem = table.Column<string>(nullable: true),
                    StopperTypeID = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stoppers", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Stoppers_StopperTypes_StopperTypeID",
                        column: x => x.StopperTypeID,
                        principalTable: "StopperTypes",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Stoppers_StopperTypeID",
                table: "Stoppers",
                column: "StopperTypeID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Stoppers");

            migrationBuilder.DropTable(
                name: "StopperTypes");
        }
    }
}
