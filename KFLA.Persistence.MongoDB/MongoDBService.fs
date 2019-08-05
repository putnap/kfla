namespace KFLA.Persistence.MongoDB

    open System.Collections.Generic
    open System.Threading.Tasks
    open MongoDB.Driver
    open MongoDB.Bson.Serialization.Conventions
    open KFLA.Contract

    module MongoDBService = 

        let public registerConvention () = 
            let pack = ConventionPack()
            IgnoreExtraElementsConvention(true) |> pack.Add
            ConventionRegistry.Register("kfla", pack, fun t -> t.FullName.StartsWith("KFLA."))

        let internal clearCollection<'T> (collection: IMongoCollection<'T>) = 
            collection.DeleteManyAsync(fun _ -> true) |> Async.AwaitTask |> ignore

        let internal getLocalizedCollectionName<'T> (language: string) : string =
            sprintf "%s_%s" language typeof<'T>.Name
            
        let internal readItems<'T> (database: IMongoDatabase) (language: string) = 
            async {
                let collection = language |> getLocalizedCollectionName<'T> |> database.GetCollection<'T>
                use! cursor = collection.FindAsync<'T>(fun _ -> true) |> Async.AwaitTask
                return cursor.ToList() |> Seq.map (fun i -> i)
            } |> Async.StartAsTask

        let internal insertItems<'T> (database: IMongoDatabase) (language: string) (items: seq<'T>) =
            async {
                let collection = language |> getLocalizedCollectionName<'T> |> database.GetCollection<'T>
                collection |> clearCollection<'T>
                items |> collection.InsertManyAsync |> Async.AwaitTask |> ignore
            } |> Async.StartAsTask :> Task

    type MongoDBService (database: IMongoDatabase) = 

        interface IMongoCompetenciesService with
            member __.GetCompetencies(language: string): Task<IEnumerable<Competency>> = 
                MongoDBService.readItems<Competency> database language

            member __.GetEvaluations(language: string): Task<IEnumerable<Evaluation>> = 
                MongoDBService.readItems<Evaluation> database language
                
            member __.GetStoppers(language: string): Task<IEnumerable<Stopper>> = 
                MongoDBService.readItems<Stopper> database language
                                
            member __.GetStrings(language: string): Task<IEnumerable<LocalizedString>> = 
                MongoDBService.readItems<LocalizedString> database language

            member __.GetLanguages(): Task<IEnumerable<string>> = 
                [ "cn"; "de"; "en"; "es"; "jp" ] |> Seq.ofList |> Task.FromResult

            member __.InsertCompetencies(language: string, competencies: IEnumerable<Competency>): Task = 
                MongoDBService.insertItems database language competencies

            member __.InsertStoppers(language: string, stoppers: IEnumerable<Stopper>): Task = 
                MongoDBService.insertItems database language stoppers

            member __.InsertEvaluations(language: string, evaluations: IEnumerable<Evaluation>): Task = 
                MongoDBService.insertItems database language evaluations

            member __.InsertStrings(language: string, localizedStrings: IEnumerable<LocalizedString>): Task = 
                MongoDBService.insertItems database language localizedStrings
        
