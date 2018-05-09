import { Question } from "./Question";
import { Cluster } from "./Cluster";
import { Factor } from "./Factor";
import { observable, action } from 'mobx';

interface CompetencyJSON {
    ID: number;
    Name: string;
    Description: string;
    ClusterID: number;
    FactorID: number;
    Cluster: Cluster;
    Factor: Factor;
    Questions: Question[];
    IsSelected: boolean;
    IsEvaluated: boolean;
}

export class Competency implements CompetencyJSON {
    ID: number;
    Name: string;
    Description: string;
    ClusterID: number;
    FactorID: number;
    Cluster: Cluster;
    Factor: Factor;
    Questions: Question[];
    @observable IsSelected: boolean;
    @observable IsEvaluated: boolean;

    static fromJSON(json: CompetencyJSON | string): Competency {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, Competency.reviver);
        } else {
            // create an instance of the User class
            let user = Object.create(Competency.prototype);
            // copy all the fields from the json object
            return Object.assign(user, json, {
                // convert fields that need converting
                Questions: json.Questions.map(questionJSON => Question.fromJSON(questionJSON))
            });
        }
    }

    static reviver(key: string, value: any): any {
        return key === "" ? Competency.fromJSON(value) : value;
    }
}