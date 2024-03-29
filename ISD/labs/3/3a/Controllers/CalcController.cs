using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using _3a.Models;

namespace _3a.Controllers;

public class CalcController : Controller
{
    private readonly ILogger<CalcController> _logger;

    public CalcController(ILogger<CalcController> logger)
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

    public IActionResult Sum(float x = 0, float y = 0)
    {
        ViewBag.x = x;
        ViewBag.y = y;
        ViewBag.press = "+";
        try {
            float z = x + y;
            if (z > float.MaxValue || z < float.MinValue)
            {
                throw new Exception("number out of bounds");
            }
            ViewBag.z = z;
            Console.WriteLine(ViewBag.z);
        } catch (Exception ex) {
            ViewBag.z = 0;
            ViewBag.Error = ex.ToString();
            return View("Index");
        }
        return View("Index");
    }

    public IActionResult Sub(float x = 0, float y = 0)
    {
        ViewBag.x = x;
        ViewBag.y = y;
        ViewBag.press = "-";
        try {
            float z = x - y;
            if (z > float.MaxValue || z < float.MinValue)
            {
                throw new Exception("number out of bounds");
            }
            ViewBag.z = z;
            Console.WriteLine(ViewBag.z);
        } catch (Exception ex) {
            ViewBag.z = 0;
            ViewBag.Error = ex.ToString();
            return View("Index");
        }
        return View("Index");
    }

    public IActionResult Mul(float x = 0, float y = 0)
    {
        ViewBag.x = x;
        ViewBag.y = y;
        ViewBag.press = "*";
        try {
            float z = x * y;
            if (z > float.MaxValue || z < float.MinValue)
            {
                throw new Exception("number out of bounds");
            }
            ViewBag.z = z;
            Console.WriteLine(ViewBag.z);
        } catch (Exception ex) {
            ViewBag.z = 0;
            ViewBag.Error = ex.ToString();
            return View("Index");
        }
        return View("Index");
    }

    public IActionResult Div(float x = 0, float y = 0)
    {
        ViewBag.x = x;
        ViewBag.y = y;
        ViewBag.press = "/";
        try {
            if (y == 0)
            {
                throw new Exception("division by zero");
            }
            float z = x / y;
            if (z > float.MaxValue || z < float.MinValue)
            {
                throw new Exception("number out of bounds");
            }
            ViewBag.z = z;
            Console.WriteLine(ViewBag.z);
        } catch (Exception ex) {
            ViewBag.z = 0;
            ViewBag.Error = ex.ToString();
            return View("Index");
        }
        return View("Index");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
