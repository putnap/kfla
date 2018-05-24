import { Competency } from "ClientApp/models/Competency";
import { observable, computed, action } from 'mobx';
import { IconName } from "@fortawesome/fontawesome-svg-core";

export class Evaluation {

    constructor(id: number, name: string, limit: number, color: string, icon: IconName) {
        this.ID = id;
        this.Name = name;
        this.Limit = limit;
        this.Color = color;
        this.Icon = icon;
    }
    ID: number;
    Name: string;
    Limit: number;
    Color: string;
    Icon: IconName;
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
}