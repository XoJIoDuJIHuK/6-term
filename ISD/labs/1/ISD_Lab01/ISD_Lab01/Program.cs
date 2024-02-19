using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
var app = builder.Build();
app.UseStaticFiles();
app.UseRouting();
app.MapControllers();
app.MapRazorPages();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});
const string XYZ = "TOV";
const string task1Path = "xd." + XYZ;

app.MapGet(task1Path, async context =>
{
    string? ParmA = context.Request.Query.First(q => q.Key == "ParmA").Value;
    string? ParmB = context.Request.Query.First(q => q.Key == "ParmB").Value;
    if (ParmA == null || ParmB == null)
    {
        await context.Response.WriteAsync($"Null parameters");
    }
    else
    {
        await context.Response.WriteAsync($"GET-Http-{XYZ}:ParmA = {ParmA},ParmB = {ParmB}");
    }
});
app.MapPost(task1Path, async context =>
{
    await HandleRequestWithBodyAsync(context, "POST", ReturnParameters);
});
app.MapPut(task1Path, async context =>
{
    await HandleRequestWithBodyAsync(context, "PUT", ReturnParameters);
});
app.MapPost($"4.{XYZ}", async context =>
{
    await HandleRequestWithBodyAsync(context, "POST", SumParameters);
});
app.MapMethods($"5.{XYZ}", new[] { "GET", "POST" }, async context =>
{
    await HandleTwoMethods(context, "5.html");
});
app.MapMethods($"6.{XYZ}", new[] { "GET", "POST" }, async context =>
{
    context.Response.Headers.ContentType = "text/html";
    string htmlText = File.ReadAllText($"D:\\6sem\\ISD\\labs\\1\\6.html");
    if (context.Request.Method == "POST")
    {
        string result = string.Empty;
        using (StreamReader reader = new(context.Request.Body, Encoding.UTF8))
        {
            string stringBody = await reader.ReadToEndAsync();
            Parameters requestBody;
            try
            {
                requestBody = JsonSerializer.Deserialize<Parameters>(stringBody, new JsonSerializerOptions { IncludeFields = true });
            }
            catch
            {
                requestBody = null;
            }
            if (requestBody == null)
            {
                result = $"Null parameters";
            }
            else
            {
                result = MulParameters(requestBody.ParmA, requestBody.ParmB, string.Empty);
            }
        }
        htmlText = htmlText.Replace("##XD##", result);
    }
    await context.Response.WriteAsync(htmlText);
});

static async Task HandleRequestWithBodyAsync(HttpContext context, string method, Func<string, string, string, string> func)
{
    using (StreamReader reader = new(context.Request.Body, Encoding.UTF8))
    {
        string stringBody = await reader.ReadToEndAsync();
        Parameters requestBody;
        try
        {
            requestBody = JsonSerializer.Deserialize<Parameters>(stringBody, new JsonSerializerOptions { IncludeFields = true });
        }
        catch
        {
            requestBody = new Parameters("", "");
        }
        if (requestBody == null)
        {
            await context.Response.WriteAsync($"Null parameters");
        }
        else
        {
            await context.Response.WriteAsync(func(requestBody.ParmA, requestBody.ParmB, method));
        }
    }
}
static string ReturnParameters(string a, string b, string method)
{
    return $"{method}-Http-{XYZ}:ParmA = {a},ParmB = {b}";
}
static string SumParameters(string a, string b, string xd)
{
    try
    {
        return (int.Parse(a) + int.Parse(b)).ToString();
    }
    catch
    {
        return "not a number xd";
    }
}
static string MulParameters(string a, string b, string xd)
{
    try
    {
        return (int.Parse(a) * int.Parse(b)).ToString();
    }
    catch
    {
        return "not a number xd";
    }
}
static async Task HandleTwoMethods(HttpContext context, string page)
{
    if (context.Request.Method == "GET")
    {
        context.Response.Headers.ContentType = "text/html";
        await context.Response.WriteAsync(File.ReadAllText($"D:\\6sem\\ISD\\labs\\1\\{page}"));
    }
    else if (context.Request.Method == "POST")
    {
        await HandleRequestWithBodyAsync(context, "POST", MulParameters);
    }
}


app.Run();


public class Parameters
{
    public string? ParmA;
    public string? ParmB;

    public Parameters(string ParmA, string ParmB)
    {
        this.ParmA = ParmA;
        this.ParmB = ParmB;
    }
}

[Route("[controller]")]
public class FormController : Controller
{
    public FormController()
    {
        
    }
    static string MulParameters(string a, string b)
    {
        try
        {
            return (int.Parse(a) * int.Parse(b)).ToString();
        }
        catch
        {
            return "not a number xd";
        }
    }
    private const string resultPlaceholder = "##XD##";

    [HttpPost]
    [Route("GetResult")]
    public IActionResult GetResult(int ParmA, int ParmB)
    {
        ViewBag.Result = MulParameters(ParmA.ToString(), ParmB.ToString());
        return View();
    }
}