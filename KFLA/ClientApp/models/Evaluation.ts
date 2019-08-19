import { Competency } from "@Models/Competency";
import { observable, computed, action } from 'mobx';
import { IconName } from "@fortawesome/fontawesome-svg-core";

export interface EvaluationJSON {
    Name: string;
    Limit: number;
    Color: string;
    Icon: IconName;
    Tooltip: string;
}

export class Evaluation {

    constructor(name: string, limit: number, color: string, icon: IconName, tooltip: string) {
        this.Name = name;
        this.Limit = limit;
        this.Color = color;
        this.Icon = icon;
        this.Tooltip = tooltip;
    }
    Name: string;
    Limit: number;
    Color: string;
    Icon: IconName;
    Tooltip: string;
    @observable Competencies: Competency[] = [];
    @computed get evaluatedCompetences(): number {
        return this.Competencies.length;
    }

    static fromJSON(json: EvaluationJSON | string): Evaluation {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, Evaluation.reviver);
        } else {
            // create an instance of the class
            let user = Object.create(Evaluation.prototype);
            // copy all the fields from the json object
            return Object.assign(user, json, {
                Competencies: []
            });
        }
    }

    static reviver(key: string, value: any): any {
        return key === "" ? Evaluation.fromJSON(value) : value;
    }
}