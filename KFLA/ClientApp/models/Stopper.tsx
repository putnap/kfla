import { observable, computed, action } from 'mobx';
import { StopperClusterJSON, StopperCluster } from './StopperCluster';
import { QuestionJSON, Question } from './Question';

export interface StopperJSON {
    ID: number;
    Name: string;
    Problem: string;
    NotProblem: string;
    Questions: QuestionJSON[];
    Cluster: StopperClusterJSON;
}

export class Stopper {
    ID: number;
    Name: string;
    Problem: string;
    NotProblem: string;
    Cluster: StopperCluster;
    @observable Questions: Question[];
    @observable IsSelected: boolean;

    @action toggleSelection() {
        this.IsSelected = !this.IsSelected;
    }

    @computed get selectedQuestions(): Question[] {
        return this.Questions.filter(question => question.IsSelected);
    }

    static fromJSON(json: StopperJSON | string): Stopper {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, Stopper.reviver);
        } else {
            // create an instance of the class
            let user = Object.create(Stopper.prototype);
            // copy all the fields from the json object
            return Object.assign(user, json, {
                StopperType: StopperCluster.fromJSON(json.Cluster),
                Questions: json.Questions.map(questionJSON => Question.fromJSON(questionJSON)),
            });
        }
    }

    static reviver(key: string, value: any): any {
        return key === "" ? Stopper.fromJSON(value) : value;
    }
}