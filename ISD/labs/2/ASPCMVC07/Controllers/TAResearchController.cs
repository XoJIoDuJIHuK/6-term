using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ASPCMVC07.Models;

namespace ASPCMVC07.Controllers;

[Route("it")]
public class TAResearchController : Controller
{
    private readonly ILogger<TAResearchController> _logger;

    public TAResearchController(ILogger<TAResearchController> logger)
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

[HttpGet("{n:int}/{str}")]
    public IActionResult HandleNString(int n, string str)
    {
        return Content($"GET:M04:/{n}/{str}");
    }

    [HttpGet("{b:bool}/{letters:alpha}")]
    [HttpPost("{b:bool}/{letters:alpha}")]
    public IActionResult HandleBLetters(bool b, string letters)
    {
        return Content($"{HttpContext.Request.Method}:M05:/{b}/{letters}");
    }

    [HttpGet("{f:float}/{str:length(2,5)}")]
    [HttpDelete("{f:float}/{str:length(2,5)}")]
    public IActionResult HandleFString(float f, string str)
    {
        return Content($"{HttpContext.Request.Method}:M06:/{f}/{str}");
    }

    [HttpPut("{letters:length(3,7)}/{n:int:range(100,200)}/")]
    public IActionResult HandleLettersN(string letters, int n)
    {
        return Content($"PUT:M07:/{letters}/{n}");
    }

    [HttpPost("{mail:regex([[\\w\\d]]+@[[\\w\\d]]+\\.[[\\w\\d]]+)}")]
    public IActionResult HandleMail(string mail)
    {
        return Content($"POST:M08:/{mail}");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
