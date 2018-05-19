export interface QuestionJSON {
    ID: number;
    QuestionContent: string;
}

export class Question {
    ID: number;
    QuestionContent: string;
    Hide: boolean;

    static fromJSON(json: QuestionJSON | string): Question {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, Question.reviver);
        } else {
            // create an instance of the class
            let user = Object.create(Question.prototype);
            // copy all the fields from the json object
            return Object.assign(user, json);
        }
    }

    static reviver(key: string, value: any): any {
        return key === "" ? Question.fromJSON(value) : value;
    }
}