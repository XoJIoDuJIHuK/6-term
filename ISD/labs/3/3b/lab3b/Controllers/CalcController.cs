using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace lab3a_new.Controllers;

[Authorize(Roles = "Master,Employee")]
public class CalcController : Controller
{
    [HttpGet]
    [HttpPost]
    public IActionResult Index()
    {
        return View();
    }
    [HttpGet]
    [HttpPost]
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
    [HttpGet]
    [HttpPost]
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
    [HttpGet]
    [HttpPost]
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
    [HttpGet]
    [HttpPost]
    public IActionResult Div(float x = 0, float y = 1)
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
}