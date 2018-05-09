import { Competency } from "ClientApp/models/Competency";
import { observable, computed } from 'mobx';

export class Evaluation {

    constructor(id: number, name: string, limit: number) {
        this.ID = id;
        this.Name = name;
        this.Limit = limit;
        this.Competencies = [];
    }
    ID: number;
    Name: string;
    Limit: number;
    @observable Competencies: Competency[];
    @computed get evaluatedCompetences(): number {
        return this.Competencies.length;
    }
}