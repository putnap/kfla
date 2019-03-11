using KFLA.Contract;
using KFLA.Contract.Services;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace KFLA.Services.Services
{
    public class CompetenciesService : ICompetenciesService
    {
        private readonly Regex dataFileRegex = new Regex(@".+data\.(?'lang'[a-z]{2,3})\.xlsx");

        public List<CompetencyDto> GetCompetencies(string language)
        {
            using (var pck = new ExcelPackage())
            {
                using (var stream = GetDataStream(language))
                {
                    pck.Load(stream);
                }

                return GetCompetencies(pck.Workbook.Worksheets[1]).ToList();
            }
        }

        public List<StopperDto> GetStoppers(string language)
        {
            using (var pck = new ExcelPackage())
            {
                using (var stream = GetDataStream(language))
                {
                    pck.Load(stream);
                }

                return GetStoppers(pck.Workbook.Worksheets[2]).ToList();
            }
        }

        public List<LocalizedStringDto> GetStrings(string language)
        {
            using (var pck = new ExcelPackage())
            {
                using (var stream = GetDataStream(language))
                {
                    pck.Load(stream);
                }

                return GetLocalizedStrings(pck.Workbook.Worksheets[3]).ToList();
            }
        }

        public List<EvaluationDto> GetEvaluations(string language)
        {
            using (var pck = new ExcelPackage())
            {
                using (var stream = GetDataStream(language))
                {
                    pck.Load(stream);
                }

                return GetEvaluations(pck.Workbook.Worksheets[4]).ToList();
            }
        }

        public List<string> GetLanguages()
        {
            var result = new List<string>();
            var files = Directory.GetFiles(@".\data", "data.*.xlsx");
            foreach (var file in files)
            {
                var language = dataFileRegex.Match(file).Groups["lang"].Value;
                result.Add(language);
            }

            return result;
        }

        private static Stream GetDataStream(string language)
        {
            var fileName = $@".\data\data.{language}.xlsx";
            if (!File.Exists(fileName))
            {
                throw new Exception($"Data for {language} doesn't exist.");
            }

            return File.OpenRead(fileName);
        }

        private static IEnumerable<LocalizedStringDto> GetLocalizedStrings(ExcelWorksheet ws, bool hasHeader = true)
        {
            var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                var localizedString = new LocalizedStringDto()
                {
                    Key = (string)row[0],
                    Value = (string)row[1],
                };

                yield return localizedString;
            }
        }

        private static IEnumerable<EvaluationDto> GetEvaluations(ExcelWorksheet ws, bool hasHeader = true)
        {
            var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                var evaluation = new EvaluationDto()
                {
                    ID = int.Parse((string)row[0]),
                    Name = (string)row[1],
                    Limit = int.Parse((string)row[2]),
                    Color = (string)row[3],
                    Icon = (string)row[4],
                    Tooltip = (string)row[5],
                };

                yield return evaluation;
            }
        }

        private static IEnumerable<StopperDto> GetStoppers(ExcelWorksheet ws, bool hasHeader = true)
        {
            var tbl = GetDataTable(ws, hasHeader);

            var stopperTypes = new List<StopperTypeDto>();
            var typeId = 0;
            foreach (DataRow row in tbl.Rows)
            {
                var stopperType = stopperTypes.FirstOrDefault(o => o.Name == (string)row[2]);
                if (stopperType == null)
                {
                    stopperType = new StopperTypeDto() { Name = (string)row[2], ID = typeId++ };
                    stopperTypes.Add(stopperType);
                }

                var stopper = new StopperDto()
                {
                    ID = int.Parse((string)row[0]),
                    Name = (string)row[1],
                    Problem = (string)row[3],
                    NotProblem = (string)row[4],
                    StopperType = stopperType,
                    StopperTypeID = stopperType.ID,
                    Questions = new List<StopperQuestionDto>(),
                };

                for (var i = 5; i < row.ItemArray.Count(); i++)
                {
                    if (row[i] is string value && !string.IsNullOrEmpty(value))
                        stopper.Questions.Add(new StopperQuestionDto() { QuestionContent = value, ID = i, StopperID = stopper.ID });
                    else
                        break;
                }

                yield return stopper;
            }
        }

        private static IEnumerable<CompetencyDto> GetCompetencies(ExcelWorksheet ws, bool hasHeader = true)
        {
            var tbl = GetDataTable(ws, hasHeader);

            var clusters = new List<ClusterDto>();
            var factors = new List<FactorDto>();
            var id = 0;
            foreach (DataRow row in tbl.Rows)
            {
                var cluster = clusters.FirstOrDefault(o => o.Name == (string)row[4]);
                if (cluster == null)
                {
                    cluster = new ClusterDto() { Name = (string)row[4], ID = id++ };
                    clusters.Add(cluster);
                }
                var factor = factors.FirstOrDefault(o => o.Name == (string)row[3]);
                if (factor == null)
                {
                    factor = new FactorDto() { Name = (string)row[3], ID = id++ };
                    factors.Add(factor);
                }

                var competency = new CompetencyDto()
                {
                    ID = int.Parse((string)row[0]),
                    Name = (string)row[1],
                    Description = (string)row[2],
                    LessSkilled = (string)row[5],
                    Skilled = (string)row[6],
                    Talented = (string)row[7],
                    OverusedSkill = (string)row[8],
                    Factor = factor,
                    FactorID = factor.ID,
                    Cluster = cluster,
                    ClusterID = cluster.ID,
                    Questions = new List<QuestionDto>()
                };

                for (var i = 9; i < row.ItemArray.Count(); i++)
                {
                    if (row[i] is string value && !string.IsNullOrEmpty(value))
                        competency.Questions.Add(new QuestionDto() { QuestionContent = value, ID = i, CompetencyID = competency.ID });
                    else
                        break;
                }

                yield return competency;
            }
        }

        private static DataTable GetDataTable(ExcelWorksheet ws, bool hasHeader = true)
        {
            var tbl = new DataTable();
            foreach (var firstRowCell in ws.Cells[1, 1, 1, ws.Dimension.End.Column])
            {
                tbl.Columns.Add(hasHeader ? firstRowCell.Text : string.Format("Column {0}", firstRowCell.Start.Column));
            }
            var startRow = hasHeader ? 2 : 1;
            for (var rowNum = startRow; rowNum <= ws.Dimension.End.Row; rowNum++)
            {
                var wsRow = ws.Cells[rowNum, 1, rowNum, ws.Dimension.End.Column];
                var row = tbl.Rows.Add();
                foreach (var cell in wsRow)
                {
                    row[cell.Start.Column - 1] = cell.Text;
                }
            }

            return tbl;
        }
    }
}
