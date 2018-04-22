using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KFLA.Contract.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KFLA.API
{
    [Produces("application/json")]
    [Route("api/competencies")]
    public class CompetenciesController : Controller
    {
        private readonly ICompetenciesService competenciesService;

        public CompetenciesController(ICompetenciesService competenciesService)
        {
            this.competenciesService = competenciesService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Json(competenciesService.GetAll());
        }

        [HttpGet("initialize")]
        public void Initialize()
        {
            competenciesService.RefreshExcel();
        }
    }
}