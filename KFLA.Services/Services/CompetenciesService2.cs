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
    public class CompetenciesService2 : ICompetenciesService
    {
        private readonly Regex dataFileRegex = new Regex(@".+data\.(?'lang'[a-z]{2,3})\.xlsx");

        public List<CompetencyDto> GetCompetencies(string language)
        {
            using (var pck = new ExcelPackage())
            {
                using (var stream = GetData2Stream(language))
                {
                    pck.Load(stream);
                }

                return GetCompetencies(pck, language).ToList();
            }
        }

        public List<StopperDto> GetStoppers(string language)
        {
            using (var pck = new ExcelPackage())
            {
                using (var stream = GetData2Stream(language))
                {
                    pck.Load(stream);
                }

                return GetStoppers(pck, language).ToList();
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

        private static Stream GetData2Stream(string language)
        {
            var fileName = $@".\data\data2.{language}.xlsx";
            if (!File.Exists(fileName))
            {
                throw new Exception($"Data for {language} doesn't exist.");
            }

            return File.OpenRead(fileName);
        }

        private static IEnumerable<CompetencyDto> GetCompetencies(ExcelPackage pck, string language)
        {
            var competencies = GetCompetencyDefinitions(pck).ToList();
            var factors = GetFactors(pck);
            var clusters = GetClusters(pck);
            var factorClusterMaps = GetFactorClusterMaps(pck);
            var clusterCompetencyMaps = GetClusterCompetencyMaps(pck);
            var lessSkilledMaps = GetSkillDescriptions(pck, "Less Skilled");
            var skilledMaps = GetSkillDescriptions(pck, "Skilled");
            var talentedMaps = GetSkillDescriptions(pck, "Talented");
            var overusedMaps = GetSkillDescriptions(pck, "Overused");
            var competencyQuestions = GetCompetencyQuestions(language);

            foreach (var competency in competencies)
            {
                competency.Cluster = clusters.SingleOrDefault(o => o.ID == clusterCompetencyMaps.Single(m => m.CompetencyID == competency.ID).ClusterID);
                competency.Factor = factors.SingleOrDefault(o => o.ID == factorClusterMaps.Single(m => m.ClusterID == competency.ClusterID).FactorID);
                competency.LessSkilled = string.Join("\n", lessSkilledMaps.Where(o => o.ID == competency.ID).Select(o => o.SkillDescription));
                competency.Skilled = string.Join("\n", skilledMaps.Where(o => o.ID == competency.ID).Select(o => o.SkillDescription));
                competency.Talented = string.Join("\n", talentedMaps.Where(o => o.ID == competency.ID).Select(o => o.SkillDescription));
                competency.OverusedSkill = string.Join("\n", overusedMaps.Where(o => o.ID == competency.ID).Select(o => o.SkillDescription));
                competency.Questions = competencyQuestions.Where(o => o.CompetencyID == competency.ID).ToList();
            }

            return competencies;
        }

        private static IEnumerable<StopperDto> GetStoppers(ExcelPackage pck, string language)
        {
            var stoppers = GetStoppersDefinitions(pck).ToList();

            var problemMaps = GetSkillDescriptions(pck, "A Problem");
            var notAProblemMaps = GetSkillDescriptions(pck, "Not A Problem");
            var stopperQuestions = GetStopperQuestions(language);

            foreach (var stopper in stoppers)
            {
                var problems = problemMaps.Where(o => o.ID == stopper.ID).Select(o => o.SkillDescription);
                stopper.Problem = string.Join("\n", problems);
                stopper.NotProblem = string.Join("\n", notAProblemMaps.Where(o => o.ID == stopper.ID).Select(o => o.SkillDescription));
                stopper.Questions = stopperQuestions.Where(o => o.StopperID == stopper.ID).ToList();
            }

            return stoppers;
        }

        private static IEnumerable<StopperDto> GetStoppersDefinitions(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Cluster-Comp S&S Mapping"];
            var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (int.TryParse((string)row[2], out var stopperId) && stopperId > 100)
                {
                    var stopper = new StopperDto()
                    {
                        ID = int.Parse((string)row[2]),
                        Name = (string)row[3],
                        Cluster = new ClusterDto()
                        {
                            ID = (string)row[0],
                            Name = (string)row[1]
                        }
                    };

                    yield return stopper;
                }
            }
        }

        private static IEnumerable<FactorDto> GetFactors(ExcelPackage pck, bool hasHeader = true)
        {
            var ws = pck.Workbook.Worksheets["Factors"];
            var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                var factor = new FactorDto()
                {
                    ID = (string)row[0],
                    Name = (string)row[1],
                };

                yield return factor;
            }
        }

        private static IEnumerable<(string FactorID, string ClusterID)> GetFactorClusterMaps(ExcelPackage pck, bool hasHeader = true)
        {
            var ws = pck.Workbook.Worksheets["Factor-Cluster Mapping"];
            var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string factorID && !string.IsNullOrEmpty(factorID))
                    yield return (factorID, (string)row[2]);
            }
        }

        private static IEnumerable<(string ClusterID, int CompetencyID)> GetClusterCompetencyMaps(ExcelPackage pck, bool hasHeader = true)
        {
            var ws = pck.Workbook.Worksheets["Cluster-Comp S&S Mapping"];
            var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string clusterID && !string.IsNullOrEmpty(clusterID))
                    yield return (clusterID, int.Parse((string)row[2]));
            }
        }

        private static IEnumerable<(int ID, string SkillDescription)> GetSkillDescriptions(ExcelPackage pck, string skill, bool hasHeader = true)
        {
            var ws = pck.Workbook.Worksheets[skill];
            var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), (string)row[3]);
            }
        }

        private static IEnumerable<ClusterDto> GetClusters(ExcelPackage pck, bool hasHeader = true)
        {
            var ws = pck.Workbook.Worksheets["Clusters"];
            var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                {
                    var cluster = new ClusterDto()
                    {
                        ID = (string)row[0],
                        Name = (string)row[1],
                    };

                    yield return cluster;
                }
            }
        }

        private static IEnumerable<CompetencyDto> GetCompetencyDefinitions(ExcelPackage pck, bool hasHeader = true)
        {
            var ws = pck.Workbook.Worksheets["Comp Definition"];
            var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                var competency = new CompetencyDto()
                {
                    ID = int.Parse((string)row[0]),
                    Name = (string)row[1],
                    Description = (string)row[2]
                };

                yield return competency;
            }
        }

        private static IEnumerable<QuestionDto> GetCompetencyQuestions(string language) 
        {
            using (var pck = new ExcelPackage())
            {
                using (var stream = GetDataStream(language))
                {
                    pck.Load(stream);
                }

                return GetCompetencyQuestions(pck).ToList();
            }
        }

        private static IEnumerable<QuestionDto> GetCompetencyQuestions(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets[1];
            var tbl = GetDataTable(ws);

            var id = 0;
            foreach (DataRow row in tbl.Rows)
            {
                var competencyId = int.Parse((string)row[0]);
                for (var i = 9; i < row.ItemArray.Count(); i++)
                {
                    if (row[i] is string value && !string.IsNullOrEmpty(value))
                        yield return new QuestionDto() { QuestionContent = value, ID = id++, CompetencyID = competencyId };
                    else
                        break;
                }
            }
        }

        private static IEnumerable<StopperQuestionDto> GetStopperQuestions(string language)
        {
            using (var pck = new ExcelPackage())
            {
                using (var stream = GetDataStream(language))
                {
                    pck.Load(stream);
                }

                return GetStopperQuestions(pck).ToList();
            }
        }

        private static IEnumerable<StopperQuestionDto> GetStopperQuestions(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets[2];
            var tbl = GetDataTable(ws);

            var id = 0;
            foreach (DataRow row in tbl.Rows)
            {
                var stopperId = int.Parse((string)row[0]);
                for (var i = 5; i < row.ItemArray.Count(); i++)
                {
                    if (row[i] is string value && !string.IsNullOrEmpty(value))
                        yield return new StopperQuestionDto() { QuestionContent = value, ID = i++, StopperID = stopperId };
                    else
                        break;
                }
            }
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
