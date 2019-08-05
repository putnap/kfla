import { Question, QuestionJSON } from "./Question";
import { Cluster, ClusterJSON } from "./Cluster";
import { Factor, FactorJSON } from "./Factor";
import { observable, computed, action } from 'mobx';
import { Evaluation } from "./Evaluation";
import { Tip } from "./Tip";


export interface CaseStudy {
    Type: string;
    Case: string;
}

export interface TimeToReflect {
    Statement: string;
    Suggestion: string;
}

export interface CompetencyJSON {
    ID: number;
    Name: string;
    Description: string;
    ClusterID: string;
    FactorID: string;
    Cluster: ClusterJSON;
    Factor: FactorJSON;
    Questions: QuestionJSON[];
    IsSelected: boolean;
    IsEvaluated: boolean;

    LessSkilled: string[];
    Skilled: string[];
    Talented: string[];
    OverusedSkill: string[];

    Context: string;
    Quotes: string[];
    Positioning: string;
    Causes: string[];
    CaseStudies: CaseStudy[];
    JobAssignments: string[];
    TimeToReflect: TimeToReflect[];
    LearnMore: string[];
    DeepDiveResources: string[];
    Tips: Tip[];
}

export class Competency {
    ID: number;
    Name: string;
    Description: string;
    ClusterID: string;
    FactorID: string;
    LessSkilled: string[];
    Skilled: string[];
    Talented: string[];
    OverusedSkill: string[];
    Cluster: Cluster;
    Factor: Factor;

    Context: string;
    Quotes: string[];
    Positioning: string;
    Causes: string[];
    CaseStudies: CaseStudy[];
    JobAssignments: string[];
    TimeToReflect: TimeToReflect[];
    LearnMore: string[];
    DeepDiveResources: string[];
    Tips: Tip[];

    @observable Questions: Question[];
    @observable Evaluation: Evaluation;
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