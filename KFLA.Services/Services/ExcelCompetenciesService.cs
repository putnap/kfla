using KFLA.Contract;
using KFLA.Contract.Services;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace KFLA.Services.Services
{
    public class ExcelCompetenciesService : ICompetenciesService
    {
        private readonly Regex _dataFileRegex = new Regex(@".+data\.(?'lang'[a-z]{2,3})\.xlsx");

        public Task<IEnumerable<Competency>> GetCompetencies(string language)
        {
            using var pck = new ExcelPackage();
            using (var stream = GetData2Stream(language))
            {
                pck.Load(stream);
            }

            return Task.FromResult(GetCompetencies(pck, language).ToList().AsEnumerable());
        }

        public Task<IEnumerable<Stopper>> GetStoppers(string language)
        {
            using var pck = new ExcelPackage();
            using (var stream = GetData2Stream(language))
            {
                pck.Load(stream);
            }

            return Task.FromResult(GetStoppers(pck, language).ToList().AsEnumerable());
        }

        public Task<IEnumerable<LocalizedString>> GetStrings(string language)
        {
            var result = new List<LocalizedString>();
            using (var pck = new ExcelPackage())
            {
                using (var stream = GetDataStream(language))
                {
                    pck.Load(stream);
                }

                result.AddRange(GetLocalizedStrings(pck.Workbook.Worksheets[2]));
            }

            using (var pck = new ExcelPackage())
            {
                using (var stream = GetData2Stream(language))
                {
                    pck.Load(stream);
                }

                var labels = GetLabels(pck).ToList();

                result.Add(new LocalizedString { Key = "Library.Item.Competency.PossibleCauses", Value = labels[8] });
                result.Add(new LocalizedString { Key = "Library.Item.Competency.PossibleCauses.Description", Value = labels[9] });
                result.Add(new LocalizedString { Key = "Library.Item.Competency.Tips", Value = labels[10] });
                result.Add(new LocalizedString { Key = "Library.Item.Tip.WantToLearnMore", Value = labels[11] });
                result.Add(new LocalizedString { Key = "Library.Item.JobAssignments", Value = labels[12] });
                result.Add(new LocalizedString { Key = "Library.Item.TimeToReflect", Value = labels[13] });
                result.Add(new LocalizedString { Key = "Library.Item.LearnMore", Value = labels[14] });
                result.Add(new LocalizedString { Key = "Library.Item.DeepDive", Value = labels[15] });
                result.Add(new LocalizedString { Key = "Library.Item.MoreHelp.Title", Value = labels[19] });
                result.Add(new LocalizedString { Key = "Library.Item.MoreHelp.Content", Value = labels[20] });
                result.Add(new LocalizedString { Key = "Library.Item.Stopper.PossibleCauses", Value = labels[24] });
                result.Add(new LocalizedString { Key = "Library.Item.Stopper.OtherCauses", Value = labels[25] });
                result.Add(new LocalizedString { Key = "Library.Item.Stopper.OtherCauses.Description", Value = labels[26] });
                result.Add(new LocalizedString { Key = "Library.Item.Stopper.OtherCauses.BeingLessSkilled", Value = labels[27] });
                result.Add(new LocalizedString { Key = "Library.Item.Stopper.OtherCauses.Overusing", Value = labels[28] });
                result.Add(new LocalizedString { Key = "Library.Item.Stopper.TipsBeing", Value = labels[29] });
                result.Add(new LocalizedString { Key = "Library.Item.Stopper.Tips", Value = labels[30] });
                result.Add(new LocalizedString { Key = "Library.Item.LearningResources", Value = labels[31] });

                result.Add(new LocalizedString { Key = "Library.Items.Links.Jobs", Value = labels[12] });
                result.Add(new LocalizedString { Key = "Library.Items.Links.LearningResources", Value = labels[31] });
            }

            return Task.FromResult(result.AsEnumerable());
        }

        public Task<IEnumerable<Evaluation>> GetEvaluations(string language)
        {
            using var pck = new ExcelPackage();
            using (var stream = GetDataStream(language))
            {
                pck.Load(stream);
            }

            return Task.FromResult(GetEvaluations(pck.Workbook.Worksheets[3]).ToList().AsEnumerable());
        }

        public Task<IEnumerable<string>> GetLanguages()
        {
            var result = new List<string>();
            var files = Directory.GetFiles(@".\data", "data.*.xlsx");
            foreach (var file in files)
            {
                var language = _dataFileRegex.Match(file).Groups["lang"].Value;
                result.Add(language);
            }

            return Task.FromResult(result.AsEnumerable());
        }

        private static Stream GetDataStream(string language)
        {
            var fileName = string.Format(".{0}data{0}data.{1}.xlsx", Path.DirectorySeparatorChar, language);
            if (!File.Exists(fileName))
            {
                throw new Exception($"Data for {language} doesn't exist.");
            }

            return File.OpenRead(fileName);
        }

        private static Stream GetData2Stream(string language)
        {
            var fileName = string.Format(".{0}data{0}data2.{1}.xlsx", Path.DirectorySeparatorChar, language);
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
                competency.Questions = competencyQuestions.Where(o => o.ID == competency.ID).Select(o => o.Question).ToList();
                competency.Context = competencyContexts.SingleOrDefault(o => o.Id == competency.ID).Context;
                competency.Quotes = quotes.Where(o => o.Id == competency.ID).OrderBy(o => o.Order).Select(o => o.Quote).ToList();
                competency.Positioning = positionings.SingleOrDefault(o => o.Id == competency.ID).Positioning;
                competency.Causes = causes.Where(o => o.Id == competency.ID).OrderBy(o => o.Order).Select(o => o.Cause).ToList();
                var caseStudy = caseStudies.SingleOrDefault(o => o.Id == competency.ID);
                competency.CaseStudy = new CaseStudy { Type = caseStudy.Type, Case = caseStudy.CaseStudy };
                competency.Tips = tips.Where(o => o.Id == competency.ID).OrderBy(o => o.Order).Select(o => o.Tip).ToList();
                competency.JobAssignments = jobAssignments.Where(o => o.Id == competency.ID).OrderBy(o => o.Order).Select(o => o.JobAssignment).ToList();
                competency.TimeToReflect = timeToReflect.Where(o => o.Id == competency.ID).OrderBy(o => o.Order).Select(o => new TimeToReflect { Statement = o.Statement, Suggestion = o.Suggestion }).ToList();
                competency.LearnMore = learnMore.Where(o => o.Id == competency.ID).OrderBy(o => o.Order).Select(o => o.LearnMore).ToList();
                competency.DeepDiveResources = deepDiveLinks.Where(o => o.Id == competency.ID).OrderBy(o => o.Order).Select(o => o.DeepDiveResource).ToList();
            }

            return competencies;
        }

        private static IEnumerable<Stopper> GetStoppers(ExcelPackage pck, string language)
        {
            var stoppers = GetStoppersDefinitions(pck).ToList();

            var clusters = GetClusters(pck).ToList();
            var clusterCompetencyMaps = GetClusterCompetencyMaps(pck).ToList();
            var problemMaps = GetSkillDescriptions(pck, "A Problem");
            var notAProblemMaps = GetSkillDescriptions(pck, "Not A Problem");
            var stopperQuestions = GetStopperQuestions(language);

            // details
            var context = GetContexts(pck).ToList();
            var quotes = GetQuotes(pck).ToList();
            var causes = GetCauses(pck).ToList();
            var otherCauses = GetOtherCauses(pck).ToList();
            var tips = GetTips(pck).ToList();
            var jobAssignments = GetJobAssignments(pck).ToList();
            var learningResources = GetLearningResources(pck).ToList();

            foreach (var stopper in stoppers)
            {
                stopper.Cluster = clusters.SingleOrDefault(o => o.ID == clusterCompetencyMaps.Single(m => m.CompetencyID == stopper.ID).ClusterID);
                stopper.Context = context.SingleOrDefault(o => o.Id == stopper.ID).Context;
                stopper.Problem = problemMaps.Where(o => o.ID == stopper.ID).Select(o => o.SkillDescription).ToList();
                stopper.NotProblem = notAProblemMaps.Where(o => o.ID == stopper.ID).Select(o => o.SkillDescription).ToList();
                stopper.Questions = stopperQuestions.Where(o => o.ID == stopper.ID).Select(o => o.Question).ToList();
                stopper.Quotes = quotes.Where(o => o.Id == stopper.ID).OrderBy(o => o.Order).Select(o => o.Quote).ToList();
                stopper.Causes = causes.Where(o => o.Id == stopper.ID).OrderBy(o => o.Order).Select(o => o.Cause).ToList();
                stopper.OtherCausesBeingLessSkilled = otherCauses[0].Where(o => o.Id == stopper.ID).OrderBy(o => o.Cause).Select(o => o.Cause).ToList();
                stopper.OtherCausesOverusing = otherCauses[1].Where(o => o.Id == stopper.ID).OrderBy(o => o.Cause).Select(o => o.Cause).ToList();
                stopper.Tips = tips.Where(o => o.Id == stopper.ID).OrderBy(o => o.Order).Select(o => o.Tip).ToList();
                stopper.JobAssignments = jobAssignments.Where(o => o.Id == stopper.ID).OrderBy(o => o.Order).Select(o => o.JobAssignment).ToList();
                stopper.LearningResources = learningResources.Where(o => o.Id == stopper.ID).OrderBy(o => o.Order).Select(o => o.LearningResource).ToList();
            }

            return stoppers;
        }

        private static IEnumerable<Stopper> GetStoppersDefinitions(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Cluster-Comp S&S Mapping"];
            using var tbl = GetDataTable(ws);

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
            using var tbl = GetDataTable(ws, hasHeader);

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
            using var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), (string)row[2]);
            }
        }

        private static IEnumerable<(int Id, string Quote, string Order)> GetQuotes(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Quotes"];
            using var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), (string)row[2], (string)row[3]);
            }
        }

        private static IEnumerable<(int Id, string Positioning)> GetPositioning(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Positioning"];
            using var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), (string)row[2]);
            }
        }

        private static IEnumerable<(int Id, int Order, string Cause)> GetCauses(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Causes"];
            using var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), int.Parse((string)row[2]), (string)row[3]);
            }
        }

        private static IEnumerable<IEnumerable<(int Id, string Cause)>> GetOtherCauses(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Other Causes"];
            using var tbl = GetDataTable(ws);
            var result = new List<List<(int Id, string Cause)>>()
            {
                new List<(int Id, string Cause)>(),
                new List<(int Id, string Cause)>()
            };
            var overusing = false;

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string idString && !string.IsNullOrEmpty(idString))
                {
                    if (int.TryParse(idString, out var id))
                    {
                        var otherCause = (id, $"{row[2]}.  {row[3]}");
                        if (!overusing)
                            result[0].Add(otherCause);
                        else
                            result[1].Add(otherCause);
                    }
                    else if (!overusing)
                        overusing = true;
                }
            }

            return result;
        }

        private static IEnumerable<(int Id, string Type, string CaseStudy)> GetCaseStudies(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Case Studies"];
            using var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), (string)row[2], (string)row[3]);
            }
        }

        private static IEnumerable<(int Id, int Order, Tip Tip)> GetTips(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Tips"];
            using var tbl = GetDataTable(ws);

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
            using var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), int.Parse((string)row[2]), int.Parse((string)row[3]), (string)row[4]);
            }
        }

        private static IEnumerable<(int Id, int Order, string JobAssignment)> GetJobAssignments(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Job Assignments"];
            using var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), int.Parse((string)row[2]), (string)row[3]);
            }
        }

        private static IEnumerable<(int Id, int Order, string Statement, string Suggestion)> GetTakeTimeToReflect(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Time to reflect"];
            using var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), int.Parse((string)row[2]), (string)row[3], (string)row[4]);
            }
        }

        private static IEnumerable<(int Id, int Order, string LearnMore)> GetLearnMore(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Learn More"];
            using var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), int.Parse((string)row[2]), (string)row[3]);
            }
        }

        private static IEnumerable<(int Id, int Order, string DeepDiveResource)> GetDeepDiveLearningResources(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Deep dive learning resources"];
            using var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), int.Parse((string)row[2]), (string)row[3]);
            }
        }

        private static IEnumerable<(string FactorID, string ClusterID)> GetFactorClusterMaps(ExcelPackage pck, bool hasHeader = true)
        {
            var ws = pck.Workbook.Worksheets["Factor-Cluster Mapping"];
            using var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string factorID && !string.IsNullOrEmpty(factorID))
                    yield return (factorID, (string)row[2]);
            }
        }

        private static IEnumerable<(string ClusterID, int CompetencyID)> GetClusterCompetencyMaps(ExcelPackage pck, bool hasHeader = true)
        {
            var ws = pck.Workbook.Worksheets["Cluster-Comp S&S Mapping"];
            using var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string clusterID && !string.IsNullOrEmpty(clusterID))
                    yield return (clusterID, int.Parse((string)row[2]));
            }
        }

        private static IEnumerable<(int ID, string SkillDescription)> GetSkillDescriptions(ExcelPackage pck, string skill, bool hasHeader = true)
        {
            var ws = pck.Workbook.Worksheets[skill];
            using var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), (string)row[3]);
            }
        }

        private static IEnumerable<(int Id, int Order, string LearningResource)> GetLearningResources(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["Learning resources"];
            using var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string id && !string.IsNullOrEmpty(id))
                    yield return (int.Parse(id), int.Parse((string)row[2]), (string)row[3]);
            }
        }

        private static IEnumerable<string> GetLabels(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets["labels"];
            using var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                if (row[0] is string label && !string.IsNullOrEmpty(label))
                    yield return label;
            }
        }

        private static IEnumerable<Cluster> GetClusters(ExcelPackage pck, bool hasHeader = true)
        {
            var ws = pck.Workbook.Worksheets["Clusters"];
            using var tbl = GetDataTable(ws, hasHeader);

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
            using var tbl = GetDataTable(ws, hasHeader);

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

        private static IEnumerable<(int ID, string Question)> GetCompetencyQuestions(string language)
        {
            using var pck = new ExcelPackage();
            using (var stream = GetDataStream(language))
            {
                pck.Load(stream);
            }

            return GetCompetencyQuestions(pck).ToList();
        }

        private static IEnumerable<(int ID, string Question)> GetCompetencyQuestions(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets[0];
            using var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                var competencyId = int.Parse((string)row[0]);
                for (var i = 9; i < row.ItemArray.Count(); i++)
                {
                    if (row[i] is string value && !string.IsNullOrEmpty(value))
                        yield return (competencyId, value);
                    else
                        break;
                }
            }
        }

        private static IEnumerable<(int ID, string Question)> GetStopperQuestions(string language)
        {
            using var pck = new ExcelPackage();
            using (var stream = GetDataStream(language))
            {
                pck.Load(stream);
            }

            return GetStopperQuestions(pck).ToList();
        }

        private static IEnumerable<(int ID, string Question)> GetStopperQuestions(ExcelPackage pck)
        {
            var ws = pck.Workbook.Worksheets[1];
            using var tbl = GetDataTable(ws);

            foreach (DataRow row in tbl.Rows)
            {
                var stopperId = int.Parse((string)row[0]);
                for (var i = 5; i < row.ItemArray.Count(); i++)
                {
                    if (row[i] is string value && !string.IsNullOrEmpty(value))
                        yield return (stopperId, value);
                    else
                        break;
                }
            }
        }

        private static IEnumerable<LocalizedString> GetLocalizedStrings(ExcelWorksheet ws, bool hasHeader = true)
        {
            using var tbl = GetDataTable(ws, hasHeader);

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
            using var tbl = GetDataTable(ws, hasHeader);

            foreach (DataRow row in tbl.Rows)
            {
                var evaluation = new Evaluation()
                {
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
                    try
                    {
                        row[cell.Start.Column - 1] = cell.Text;
                    }
                    catch (IndexOutOfRangeException) { }
                }
            }

            return tbl;
        }
    }
}
