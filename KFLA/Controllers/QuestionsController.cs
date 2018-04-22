using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KFLA.Controllers
{
    public class QuestionsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
