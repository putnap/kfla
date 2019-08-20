using KFLA.Contract.Services;
using KFLA.Persistence.MongoDB;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Threading.Tasks;

namespace KFLA.API
{
    [Produces("application/json")]
    [Route("api")]
    public class ApiController : Controller
    {
        private readonly ICompetenciesService competenciesService;
        private readonly IConfiguration configuration;
        private readonly IMongoCompetenciesService mongoCompetenciesService;

        public ApiController(ICompetenciesService competenciesService, IConfiguration configuration, IMongoCompetenciesService mongoCompetenciesService)
        {
            this.competenciesService = competenciesService;
            this.configuration = configuration;
            this.mongoCompetenciesService = mongoCompetenciesService;
        }

        [HttpGet("competencies")]
        public async Task<IActionResult> GetCompetencies([FromHeader(Name = "Accept-Language")] string language)
        {
            return Ok(await mongoCompetenciesService.GetCompetencies(language));
        }

        [HttpGet("evaluations")]
        public async Task<IActionResult> GetEvaluations([FromHeader(Name = "Accept-Language")] string language)
        {
            return Ok(await mongoCompetenciesService.GetEvaluations(language));
        }

        [HttpGet("stoppers")]
        public async Task<IActionResult> GetStoppers([FromHeader(Name = "Accept-Language")] string language)
        {
            return Ok(await mongoCompetenciesService.GetStoppers(language));
        }

        [HttpGet("strings")]
        public async Task<IActionResult> GetStrings([FromHeader(Name = "Accept-Language")] string language)
        {
            return Ok(await mongoCompetenciesService.GetStrings(language));
        }

        [HttpGet("languages")]
        public async Task<IActionResult> GetLanguages()
        {
            return Ok(await mongoCompetenciesService.GetLanguages());
        }

        [HttpPut("competencies")]
        public async Task<IActionResult> UpdateCompetencies(string language)
        {
            if (string.IsNullOrEmpty(language))
            {
                var languages = await mongoCompetenciesService.GetLanguages();
                foreach (var lang in languages)
                    await WriteCompetencies(lang);
            }
            else
            {
                await WriteCompetencies(language);
            }

            return NoContent();
        }

        [HttpPut("evaluations")]
        public async Task<IActionResult> UpdateEvaluations(string language)
        {
            if (string.IsNullOrEmpty(language))
            {
                var languages = await mongoCompetenciesService.GetLanguages();
                foreach (var lang in languages)
                    await WriteEvaluations(lang);
            }
            else
            {
                await WriteEvaluations(language);
            }

            return NoContent();
        }

        [HttpPut("stoppers")]
        public async Task<IActionResult> UpdateStoppers(string language)
        {
            if (string.IsNullOrEmpty(language))
            {
                var languages = await mongoCompetenciesService.GetLanguages();
                foreach (var lang in languages)
                    await WriteStoppers(lang);
            }
            else
            {
                await WriteStoppers(language);
            }

            return NoContent();
        }

        [HttpPut("strings")]
        public async Task<IActionResult> UpdateStrings(string language)
        {
            if (string.IsNullOrEmpty(language))
            {
                var languages = await mongoCompetenciesService.GetLanguages();
                foreach (var lang in languages)
                    await WriteStrings(lang);
            }
            else
            {
                await WriteStrings(language);
            }

            return NoContent();
        }

        [HttpPut("all")]
        public async Task<IActionResult> UpdateAll(string language)
        {
            if (string.IsNullOrEmpty(language))
            {
                var languages = await mongoCompetenciesService.GetLanguages();
                await Task.WhenAll(languages.Select(GetLanguageTask));
            }
            else
            {
                await GetLanguageTask(language);
            }

            return NoContent();
        }

        private Task GetLanguageTask(string language)
        {
            return Task.WhenAll(
                WriteStrings(language),
                WriteEvaluations(language), 
                WriteStoppers(language), 
                WriteCompetencies(language));
        }

        private async Task WriteStrings(string language)
        {
            var strings = await competenciesService.GetStrings(language);
            await mongoCompetenciesService.InsertStrings(language, strings);
        }

        private async Task WriteEvaluations(string language)
        {
            var evaluations = await competenciesService.GetEvaluations(language);
            await mongoCompetenciesService.InsertEvaluations(language, evaluations);
        }

        private async Task WriteStoppers(string language)
        {
            var stoppers = await competenciesService.GetStoppers(language);
            await mongoCompetenciesService.InsertStoppers(language, stoppers);
        }

        private async Task WriteCompetencies(string language)
        {
            var competencies = await competenciesService.GetCompetencies(language);
            await mongoCompetenciesService.InsertCompetencies(language, competencies);
        }
    }
}