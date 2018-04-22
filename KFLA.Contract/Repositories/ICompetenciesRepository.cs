using System;
using System.Collections.Generic;
using System.Text;

namespace KFLA.Contract.Repositories
{
    public interface ICompetenciesRepository
    {
        List<CompetencyDto> GetAll();
        void RefreshExcel();
    }
}
