﻿using System;
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

        [HttpGet("initialize")]
        public void Initialize()
        {
            competenciesService.RefreshExcel();
        }

        [HttpGet("submit")]
        public ActionResult<string> SubmitEvaluation(string evaluations)
        {
            var data = Convert.FromBase64String(evaluations);
            var decodedString = Encoding.UTF8.GetString(data);

            var evals2 = JsonConvert.DeserializeObject<List<EvaluationDto>>(decodedString);

            //var data = Convert.FromBase64String("W3siaSI6MCwiYyI6WzEsMTUsMzUsMjMsMTIsMjMsMzQsMTIsMjQsMyw2LDhdfSx7ImkiOjEsImMiOlsyLDQsMSwxNSwzNSwyMywxMiwyMywzNCwxMiwyNCwzLDYsOF19LHsiaSI6MiwiYyI6WzUsMSwxNSwzNSwyMywxMiwyMywzNCwxMiwyNCwzLDYsOF19XQ==");
            //var decodedString = Encoding.UTF8.GetString(data);

            //var evals2 = JsonConvert.DeserializeObject<List<EvaluationDto>>(decodedString);

            return ActionResult<string>.Success("Success");
        }
    }
}