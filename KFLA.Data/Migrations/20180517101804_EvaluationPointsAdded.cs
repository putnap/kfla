using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace KFLA.Data.Migrations
{
    public partial class EvaluationPointsAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LessSkilled",
                table: "Competencies",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OverusedSkill",
                table: "Competencies",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Skilled",
                table: "Competencies",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Talented",
                table: "Competencies",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LessSkilled",
                table: "Competencies");

            migrationBuilder.DropColumn(
                name: "OverusedSkill",
                table: "Competencies");

            migrationBuilder.DropColumn(
                name: "Skilled",
                table: "Competencies");

            migrationBuilder.DropColumn(
                name: "Talented",
                table: "Competencies");
        }
    }
}
