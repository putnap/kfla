﻿import { observable, computed, action, runInAction } from 'mobx';
import { Competency, CompetencyJSON } from '../models/Competency';
import { Evaluation } from '../models/Evaluation';
import { Factor } from '../models/Factor';
import { Question } from '../models/Question';
import { Cluster } from '../models/Cluster';

let id = 0;
const DEFAULT_EVALUATIONS: Evaluation[] = [
    new Evaluation(++id, 'Would describe', 12, '#007e3a', 'plus-circle', 'This would be true all or the majority of the time'),
    new Evaluation(++id, 'Might describe', 14, '#000000', 'circle', 'This would be true some of the time or may be a mixture of would and would not describe'),
    new Evaluation(++id, 'Would Not describe', 12, '#D34836', 'minus-circle', 'This would be seldom or never true')
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
    @observable factors: Factor[] = [];
    @observable isLoaded: boolean;
    @observable isLoading: boolean;
    @observable isAuthenticated: boolean;
    @observable isAuthenticating: boolean;

    @computed get uneavluatedCompetencies(): Competency[] {
        return this.competencies.filter(o => !o.IsEvaluated);
    }

    @computed get evaluatedCompetencies(): Competency[] {
        return this.competencies.filter(o => o.IsEvaluated);
    }

    @computed get selectedCompetencies(): Competency[] {
        return this.competencies.filter(o => o.IsSelected && o.selectedQuestions.length);
    }

    @computed get questionaireReady(): boolean {
        return this.selectedCompetencies.length > 0;
    }

    @computed get evaluationReady(): boolean {
        return this.evaluations.every(o => o.evaluatedCompetences == o.Limit);
    }

    @action evaluateCompetency(competencyID: number, evaluation: Evaluation) {
        const competency = this.competencies.find(o => o.ID == competencyID);
        competency.Evaluation = evaluation;
        evaluation.Competencies.push(competency);
        competency.IsEvaluated = true;
    }

    @action resetEvaluation() {
        this.competencies.forEach(o => {
            o.Evaluation = null;
            o.IsEvaluated = false;
        });
        this.evaluations.forEach(o => o.Competencies.splice(0, o.Competencies.length));
    }

    @action resetQuestionaire() {
        this.competencies.forEach(o => {
            o.Questions.map(q => q.IsSelected = true);
            o.IsSelected = false;
        });
    }

    @action fetchCompetencies() {
        if (!this.isLoading) {
            this.competencies = [];
            this.isLoaded = false;
            this.isLoading = true;
            fetch('api/Competencies/getCompetencies')
                .then((response) => {
                    return response.text();
                })
                .then((data) => {
                    setTimeout(() =>
                        runInAction(() => {
                            const competenciesJSON: CompetencyJSON[] = JSON.parse(data);
                            this.competencies = competenciesJSON.map(competencyJSON => Competency.fromJSON(competencyJSON));
                            this.factors = this.groupCompetencies(this.competencies);
                            this.isLoading = false;
                            this.isLoaded = true;
                        }), 1500);
                });
        }
    }

    @action login(password: string, failCallback: () => void) {
        this.isAuthenticated = false;
        this.isAuthenticating = true;
        fetch('api/Competencies/login', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(password)
            })
            .then((response) => {
                return response.text();
            })
            .then((data) => 
                setTimeout(() => {
                    this.isAuthenticating = false;
                    this.isAuthenticated = JSON.parse(data);
                    if (!this.isAuthenticated)
                        failCallback();
                }, 750)
            );
    }

    @action groupCompetencies(competencies: Competency[]): Factor[] {
        const factors: Factor[] = [];
        competencies.forEach(competency => {
            let factor = new Factor(competency.Factor.ID, competency.Factor.Name);
            let cluster = new Cluster(competency.Cluster.ID, competency.Cluster.Name);
            if (!factors.some(f => f.ID == competency.Factor.ID))
                factors.push(factor);
            else
                factor = factors.find(f => f.ID == competency.Factor.ID);

            if (!factor.Clusters.some(c => c.ID == cluster.ID))
                factor.Clusters.push(cluster);
            else
                cluster = factor.Clusters.find(c => c.ID == cluster.ID);

            if (!cluster.Competencies.some(c => c.ID == competency.ID))
                cluster.Competencies.push(competency);
        });

        factors.forEach(o => o.Clusters = o.Clusters.sort((f1, f2) => {
            if (f1.Name > f2.Name) {
                return 1;
            }
            if (f1.Name < f2.Name) {
                return -1;
            }
            return 0;
        }));

        return factors.sort((f1, f2) => {
            if (f1.Name > f2.Name) {
                return 1;
            }
            if (f1.Name < f2.Name) {
                return -1;
            }
            return 0;
        });
    }
}



