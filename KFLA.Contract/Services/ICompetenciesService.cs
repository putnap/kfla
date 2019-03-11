using System;
using System.Collections.Generic;
using System.Text;

namespace KFLA.Contract.Services
{
    public interface ICompetenciesService
    {
        List<LocalizedStringDto> GetStrings(string language);
        List<CompetencyDto> GetCompetencies(string language);
        List<StopperDto> GetStoppers(string language);
        List<EvaluationDto> GetEvaluations(string language);
        List<string> GetLanguages();
    }
}
