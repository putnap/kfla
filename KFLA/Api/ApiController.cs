using KFLA.Contract.Services;
using KFLA.Persistence.MongoDB;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace KFLA.API
{
    [Produces("application/json")]
    [Route("api")]
    public class ApiController : Controller
    {
        private readonly ICompetenciesService _competenciesService;
        private readonly IMongoCompetenciesService _mongoCompetenciesService;

        public ApiController(ICompetenciesService competenciesService, IMongoCompetenciesService mongoCompetenciesService)
        {
            _competenciesService = competenciesService;
            _mongoCompetenciesService = mongoCompetenciesService;
        }

        [HttpGet("competencies")]
        public async Task<IActionResult> GetCompetencies([FromHeader(Name = "Accept-Language")] string language)
        {
            return Ok(await _mongoCompetenciesService.GetCompetencies(language));
        }

        [HttpGet("evaluations")]
        public async Task<IActionResult> GetEvaluations([FromHeader(Name = "Accept-Language")] string language)
        {
            return Ok(await _mongoCompetenciesService.GetEvaluations(language));
        }

        [HttpGet("stoppers")]
        public async Task<IActionResult> GetStoppers([FromHeader(Name = "Accept-Language")] string language)
        {
            return Ok(await _mongoCompetenciesService.GetStoppers(language));
        }

        [HttpGet("strings")]
        public async Task<IActionResult> GetStrings([FromHeader(Name = "Accept-Language")] string language)
        {
            var strings = await _mongoCompetenciesService.GetStrings(language);
            return Ok(strings.ToList());
        }

        [HttpGet("languages")]
        public async Task<IActionResult> GetLanguages()
        {
            return Ok(await _mongoCompetenciesService.GetLanguages());
        }

        [HttpPut("competencies")]
        public async Task<IActionResult> UpdateCompetencies(string language)
        {
            if (string.IsNullOrEmpty(language))
            {
                var languages = await _mongoCompetenciesService.GetLanguages();
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
                var languages = await _mongoCompetenciesService.GetLanguages();
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
                var languages = await _mongoCompetenciesService.GetLanguages();
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
                var languages = await _mongoCompetenciesService.GetLanguages();
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
                var languages = await _mongoCompetenciesService.GetLanguages();
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
            var strings = await _competenciesService.GetStrings(language);
            await _mongoCompetenciesService.InsertStrings(language, strings);
        }

        private async Task WriteEvaluations(string language)
        {
            var evaluations = await _competenciesService.GetEvaluations(language);
            await _mongoCompetenciesService.InsertEvaluations(language, evaluations);
        }

        private async Task WriteStoppers(string language)
        {
            var stoppers = await _competenciesService.GetStoppers(language);
            await _mongoCompetenciesService.InsertStoppers(language, stoppers);
        }

        private async Task WriteCompetencies(string language)
        {
            var competencies = await _competenciesService.GetCompetencies(language);
            await _mongoCompetenciesService.InsertCompetencies(language, competencies);
        }
    }
}