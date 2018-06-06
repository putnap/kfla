using KFLA.Contract;
using KFLA.Contract.Repositories;
using KFLA.Data.Models;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using OfficeOpenXml.Table;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;

namespace KFLA.Data.Repositories
{
    public class CompetenciesRepository : ICompetenciesRepository
    {
        private readonly KFLADBContext dbContext;

        static CompetenciesRepository()
        {
            AutoMapper.Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Competency, CompetencyDto>();
                cfg.CreateMap<Question, QuestionDto>();
                cfg.CreateMap<Factor, FactorDto>();
                cfg.CreateMap<Cluster, ClusterDto>();
                cfg.CreateMap<Stopper, StopperDto>();
                cfg.CreateMap<StopperType, StopperTypeDto>();
            });
        }

        public CompetenciesRepository(KFLADBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public List<CompetencyDto> GetCompetencies()
        {
            return dbContext.Competencies
                .Include(o => o.Cluster)
                .Include(o => o.Factor)
                .Include(o => o.Questions)
                .Select(o => AutoMapper.Mapper.Map<CompetencyDto>(o))
                .ToList();
        }

        public List<StopperDto> GetStoppers()
        {
            return dbContext.Stoppers
                .Include(o => o.StopperType)
                .Select(o => AutoMapper.Mapper.Map<StopperDto>(o))
                .ToList();
        }

        public void RefreshExcel()
        {
            dbContext.Questions.RemoveRange(dbContext.Questions);
            dbContext.Competencies.RemoveRange(dbContext.Competencies);
            dbContext.Clusters.RemoveRange(dbContext.Clusters);
            dbContext.Factors.RemoveRange(dbContext.Factors);
            dbContext.StopperTypes.RemoveRange(dbContext.StopperTypes);
            dbContext.Stoppers.RemoveRange(dbContext.Stoppers);

            dbContext.SaveChanges();
            try
            {
                dbContext.Database.OpenConnection();
                using (var pck = new ExcelPackage())
                {
                    using (var stream = File.OpenRead(@".\data.xlsx"))
                        pck.Load(stream);

                    dbContext.Database.ExecuteSqlCommand("SET IDENTITY_INSERT dbo.Competencies ON;");
                    dbContext.Competencies.AddRange(GetCompetencies(pck.Workbook.Worksheets[1]));
                    dbContext.SaveChanges();
                    dbContext.Database.ExecuteSqlCommand("SET IDENTITY_INSERT dbo.Competencies OFF;");

                    dbContext.Database.ExecuteSqlCommand("SET IDENTITY_INSERT dbo.Stoppers ON;");
                    dbContext.Stoppers.AddRange(GetStoppers(pck.Workbook.Worksheets[2]));
                    dbContext.SaveChanges();
                    dbContext.Database.ExecuteSqlCommand("SET IDENTITY_INSERT dbo.Stoppers OFF;");
                }
            }
            finally
            {
                dbContext.Database.CloseConnection();
            }
        }

        private static IEnumerable<Stopper> GetStoppers(ExcelWorksheet ws, bool hasHeader = true)
        {
            var tbl = new DataTable();
            foreach (var firstRowCell in ws.Cells[1, 1, 1, ws.Dimension.End.Column])
            {
                tbl.Columns.Add(hasHeader ? firstRowCell.Text : string.Format("Column {0}", firstRowCell.Start.Column));
            }
            var startRow = hasHeader ? 2 : 1;
            for (int rowNum = startRow; rowNum <= ws.Dimension.End.Row; rowNum++)
            {
                var wsRow = ws.Cells[rowNum, 1, rowNum, ws.Dimension.End.Column];
                var row = tbl.Rows.Add();
                foreach (var cell in wsRow)
                {
                    row[cell.Start.Column - 1] = cell.Text;
                }
            }

            var stopperTypes = new List<StopperType>();
            foreach (DataRow row in tbl.Rows)
            {
                var stopperType = stopperTypes.FirstOrDefault(o => o.Name == (string)row[2]);
                if (stopperType == null)
                {
                    stopperType = new StopperType() { Name = (string)row[2] };
                    stopperTypes.Add(stopperType);
                }

                var stopper = new Stopper()
                {
                    ID = int.Parse((string)row[0]),
                    Name = (string)row[1],
                    Problem = (string)row[3],
                    NotProblem = (string)row[4],
                    StopperType = stopperType,
                };

                yield return stopper;
            }
        }

        private static IEnumerable<Competency> GetCompetencies(ExcelWorksheet ws, bool hasHeader = true)
        {
            var tbl = new DataTable();
            foreach (var firstRowCell in ws.Cells[1, 1, 1, ws.Dimension.End.Column])
            {
                tbl.Columns.Add(hasHeader ? firstRowCell.Text : string.Format("Column {0}", firstRowCell.Start.Column));
            }
            var startRow = hasHeader ? 2 : 1;
            for (int rowNum = startRow; rowNum <= ws.Dimension.End.Row; rowNum++)
            {
                var wsRow = ws.Cells[rowNum, 1, rowNum, ws.Dimension.End.Column];
                var row = tbl.Rows.Add();
                foreach (var cell in wsRow)
                {
                    row[cell.Start.Column - 1] = cell.Text;
                }
            }

            var clusters = new List<Cluster>();
            var factors = new List<Factor>();
            foreach (DataRow row in tbl.Rows)
            {
                var cluster = clusters.FirstOrDefault(o => o.Name == (string)row[4]);
                if (cluster == null)
                {
                    cluster = new Cluster() { Name = (string)row[4] };
                    clusters.Add(cluster);
                }
                var factor = factors.FirstOrDefault(o => o.Name == (string)row[3]);
                if (factor == null)
                {
                    factor = new Factor() { Name = (string)row[3] };
                    factors.Add(factor);
                }

                var competency = new Competency()
                {
                    ID = int.Parse((string)row[0]),
                    Name = (string)row[1],
                    Description = (string)row[2],
                    LessSkilled = (string)row[5],
                    Skilled = (string)row[6],
                    Talented = (string)row[7],
                    OverusedSkill = (string)row[8],
                    Factor = factor,
                    Cluster = cluster,
                    Questions = new List<Question>()
                };

                for (int i = 9; i < row.ItemArray.Count(); i++)
                {
                    if (row[i] is string value && !string.IsNullOrEmpty(value))
                        competency.Questions.Add(new Question() { QuestionContent = value });
                    else
                        break;
                }

                yield return competency;
            }
        }


        private static IEnumerable<Competency> GetCompetencies(string path, bool hasHeader = true)
        {
            using (var pck = new ExcelPackage())
            {
                using (var stream = File.OpenRead(path))
                    pck.Load(stream);

                var ws = pck.Workbook.Worksheets.First();
                var tbl = new DataTable();
                foreach (var firstRowCell in ws.Cells[1, 1, 1, ws.Dimension.End.Column])
                {
                    tbl.Columns.Add(hasHeader ? firstRowCell.Text : string.Format("Column {0}", firstRowCell.Start.Column));
                }
                var startRow = hasHeader ? 2 : 1;
                for (int rowNum = startRow; rowNum <= ws.Dimension.End.Row; rowNum++)
                {
                    var wsRow = ws.Cells[rowNum, 1, rowNum, ws.Dimension.End.Column];
                    var row = tbl.Rows.Add();
                    foreach (var cell in wsRow)
                    {
                        row[cell.Start.Column - 1] = cell.Text;
                    }
                }

                var clusters = new List<Cluster>();
                var factors = new List<Factor>();
                foreach (DataRow row in tbl.Rows)
                {
                    var cluster = clusters.FirstOrDefault(o => o.Name == (string)row[4]);
                    if (cluster == null)
                    {
                        cluster = new Cluster() { Name = (string)row[4] };
                        clusters.Add(cluster);
                    }
                    var factor = factors.FirstOrDefault(o => o.Name == (string)row[3]);
                    if (factor == null)
                    {
                        factor = new Factor() { Name = (string)row[3] };
                        factors.Add(factor);
                    }

                    var competency = new Competency()
                    {
                        ID = int.Parse((string)row[0]),
                        Name = (string)row[1],
                        Description = (string)row[2],
                        LessSkilled = (string)row[5],
                        Skilled = (string)row[6],
                        Talented = (string)row[7],
                        OverusedSkill = (string)row[8],
                        Factor = factor,
                        Cluster = cluster,
                        Questions = new List<Question>()
                    };

                    for (int i = 9; i < row.ItemArray.Count(); i++)
                    {
                        if (row[i] is string value && !string.IsNullOrEmpty(value))
                            competency.Questions.Add(new Question() { QuestionContent = value });
                        else
                            break;
                    }

                    yield return competency;
                }
            }
        }
    }
}
