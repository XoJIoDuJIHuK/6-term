using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ASPCMVC06.Models;

namespace ASPCMVC06.Controllers;

public class TMResearchController : Controller
{
    private readonly ILogger<TMResearchController> _logger;

    public TMResearchController(ILogger<TMResearchController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    public ActionResult M01(string id)
    {
        return Content("GET:M01 " + id);
    }

    public ActionResult M02(string id)
    {
        return Content("GET:M02 " + id);
    }

    public ActionResult M03(string id)
    {
        return Content("GET:M03 " + id);
    }

    public ActionResult MXX()
    {
        return Content("GET:MXX");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
