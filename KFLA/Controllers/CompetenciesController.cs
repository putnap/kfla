using KFLA.Contract.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace KFLA.API
{
    [Produces("application/json")]
    [Route("api")]
    public class CompetenciesController : Controller
    {
        private readonly ICompetenciesService competenciesService;
        private readonly IConfiguration configuration;

        public CompetenciesController(ICompetenciesService competenciesService, IConfiguration configuration)
        {
            this.competenciesService = competenciesService;
            this.configuration = configuration;
        }

        [HttpGet("competencies")]
        public IActionResult GetCompetencies([FromHeader(Name = "Accept-Language")] string language)
        {
            return Ok(competenciesService.GetCompetencies(language));
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

        [HttpPost("login")]
        public IActionResult Login([FromBody]string password)
        {
            if (configuration["QuestionairePassword"] == password)
                return Ok();

            return Unauthorized();
        }
    }
}