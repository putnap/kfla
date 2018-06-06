import { observable } from 'mobx';
import { Stopper } from './Stopper';

export interface StopperTypeJSON {
    ID: number;
    Name: string;
}

export class StopperType {
    constructor(id: number, name: string) {
        this.ID = id;
        this.Name = name;
        this.Stoppers = [];
    }
    ID: number;
    Name: string;
    Stoppers: Stopper[];

    static fromJSON(json: StopperTypeJSON | string): StopperType {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, StopperType.reviver);
        } else {
            // create an instance of the class
            let user = Object.create(StopperType.prototype);
            // copy all the fields from the json object
            return Object.assign(user, json, {
                Stoppers: []
            });
        }
    }

    static reviver(key: string, value: any): any {
        return key === "" ? StopperType.fromJSON(value) : value;
    }
}