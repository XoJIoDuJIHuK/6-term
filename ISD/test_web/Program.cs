var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/{message}", (string message) => "Message " + message);
app.MapGet("/hello", () => "Default hello endpoint");

app.Run();
