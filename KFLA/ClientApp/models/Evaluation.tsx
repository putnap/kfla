import { Competency } from "ClientApp/models/Competency";

export class Evaluation {

    constructor(name: string, limit: number) {
        this.Name = name;
        this.Limit = limit;
        this.Competencies = [];
    }

    Name: string;
    Limit: number;
    Competencies: Competency[];
}