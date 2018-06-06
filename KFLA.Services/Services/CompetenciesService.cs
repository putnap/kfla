using KFLA.Contract;
using KFLA.Contract.Repositories;
using KFLA.Contract.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace KFLA.Services.Services
{
    public class CompetenciesService : ICompetenciesService
    {
        private readonly ICompetenciesRepository competenciesRepository;

        public CompetenciesService(ICompetenciesRepository competenciesRepository)
        {
            this.competenciesRepository = competenciesRepository;
        }

        public List<CompetencyDto> GetCompetencies()
        {
            return competenciesRepository.GetCompetencies();
        }

        public List<StopperDto> GetStoppers()
        {
            return competenciesRepository.GetStoppers();
        }

        public void RefreshExcel()
        {
            competenciesRepository.RefreshExcel();
        }
    }
}
