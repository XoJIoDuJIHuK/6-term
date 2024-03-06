using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ASPCMVC04.Models;
using System.Text.Json;
using System;

namespace ASPCMVC04.Controllers;

public class StatusController : Controller
{
    private readonly ILogger<StatusController> _logger;
    private readonly Random rand;

    public StatusController(ILogger<StatusController> logger)
    {
        _logger = logger;
        rand = new Random();
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult S200()
    {
        return StatusCode((int)(rand.NextInt64(100) + 200));
    }

    public IActionResult S300()
    {
        return StatusCode((int)(rand.NextInt64(100) + 300));
    }

    public IActionResult S500()
    {
        int zero = 0;
        // int xd = 1 / zero;
        return StatusCode((int)(rand.NextInt64(100) + 500));
    }

    //fetch("http://localhost:5003/Status/S300").then(r=>{console.log(r.status)})

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
