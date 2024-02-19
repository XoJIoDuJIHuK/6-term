using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ASPCMVC05.Models;

namespace ASPCMVC05.Controllers;

public class ParmController : Controller
{
    private readonly ILogger<ParmController> _logger;

    public ParmController(ILogger<ParmController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index(string id)
    {
        ViewBag.id = id;
        return View();
    }

    public IActionResult Uri1(int id)
    {
        ViewBag.id = id;
        return View();
    }

    public IActionResult Uri2(int? id)
    {
        ViewBag.id = id;
        return View();
    }

    public IActionResult Uri3(float id)
    {
        ViewBag.id = id;
        return View();
    }

    public IActionResult Uri4(DateTime id)
    {
        ViewBag.id = id;
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
