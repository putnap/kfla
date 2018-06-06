using KFLA.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KFLA.Data
{
    public class KFLADBContext : DbContext
    {
        public KFLADBContext(DbContextOptions<KFLADBContext> options) : base(options)
        {
        }

        public DbSet<Competency> Competencies { get; set; }
        public DbSet<Cluster> Clusters { get; set; }
        public DbSet<Factor> Factors { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Stopper> Stoppers { get; set; }
        public DbSet<StopperType> StopperTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Competency>().HasKey(o => o.ID);
            builder.Entity<Cluster>().HasKey(o => o.ID);
            builder.Entity<Factor>().HasKey(o => o.ID);
            builder.Entity<Question>().HasKey(o => o.ID);
            builder.Entity<Stopper>().HasKey(o => o.ID);
            builder.Entity<StopperType>().HasKey(o => o.ID);
        }
    }
}
