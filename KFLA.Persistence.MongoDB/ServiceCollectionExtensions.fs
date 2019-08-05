namespace KFLA.Persistence.MongoDB

    open Microsoft.Extensions.DependencyInjection
    open Microsoft.Extensions.Configuration
    open Microsoft.Extensions.Options
    open System.Runtime.CompilerServices
    open MongoDB.Driver

    [<Extension>]
    type ServiceCollectionExtensions () =
        [<Extension>]
        static member inline ConfigureDB(services: IServiceCollection, config : IConfiguration) : IServiceCollection = 
            services
                .Configure<DBSettings>(config.GetSection("DBSettings"))
                .AddSingleton<IDBSettings, DBSettings>(fun provider -> provider.GetRequiredService<IOptions<DBSettings>>().Value) 
                .AddSingleton<IMongoDatabase>(fun provider -> 
                    let settings = provider.GetRequiredService<IDBSettings>()
                    MongoClient(settings.ConnectionString).GetDatabase(settings.DatabaseName))


