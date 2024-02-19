using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ASPCMVC03.Models;

namespace ASPCMVC03.Controllers;

public class StartController : Controller
{
    private readonly ILogger<StartController> _logger;

    public StartController(ILogger<StartController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult One()
    {
        return View();
    }

    public IActionResult Two()
    {
        return View();
    }

    public IActionResult Three()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
