var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Home/Error");
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
	endpoints.MapControllerRoute(
		name: "V1",
		pattern: "{xd:regex(^MResearch$)?}/{ac=M01}/{xdd:int:range(1,1)=1}",
		defaults: new { controller = "TMResearch", action = "V1" });

	endpoints.MapControllerRoute(
		name: "V2",
		pattern: "V2/{xd:regex(^MResearch$)?}/{ac=M02}",
		defaults: new { controller = "TMResearch", action = "V2" });

	endpoints.MapControllerRoute(
		name: "V3",
		pattern: "V3/{xd:regex(^MResearch$)?}/{str?}/{ac=M03}",
		defaults: new { controller = "TMResearch", action = "V3" });

	endpoints.MapFallbackToController("MXX", "TMResearch");
});

app.Run();
