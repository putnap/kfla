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

        public List<Competency> GetCompetencies(string language)
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

        public List<Stopper> GetStoppers(string language)
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

        public List<LocalizedString> GetStrings(string language)
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

        public List<Evaluation> GetEvaluations(string language)
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

        private static IEnumerable<LocalizedString> GetLocalizedStrings(ExcelWorksheet ws, bool hasHeader = true)
        {
            var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                var localizedString = new LocalizedString()
                {
                    Key = (string)row[0],
                    Value = (string)row[1],
                };

                yield return localizedString;
            }
        }

        private static IEnumerable<Evaluation> GetEvaluations(ExcelWorksheet ws, bool hasHeader = true)
        {
            var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                var evaluation = new Evaluation()
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

        private static IEnumerable<Stopper> GetStoppers(ExcelWorksheet ws, bool hasHeader = true)
        {
            var tbl = GetDataTable(ws, hasHeader);

            var clusters = new List<Cluster>();
            var typeId = 0;
            foreach (DataRow row in tbl.Rows)
            {
                var cluster = clusters.FirstOrDefault(o => o.Name == (string)row[2]);
                if (cluster == null)
                {
                    cluster = new Cluster() { Name = (string)row[2], ID = typeId++.ToString() };
                    clusters.Add(cluster);
                }

                var stopper = new Stopper()
                {
                    ID = int.Parse((string)row[0]),
                    Name = (string)row[1],
                    Problem = ((string)row[3]).Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries).ToList(),
                    NotProblem = ((string)row[4]).Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries).ToList(),
                    Cluster = cluster,
                    Questions = new List<StopperQuestion>(),
                };

                for (var i = 5; i < row.ItemArray.Count(); i++)
                {
                    if (row[i] is string value && !string.IsNullOrEmpty(value))
                        stopper.Questions.Add(new StopperQuestion() { QuestionContent = value, ID = i, StopperID = stopper.ID });
                    else
                        break;
                }

                yield return stopper;
            }
        }

        private static IEnumerable<Competency> GetCompetencies(ExcelWorksheet ws, bool hasHeader = true)
        {
            var tbl = GetDataTable(ws, hasHeader);

            var clusters = new List<Cluster>();
            var factors = new List<Factor>();
            var id = 0;
            foreach (DataRow row in tbl.Rows)
            {
                var cluster = clusters.FirstOrDefault(o => o.Name == (string)row[4]);
                if (cluster == null)
                {
                    cluster = new Cluster() { Name = (string)row[4], ID = id++.ToString() };
                    clusters.Add(cluster);
                }
                var factor = factors.FirstOrDefault(o => o.Name == (string)row[3]);
                if (factor == null)
                {
                    factor = new Factor() { Name = (string)row[3], ID = id++.ToString() };
                    factors.Add(factor);
                }

                var competency = new Competency()
                {
                    ID = int.Parse((string)row[0]),
                    Name = (string)row[1],
                    Description = (string)row[2],
                    LessSkilled = ((string)row[5]).Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries).ToList(),
                    Skilled = ((string)row[6]).Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries).ToList(),
                    Talented = ((string)row[7]).Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries).ToList(),
                    OverusedSkill = ((string)row[8]).Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries).ToList(),
                    Factor = factor,
                    Cluster = cluster,
                    Questions = new List<Question>()
                };

                for (var i = 9; i < row.ItemArray.Count(); i++)
                {
                    if (row[i] is string value && !string.IsNullOrEmpty(value))
                        competency.Questions.Add(new Question() { QuestionContent = value, ID = i, CompetencyID = competency.ID });
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

        public Competency GetCompetency(string language, int competencyId)
        {
            return GetCompetencies(language).SingleOrDefault(o => o.ID == competencyId);
        }

        public Stopper GetStopper(string language, int stopperId)
        {
            return GetStoppers(language).SingleOrDefault(o => o.ID == stopperId);
        }
    }
}
