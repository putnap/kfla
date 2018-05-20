import { Question, QuestionJSON } from "./Question";
import { Cluster, ClusterJSON } from "./Cluster";
import { Factor, FactorJSON } from "./Factor";
import { observable, computed, action } from 'mobx';
import { Evaluation } from "./Evaluation";

interface CompetencyJSON {
    ID: number;
    Name: string;
    Description: string;
    ClusterID: number;
    FactorID: number;
    Cluster: ClusterJSON;
    Factor: FactorJSON;
    Questions: QuestionJSON[];
    IsSelected: boolean;
    IsEvaluated: boolean;
}

export class Competency {
    ID: number;
    Name: string;
    Description: string;
    ClusterID: number;
    FactorID: number;
    LessSkilled: string;
    Skilled: string;
    Talented: string;
    OverusedSkill: string;
    Cluster: Cluster;
    Factor: Factor;
    Questions: Question[];
    Evaluation: Evaluation;
    @observable IsSelected: boolean;
    @observable IsEvaluated: boolean;

    @action toggleSelection() {
        this.IsSelected = !this.IsSelected;
    }

    @computed get selectedQuestions(): Question[] {
        return this.Questions.filter(question => question.IsSelected);
    }

    static fromJSON(json: CompetencyJSON | string): Competency {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, Competency.reviver);
        } else {
            // create an instance of the class
            let user = Object.create(Competency.prototype);
            // copy all the fields from the json object
            return Object.assign(user, json, {
                // convert fields that need converting
                Cluster: Cluster.fromJSON(json.Cluster),
                Factor: Factor.fromJSON(json.Factor),
                Questions: json.Questions.map(questionJSON => Question.fromJSON(questionJSON)),
            });
        }
    }

    static reviver(key: string, value: any): any {
        return key === "" ? Competency.fromJSON(value) : value;
    }
}