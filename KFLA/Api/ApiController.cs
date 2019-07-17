using KFLA.Contract.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;

namespace KFLA.API
{
    [Produces("application/json")]
    [Route("api")]
    public class ApiController : Controller
    {
        private readonly ICompetenciesService competenciesService;
        private readonly IConfiguration configuration;

        public ApiController(ICompetenciesService competenciesService, IConfiguration configuration)
        {
            this.competenciesService = competenciesService;
            this.configuration = configuration;
        }

        [HttpGet("competencies")]
        public IActionResult GetCompetencies([FromHeader(Name = "Accept-Language")] string language)
        {
            return Ok(competenciesService.GetCompetencies(language));
        }

        [HttpGet("competencies/{competencyId}")]
        public IActionResult GetCompetency([FromHeader(Name = "Accept-Language")] string language, int competencyId)
        {
            return Ok(competenciesService.GetCompetency(language, competencyId));
        }

        [HttpGet("stoppers/{stopperId}")]
        public IActionResult GetStopper([FromHeader(Name = "Accept-Language")] string language, int stopperId)
        {
            return Ok(competenciesService.GetStopper(language, stopperId));
        }

        [HttpGet("stoppers")]
        public IActionResult GetStoppers([FromHeader(Name = "Accept-Language")] string language)
        {
            return Ok(competenciesService.GetStoppers(language));
        }

        [HttpGet("strings")]
        public IActionResult GetStrings([FromHeader(Name = "Accept-Language")] string language)
        {
            return Ok(competenciesService.GetStrings(language));
        }

        [HttpGet("evaluations")]
        public IActionResult GetEvaluations([FromHeader(Name = "Accept-Language")] string language)
        {
            return Ok(competenciesService.GetEvaluations(language));
        }

        [HttpGet("languages")]
        public IActionResult GetLanguages()
        {
            return Ok(competenciesService.GetLanguages());
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody]string password)
        {
            if (configuration["QuestionairePassword"] == password)
                return Ok();

            return Unauthorized();
        }
    }
}