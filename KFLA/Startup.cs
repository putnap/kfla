using KFLA.Contract.Services;
using KFLA.Middleware;
using KFLA.Persistence.MongoDB;
using KFLA.Services.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;
using System.Text.Json;

namespace KFLA
{
    public class Startup
    {
        private readonly IHostEnvironment _hostEnvironment;

        public Startup(IConfiguration configuration, IHostEnvironment hostEnvironment)
        {
            Configuration = configuration;
            _hostEnvironment = hostEnvironment;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            MongoDBServiceModule.registerConvention();

            services
                .ConfigureDB(Configuration)
                .AddSingleton<ICompetenciesService, ExcelCompetenciesService>()
                .AddTransient<IMongoCompetenciesService, MongoDBService>()
                .AddSwaggerGen(options =>
                {
                    options.SwaggerDoc("all", new OpenApiInfo
                    {
                        Title = "all",
                        Version = "v1"
                    });
                });

            services
                .AddControllersWithViews()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.PropertyNamingPolicy = null;
                    options.JsonSerializerOptions.WriteIndented = true;
                });
        }

        public void Configure(IApplicationBuilder app)
        {
            if (_hostEnvironment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("../swagger/all/swagger.json", "all");
                options.EnableDeepLinking();
            });

            app.UseStaticFiles();
            app.UseRouting();
            app.UseMiddleware<NoCacheResponseMiddleware>();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapFallbackToController("Index", "Home");
            });
        }
    }
}
