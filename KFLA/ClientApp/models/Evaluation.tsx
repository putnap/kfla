﻿import { Competency } from "ClientApp/models/Competency";
import { observable, computed, action } from 'mobx';
import { IconName } from "@fortawesome/fontawesome-svg-core";

export interface EvaluationJSON {
    ID: number;
    Name: string;
    Limit: number;
    Color: string;
    Icon: IconName;
    Tooltip: string;
}

export class Evaluation {

    constructor(id: number, name: string, limit: number, color: string, icon: IconName, tooltip: string) {
        this.ID = id;
        this.Name = name;
        this.Limit = limit;
        this.Color = color;
        this.Icon = icon;
        this.Tooltip = tooltip;
    }
    ID: number;
    Name: string;
    Limit: number;
    Color: string;
    Icon: IconName;
    Tooltip: string;
    @observable Competencies: Competency[] = [];
    @computed get evaluatedCompetences(): number {
        return this.Competencies.length;
    }

    @action removeCompetency(competency: Competency) {
        var index = this.Competencies.indexOf(competency, 0);
        if (index > -1) {
            this.Competencies.splice(index, 1);
        }
        competency.Evaluation = null;
        competency.IsEvaluated = false;
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