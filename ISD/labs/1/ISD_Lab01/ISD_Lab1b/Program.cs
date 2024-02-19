using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseWebSockets();

app.Map("/ws", WebSocketHandler.HandleWebSocketRequest);

app.MapGet("/", async context =>
{
    await context.Response.WriteAsync(File.ReadAllText("../../1b.html"));
});

app.Run();

public static class WebSocketHandler
{
    public static async Task HandleWebSocketRequest(HttpContext context)
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            var webSocket = await context.WebSockets.AcceptWebSocketAsync();

            try
            {
                // Send messages every two seconds to the client
                while (webSocket.State == WebSocketState.Open)
                {
                    var message = DateTime.Now.ToString("HH:mm:ss");
                    var buffer = Encoding.UTF8.GetBytes(message);
                    await webSocket.SendAsync(buffer, WebSocketMessageType.Text, endOfMessage: true, CancellationToken.None);
                    await Task.Delay(2000);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            finally
            {
                if (webSocket.State == WebSocketState.Open)
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
                webSocket.Dispose();
            }
        }
        else
        {
            context.Response.StatusCode = 400;
        }
    }
}