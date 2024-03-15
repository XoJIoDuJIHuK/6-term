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
    #region M01
    endpoints.MapControllerRoute(
        name: "m01",
        pattern: "/{xd=MResearch}/{xdd=M01}/{id:int:range(1,1)=1}",
        constraints: new { xd = "^MResearch$", xdd = "^M01$" },
        defaults: new { controller = "TMResearch", action = "M01" }
    );

    endpoints.MapControllerRoute(
        name: "v2m01",
        pattern: "/V2/MResearch/M01",
        defaults: new { controller = "TMResearch", action = "M01" }
    );

    endpoints.MapControllerRoute(
        name: "v3m01",
        pattern: "/V3/MResearch/{id}/M01",
        defaults: new { controller = "TMResearch", action = "M01" }
    );
    #endregion

    #region M02
    endpoints.MapControllerRoute(
        name: "m02",
        pattern: "/V2/{xd=MResearch}/{xdd=M02}",
        constraints: new { xd = "^MResearch$", xdd = "^M02$" },
        defaults: new { controller = "TMResearch", action = "M02" }
    );

    endpoints.MapControllerRoute(
        name: "mResearchM02",
        pattern: "/MResearch/M02",
        defaults: new { controller = "TMResearch", action = "M02" }
    );

    endpoints.MapControllerRoute(
        name: "v3mResearchStringM02",
        pattern: "/V3/MResearch/{id}/M02",
        defaults: new { controller = "TMResearch", action = "M02" }
    );
    #endregion

    #region M03
    endpoints.MapControllerRoute(
        name: "m03",
        pattern: "/V3/{xd=MResearch}/{id}/{xdd=M03}",
        constraints: new { xd = "^MResearch$", xdd = "^M03$" },
        defaults: new { controller = "TMResearch", action = "M03" }
    );
    #endregion

    #region M04
    endpoints.MapControllerRoute(
        name: "any",
        pattern: "{*path}",
        defaults: new { controller = "TMResearch", action = "MXX" }
    );
    #endregion
});

app.Run();
