import { observable } from 'mobx';
import { Stopper } from './Stopper';

export interface StopperClusterJSON {
    ID: string;
    Name: string;
}

export class StopperCluster {
    constructor(id: string, name: string) {
        this.ID = id;
        this.Name = name;
        this.Stoppers = [];
    }
    ID: string;
    Name: string;
    Stoppers: Stopper[];

    static fromJSON(json: StopperClusterJSON | string): StopperCluster {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, StopperCluster.reviver);
        } else {
            // create an instance of the class
            let user = Object.create(StopperCluster.prototype);
            // copy all the fields from the json object
            return Object.assign(user, json, {
                Stoppers: []
            });
        }
    }

    static reviver(key: string, value: any): any {
        return key === "" ? StopperCluster.fromJSON(value) : value;
    }
}