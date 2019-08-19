import { observable } from 'mobx';
import { Cluster } from "./Cluster";

export interface FactorJSON {
    ID: string;
    Name: string;
}

export class Factor {
    constructor(id: string, name: string) {
        this.ID = id;
        this.Name = name;
        this.Clusters = [];
    }
    ID: string;
    Name: string;
    @observable Clusters: Cluster[];

    static fromJSON(json: FactorJSON | string): Factor {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, Factor.reviver);
        } else {
            // create an instance of the class
            let user = Object.create(Factor.prototype);
            // copy all the fields from the json object
            return Object.assign(user, json, {
                Clusters: []
            });
        }
    }

    static reviver(key: string, value: any): any {
        return key === "" ? Factor.fromJSON(value) : value;
    }
}