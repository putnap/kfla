using System;
using System.Collections.Generic;
using System.Text;

namespace KFLA.Contract.Repositories
{
    public interface ICompetenciesRepository
    {
        List<CompetencyDto> GetCompetencies();
        List<StopperDto> GetStoppers();
        void RefreshExcel();
    }
}
