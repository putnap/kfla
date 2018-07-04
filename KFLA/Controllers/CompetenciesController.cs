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
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace KFLA.API
{
    [Produces("application/json")]
    [Route("api/competencies")]
    public class CompetenciesController : Controller
    {
        private readonly ICompetenciesService competenciesService;
        private readonly IConfiguration configuration;

        public CompetenciesController(ICompetenciesService competenciesService, IConfiguration configuration)
        {
            this.competenciesService = competenciesService;
            this.configuration = configuration;
        }

        [HttpGet("getCompetencies")]
        public IActionResult GetCompetencies()
        {
            return Json(competenciesService.GetCompetencies());
        }

        [HttpGet("getStoppers")]
        public IActionResult GetStoppers()
        {
            return Json(competenciesService.GetStoppers());
        }

        [HttpPost("login")]
        public bool Login([FromBody]string password)
        {
            return configuration["QuestionairePassword"] == password;
        }

        [HttpGet("refresh")]
        public void Refresh()
        {
            competenciesService.RefreshExcel();
        }
    }
}