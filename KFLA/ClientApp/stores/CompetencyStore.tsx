import { observable, computed, action, runInAction } from 'mobx';
import { encode, decode } from 'base-64';
import { Competency } from '../models/Competency';
import { Evaluation } from '../models/Evaluation';
import { Factor } from '../models/Factor';
import { Question } from '../models/Question';

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

    @computed get selectedCompetencies(): Competency[] {
        return this.competencies.filter(o => o.IsSelected && o.selectedQuestions.length > 0);
    }

    @computed get questionaireReady(): boolean {
        return this.selectedCompetencies.length > 0;
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
        this.competencies.forEach(o => {
            o.Evaluation = null;
            o.IsEvaluated = false;
        });
        this.evaluations.forEach(o => o.Competencies = []);
    }

    @action resetQuestionaire() {
        this.competencies.forEach(o => {
            o.Questions.map(q => q.IsSelected = true);
            o.IsSelected = false;
        });
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
                }), 1500);
            });
    }

    groupCompetencies(competencies: Competency[]): Factor[] {
        const factors: Factor[] = [];
        competencies.forEach(competency => {
            let factor = competency.Factor;
            let cluster = competency.Cluster;
            if (factors.filter(f => f.ID == competency.Factor.ID).length == 0)
                factors.push(factor);
            else
                factor = factors.filter(f => f.ID == competency.Factor.ID)[0];

            if (factor.Clusters.filter(c => c.ID == cluster.ID).length == 0)
                factor.Clusters.push(cluster);
            else
                cluster = factor.Clusters.filter(c => c.ID == cluster.ID)[0];

            if (cluster.Competencies.filter(c => c.ID == competency.ID).length == 0)
                cluster.Competencies.push(competency);
        });
        return factors;
    }
}



