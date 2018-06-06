import { observable } from 'mobx';
import { StopperTypeJSON, StopperType } from './StopperType';

export interface StopperJSON {
    ID: number;
    Name: string;
    Problem: string;
    NotProblem: string;
    StopperType: StopperTypeJSON;
}

export class Stopper {
    ID: number;
    Name: string;
    Problem: string;
    NotProblem: string;
    StopperType: StopperType;

    static fromJSON(json: StopperJSON | string): Stopper {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, Stopper.reviver);
        } else {
            // create an instance of the class
            let user = Object.create(Stopper.prototype);
            // copy all the fields from the json object
            return Object.assign(user, json, {
                StopperType: StopperType.fromJSON(json.StopperType)
            });
        }
    }

    static reviver(key: string, value: any): any {
        return key === "" ? Stopper.fromJSON(value) : value;
    }
}