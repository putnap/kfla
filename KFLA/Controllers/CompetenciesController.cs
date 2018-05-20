using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KFLA.Contract;
using KFLA.Contract.Contracts;
using KFLA.Contract.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

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

        [HttpGet("refresh")]
        public void Refresh()
        {
            competenciesService.RefreshExcel();
        }
    }
}