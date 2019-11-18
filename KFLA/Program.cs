using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Sinks.Elasticsearch;
using System;

namespace KFLA
{
    public class Program
    {
        public static void Main(string[] args) =>
            BuildWebHost(args).Run();

        public static IHost BuildWebHost(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSerilog((context, config) =>
                {
                    var elasticUri = context.Configuration.GetValue<string>("ElasticSearch:Uri");
                    config
                        .Enrich.FromLogContext()
                        .WriteTo.Console()
                        .WriteTo.Elasticsearch(new ElasticsearchSinkOptions(new Uri(elasticUri))
                        {
                            AutoRegisterTemplate = true
                        });
                })
                .ConfigureWebHostDefaults(builder =>
                {
                    builder.UseStartup<Startup>();
                })
                .Build();
    }
}
