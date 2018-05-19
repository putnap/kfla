﻿// <auto-generated />
using KFLA.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using System;

namespace KFLA.Data.Migrations
{
    [DbContext(typeof(KFLADBContext))]
    partial class KFLADBContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.2-rtm-10011")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("KFLA.Data.Models.Cluster", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("ID");

                    b.ToTable("Clusters");
                });

            modelBuilder.Entity("KFLA.Data.Models.Competency", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("ClusterID");

                    b.Property<string>("Description");

                    b.Property<int?>("FactorID");

                    b.Property<string>("LessSkilled");

                    b.Property<string>("Name");

                    b.Property<string>("OverusedSkill");

                    b.Property<string>("Skilled");

                    b.Property<string>("Talented");

                    b.HasKey("ID");

                    b.HasIndex("ClusterID");

                    b.HasIndex("FactorID");

                    b.ToTable("Competencies");
                });

            modelBuilder.Entity("KFLA.Data.Models.Factor", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("ID");

                    b.ToTable("Factors");
                });

            modelBuilder.Entity("KFLA.Data.Models.Question", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CompetencyID");

                    b.Property<string>("QuestionContent");

                    b.HasKey("ID");

                    b.HasIndex("CompetencyID");

                    b.ToTable("Questions");
                });

            modelBuilder.Entity("KFLA.Data.Models.Competency", b =>
                {
                    b.HasOne("KFLA.Data.Models.Cluster", "Cluster")
                        .WithMany()
                        .HasForeignKey("ClusterID");

                    b.HasOne("KFLA.Data.Models.Factor", "Factor")
                        .WithMany()
                        .HasForeignKey("FactorID");
                });

            modelBuilder.Entity("KFLA.Data.Models.Question", b =>
                {
                    b.HasOne("KFLA.Data.Models.Competency")
                        .WithMany("Questions")
                        .HasForeignKey("CompetencyID")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
