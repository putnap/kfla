import { observable, computed, action, runInAction } from 'mobx';
import { encode, decode } from 'base-64';
import { Competency } from '../models/Competency';
import { Evaluation } from '../models/Evaluation';

let id = 0;
const DEFAULT_EVALUATIONS: Evaluation[] = [
    new Evaluation(++id, 'Evaluation 1', 5, '#499E6E'),
    new Evaluation(++id, 'Evaluation 2', 5, '#000000'),
    new Evaluation(++id, 'Evaluation 3', 5, '#929292')
]

class EvaluationDto {
    constructor(evalID: number, competencies: number[]) {
        this.ID = evalID;
        this.Competencies = competencies;
    }
    ID: number;
    Competencies: number[];
}

export class CompetencyStore {
    @observable evaluations: Evaluation[] = DEFAULT_EVALUATIONS;
    @observable competencies: Competency[] = [];
    @observable isLoaded: boolean;
    @observable isLoading: boolean;
    @observable isSubmitting: boolean;

    @computed get uneavluatedCompetencies(): Competency[] {
        return this.competencies.filter(o => !o.IsEvaluated);
    }

    @computed get evaluatedCompetencies(): Competency[] {
        return this.competencies.filter(o => o.IsEvaluated);
    }

    @computed get evaluationReady(): boolean {
        return this.evaluations.every(o => o.evaluatedCompetences == o.Limit);
    }

    @action evaluateCompetency(competencyID: number, evaluation: Evaluation) {
        const competency = this.competencies.filter(o => o.ID == competencyID)[0];
        competency.Evaluation = evaluation;
        evaluation.Competencies.push(competency);
        competency.IsEvaluated = true;
    }

    @action resetEvaluation() {
        this.competencies.map(o => {
            o.Evaluation = null;
            o.IsEvaluated = false;
        });
        this.evaluations.map(o => o.Competencies = []);
    }

    @action submitEvaluation(callback: () => void) {
        const dtos = this.evaluations.map(o => ({ i: o.ID, c: o.Competencies.map(o => o.ID) }));
        const string = encode(JSON.stringify(dtos));
        const json = decode(string);
        const newDtos = JSON.parse(json);

        callback();
        //console.log(newDtos[0].c);

        //fetch('api/Competencies/submit/?evaluations='+string)
        //    //{
        //    //    method: 'GET',
        //    //    headers: {
        //    //        'Accept': 'application/json',
        //    //        'Content-Type': 'applicati  on/json',
        //    //    },
        //    //    body: string
        //    //})
        //    .then((response) => {
        //        return response.text();
        //    })
        //    .then((data) => {
        //        console.log(data);
        //    });
    }

    @action decodeEvaluation(base64Evaluations: string) {

    }

    @action fetchCompetencies() { 
        this.competencies = [];
        this.isLoaded = false;
        this.isLoading = true;
        fetch('api/Competencies')
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                setTimeout(() =>
                    runInAction(() => {
                        const competenciesJSON: Competency[] = JSON.parse(data);
                        this.competencies = competenciesJSON.map(competencyJSON => Competency.fromJSON(competencyJSON));
                        this.isLoading = false;
                        this.isLoaded = true;
                }), 1000);
            });
    }
}



