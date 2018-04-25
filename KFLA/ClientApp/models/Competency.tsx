import { Question } from "ClientApp/models/Question";
import { Cluster } from "ClientApp/models/Cluster";
import { Factor } from "ClientApp/models/Factor";

export class Competency {
    ID: number;
    Name: string;
    Description: string;
    ClusterID: number;
    FactorID: number;
    Cluster: Cluster;
    Factor: Factor;
    Questions: Question[];
    IsSelected: boolean;
}