import { Cluster } from "./Cluster";

export interface FactorJSON {
    ID: number;
    Name: string;
}

export class Factor {
    ID: number;
    Name: string;
    Clusters: Cluster[];

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