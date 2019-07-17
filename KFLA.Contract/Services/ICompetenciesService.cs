using System;
using System.Collections.Generic;

namespace KFLA.Contract.Services
{
    public interface ICompetenciesService
    {
        List<LocalizedString> GetStrings(string language);
        List<Competency> GetCompetencies(string language);
        Competency GetCompetency(string language, int competencyId);
        List<Stopper> GetStoppers(string language);
        Stopper GetStopper(string language, int stopperId);
        List<Evaluation> GetEvaluations(string language);
        List<string> GetLanguages();
    }
}
