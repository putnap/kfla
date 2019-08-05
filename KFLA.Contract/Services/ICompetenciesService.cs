using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KFLA.Contract.Services
{
    public interface ICompetenciesService
    {
        Task<IEnumerable<LocalizedString>> GetStrings(string language);
        Task<IEnumerable<Competency>> GetCompetencies(string language);
        Task<IEnumerable<Stopper>> GetStoppers(string language);
        Task<IEnumerable<Evaluation>> GetEvaluations(string language);
        Task<IEnumerable<string>> GetLanguages();
    }

    public interface ICompetenciesWriteService
    {
        Task InsertCompetencies(string language, IEnumerable<Competency> competencies);

        Task InsertStoppers(string language, IEnumerable<Stopper> stoppers);

        Task InsertStrings(string language, IEnumerable<LocalizedString> localizedStrings);

        Task InsertEvaluations(string language, IEnumerable<Evaluation> evaluations);
    }
}
