namespace KFLA.Persistence.MongoDB

    open KFLA.Contract.Services

    type IMongoCompetenciesService = 
        inherit ICompetenciesService
        inherit ICompetenciesWriteService

    type IDBSettings = 
        abstract member DatabaseName : string with get, set
        abstract member ConnectionString : string with get, set

    type DBSettings() =
        member val ConnectionString: string = null with get, set
        member val DatabaseName: string = null with get, set
        interface IDBSettings with
            member __.ConnectionString
                with get () = __.ConnectionString
                and set v = __.ConnectionString <- v 
            member __.DatabaseName
                with get () = __.DatabaseName
                and set v = __.DatabaseName <- v
