using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using KFLA.Contract.Services;
using Microsoft.AspNetCore.Mvc;

namespace KFLA.Controllers
{
    public class HomeController : Controller
    {
        private readonly ICompetenciesService competenciesService;

        public HomeController(ICompetenciesService competenciesService)
        {
            this.competenciesService = competenciesService;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
