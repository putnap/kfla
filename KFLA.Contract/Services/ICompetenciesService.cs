using System;
using System.Collections.Generic;
using System.Text;

namespace KFLA.Contract.Services
{
    public interface ICompetenciesService
    {
        List<CompetencyDto> GetCompetencies();
        List<StopperDto> GetStoppers();
        void RefreshExcel();
    }
}
