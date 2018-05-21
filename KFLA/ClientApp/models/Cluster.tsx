import { observable } from 'mobx';
import { Competency } from "./Competency";

export interface ClusterJSON {
    ID: number;
    Name: string;
}

export class Cluster {
    constructor(id: number, name: string) {
        this.ID = id;
        this.Name = name;
        this.Competencies = [];
    }
    ID: number;
    Name: string;
    @observable Competencies: Competency[];

    static fromJSON(json: ClusterJSON | string): Cluster {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, Cluster.reviver);
        } else {
            // create an instance of the class
            let user = Object.create(Cluster.prototype);
            // copy all the fields from the json object
            return Object.assign(user, json, {
                Competencies: []
            });
        }
    }

    static reviver(key: string, value: any): any {
        return key === "" ? Cluster.fromJSON(value) : value;
    }
}