using KFLA.Contract.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KFLA.Controllers
{
    public class CompetenciesController : Controller
    {
        private readonly ICompetenciesService competenciesService;

        public CompetenciesController(ICompetenciesService competenciesService)
        {
            this.competenciesService = competenciesService;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
