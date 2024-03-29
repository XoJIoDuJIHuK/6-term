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

    public ActionResult V1(string ac, int xdd) {
        return ac == "M01" ? M01(xdd.ToString()) :
            ac == "M02" ? M02(xdd.ToString()) :
            MXX();
    }
    public ActionResult V2(string ac) {
        return ac == "M01" ? M01("") :
            ac == "M02" ? M02("") :
            MXX();
    }
    public ActionResult V3(string ac, string str) {
        return ac == "M01" ? M01(str) :
            ac == "M02" ? M02(str) :
            ac == "M03" ? M03(str) :
            MXX();
    }

    public ActionResult M01(string? id)
    {
        return Content("GET:M01 " + id);
    }

    public ActionResult M02(string? id)
    {
        return Content("GET:M02 " + id);
    }

    public ActionResult M03(string? id)
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
