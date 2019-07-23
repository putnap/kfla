using KFLA.Contract;
using KFLA.Contract.Services;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace KFLA.Services.Services
{
    public class CompetenciesService2 : ICompetenciesService
    {
        private readonly Regex dataFileRegex = new Regex(@".+data\.(?'lang'[a-z]{2,3})\.xlsx");

        private Dictionary<string, List<Competency>> competencyCache = new Dictionary<string, List<Competency>>();

        public List<Competency> GetCompetencies(string language)
        {
            if (!competencyCache.TryGetValue(language, out var cache))
            {
                cache = new List<Competency>();
                using (var pck = new ExcelPackage())
                {
                    using (var stream = GetData2Stream(language))
                    {
                        pck.Load(stream);
                    }

                    cache.AddRange(GetCompetencies(pck, language));
                    competencyCache[language] = cache;
                }
            }

            return cache;
        }

        public Competency GetCompetency(string language, int competencyId)
        {
            return GetCompetencies(language).SingleOrDefault(o => o.ID == competencyId);
        }

        public List<Stopper> GetStoppers(string language)
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

        public Stopper GetStopper(string language, int stopperId)
        {
            return GetStoppers(language).SingleOrDefault(o => o.ID == stopperId);
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

        private static Stream GetData2Stream(string language)
        {
            var fileName = $@".\data\data2.{language}.xlsx";
            if (!File.Exists(fileName))
            {
                throw new Exception($"Data for {language} doesn't exist.");
            }

            return File.OpenRead(fileName);
        }

        private static IEnumerable<Competency> GetCompetencies(ExcelPackage pck, string language)
        {
            var competencies = GetCompetencyDefinitions(pck).ToList();
            var factors = GetFactors(pck).ToList();
            var clusters = GetClusters(pck).ToList();
            var factorClusterMaps = GetFactorClusterMaps(pck).ToList();
            var clusterCompetencyMaps = GetClusterCompetencyMaps(pck).ToList();
            var lessSkilledMaps = GetSkillDescriptions(pck, "Less Skilled").ToList();
            var skilledMaps = GetSkillDescriptions(pck, "Skilled").ToList();
            var talentedMaps = GetSkillDescriptions(pck, "Talented").ToList();
            var overusedMaps = GetSkillDescriptions(pck, "Overused").ToList();
            var competencyQuestions = GetCompetencyQuestions(language).ToList();

            // details
            var competencyContexts = GetContexts(pck).ToList();
            var quotes = GetQuotes(pck).ToList();
            var positionings = GetPositioning(pck).ToList();
            var causes = GetCauses(pck).ToList();
            var caseStudies = GetCaseStudies(pck).ToList();
            var tips = GetTips(pck).ToList();
            var jobAssignments = GetJobAssignments(pck).ToList();
            var timeToReflect = GetTakeTimeToReflect(pck).ToList();
            var learnMore = GetLearnMore(pck).ToList();
            var deepDiveLinks = GetDeepDiveLearningResources(pck).ToList();

            foreach (var competency in competencies)
            {
                competency.Cluster = clusters.SingleOrDefault(o => o.ID == clusterCompetencyMaps.Single(m => m.CompetencyID == competency.ID).ClusterID);
                competency.Factor = factors.SingleOrDefault(o => o.ID == factorClusterMaps.Single(m => m.ClusterID == competency.ClusterID).FactorID);
                competency.LessSkilled = lessSkilledMaps.Where(o => o.ID == competency.ID).Select(o => o.SkillDescription).ToList();
                competency.Skilled = skilledMaps.Where(o => o.ID == competency.ID).Select(o => o.SkillDescription).ToList();
                competency.Talented = talentedMaps.Where(o => o.ID == competency.ID).Select(o => o.SkillDescription).ToList();
                competency.OverusedSkill = overusedMaps.Where(o => o.ID == competency.ID).Select(o => o.SkillDescription).ToList();
                competency.Questions = competencyQuestions.Where(o => o.CompetencyID == competency.ID).ToList();
                competency.Context = competencyContexts.SingleOrDefault(o => o.Id == competency.ID).Context;
                competency.Quotes = quotes.Where(o => o.id == competency.ID).OrderBy(o => o.Order).Select(o => o.Quote).ToList();
                competency.Positioning = positionings.SingleOrDefault(o => o.Id == competency.ID).Positioning;
                competency.Causes = causes.Where(o => o.Id == competency.ID).OrderBy(o => o.Order).Select(o => o.Cause).ToList();
                competency.CaseStudies = caseStudies.Where(o => o.Id == competency.ID).Select(o => new CaseStudy { Type = o.Type, Case = o.CaseStudy }).ToList();
                competency.Tips = tips.Where(o => o.Id == competency.ID).OrderBy(o => o.Order).Select(o => o.Tip).ToList();
                competency.JobAssignments = jobAssignments.Where(o => o.Id == competency.ID).OrderBy(o => o.Order).Select(o => o.JobAssignment).ToList();
                competency.TimeToReflect = timeToReflect.Where(o => o.Id == competency.ID).OrderBy(o => o.Order).Select(o => new TimeToReflect { Statement = o.Statement, Suggestion = o.Suggestion }).ToList();
                competency.LearnMore = learnMore.Where(o => o.Id == competency.ID).OrderBy(o => o.Order).Select(o => o.LearnMore).ToList();
                competency.DeepDiveResources = deepDiveLinks.Where(o => o.Id == competency.ID).OrderBy(o => o.Order).Select(o => o.DeepDiveResource).ToList();
                Debug.WriteLine($"Completed competency: {competency.ID}");
            }

          return competencies;
        }

        private Competency GetCompetency(ExcelPackage pck, string language, int competencyId)
        {
            var competencies = GetCompetencies(pck, language);

            return competencies.SingleOrDefault(o => o.ID == competencyId);
        }

        private static IEnumerable<Stopper> GetStoppers(ExcelPackage pck, string language)
        {
            var stoppers = GetStoppersDefinitions(pck).ToList();

            var problemMaps = GetSkillDescriptions(pck, "A Problem");
            var notAProblemMaps = GetSkillDescriptions(pck, "Not A Problem");
            var stopperQuestions = GetStopperQuestions(language);

            foreach (var stopper in stoppers)
            {
                stopper.Problem = problemMaps.Where(o => o.ID == stopper.ID).Select(o => o.SkillDescription).ToList();
                stopper.NotProblem = notAProblemMaps.Where(o => o.ID == stopper.ID).Select(o => o.SkillDescription).ToList();
                stopper.Questions = stopperQuestions.Where(o => o.StopperID == stopper.ID).ToList();
            }

            return stoppers;
        }

        private static IEnumerable<Stopper> GetStoppersDefinitions(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Cluster-Comp S&S Mapping"];
            var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (int.TryParse((string)row[2], out var stopperId) && stopperId > 100)
                {
                    var stopper = new Stopper()
                    {
                        ID = int.Parse((string)row[2]),
                        Name = (string)row[3],
                        Cluster = new Cluster()
                        {
                            ID = (string)row[0],
                            Name = (string)row[1]
                        }
                    };

                    yield return stopper;
                }
            }
        }

        private static IEnumerable<Factor> GetFactors(ExcelPackage pck, bool hasHeader = true)
        {
            var ws = pck.Workbook.Worksheets["Factors"];
            var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                var factor = new Factor()
                {
                    ID = (string)row[0],
                    Name = (string)row[1],
                };

                yield return factor;
            }
        }

        private static IEnumerable<(int Id, string Context)> GetContexts(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Context"];
            var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), (string)row[2]);
            }
        }

        private static IEnumerable<(int id, string Quote, string Order)> GetQuotes(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Quotes"];
            var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), (string)row[2], (string)row[3]);
            }
        }

        private static IEnumerable<(int Id, string Positioning)> GetPositioning(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Positioning"];
            var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), (string)row[2]);
            }
        }

        private static IEnumerable<(int Id, int Order, string Cause)> GetCauses(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Causes"];
            var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), int.Parse((string)row[2]), (string)row[3]);
            }
        }

        private static IEnumerable<(int Id, string Type, string CaseStudy)> GetCaseStudies(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Case Studies"];
            var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), (string)row[2], (string)row[3]);
            }
        }

        private static IEnumerable<(int Id, int Order, Tip Tip)> GetTips(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Tips"];
            var tbl = GetDataTable(ws);

            var wantToLearnMore = GetWantToLearnMore(pck);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id) && row[2] is string tipId)
                    yield return (int.Parse(id), int.Parse(tipId), new Tip
                    {
                        Phrase = (string)row[3],
                        TipContent = (string)row[4],
                        WantToLearnMore = wantToLearnMore.Where(o => o.Id == int.Parse(id) && o.Tip == int.Parse(tipId)).OrderBy(o => o.Order).Select(o => o.Reading).ToList()
                    });
            }
        }

        private static IEnumerable<(int Id, int Tip, int Order, string Reading)> GetWantToLearnMore(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Want to learn more"];
            var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), int.Parse((string)row[2]), int.Parse((string)row[3]), (string)row[4]);
            }
        }

        private static IEnumerable<(int Id, int Order, string JobAssignment)> GetJobAssignments(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Job Assignments"];
            var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), int.Parse((string)row[2]), (string)row[3]);
            }
        }

        private static IEnumerable<(int Id, int Order, string Statement, string Suggestion)> GetTakeTimeToReflect(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Time to reflect"];
            var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), int.Parse((string)row[2]), (string)row[3], (string)row[4]);
            }
        }

        private static IEnumerable<(int Id, int Order, string LearnMore)> GetLearnMore(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Learn More"];
            var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), int.Parse((string)row[2]), (string)row[3]);
            }
        }

        private static IEnumerable<(int Id, int Order, string DeepDiveResource)> GetDeepDiveLearningResources(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Deep dive learning resources"];
            var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), int.Parse((string)row[2]), (string)row[3]);
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

        private static IEnumerable<Cluster> GetClusters(ExcelPackage pck, bool hasHeader = true)
        {
            var ws = pck.Workbook.Worksheets["Clusters"];
            var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                {
                    var cluster = new Cluster()
                    {
                        ID = (string)row[0],
                        Name = (string)row[1],
                    };

                    yield return cluster;
                }
            }
        }

        private static IEnumerable<Competency> GetCompetencyDefinitions(ExcelPackage pck, bool hasHeader = true)
        {
            var ws = pck.Workbook.Worksheets["Comp Definition"];
            var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                var competency = new Competency()
                {
                    ID = int.Parse((string)row[0]),
                    Name = (string)row[1],
                    Description = (string)row[2]
                };

                yield return competency;
            }
        }

        private static IEnumerable<Question> GetCompetencyQuestions(string language) 
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

        private static IEnumerable<Question> GetCompetencyQuestions(ExcelPackage pck)
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
                        yield return new Question() { QuestionContent = value, ID = id++, CompetencyID = competencyId };
                    else
                        break;
                }
            }
        }

        private static IEnumerable<StopperQuestion> GetStopperQuestions(string language)
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

        private static IEnumerable<StopperQuestion> GetStopperQuestions(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets[2];
            var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                var stopperId = int.Parse((string)row[0]);
                for (var i = 5; i < row.ItemArray.Count(); i++)
                {
                    if (row[i] is string value && !string.IsNullOrEmpty(value))
                        yield return new StopperQuestion() { QuestionContent = value, ID = i++, StopperID = stopperId };
                    else
                        break;
                }
            }
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
