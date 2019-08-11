import { observable, computed, action, runInAction, autorun } from 'mobx';
import { Competency, CompetencyJSON } from '../models/Competency';
import { Evaluation, EvaluationJSON } from '../models/Evaluation';
import { Factor } from '../models/Factor';
import { Cluster } from '../models/Cluster';
import { LocalizationStore } from './LocalizationStore';

export class CompetencyStore {
    localizationStore: LocalizationStore;

    constructor(localizationStore: LocalizationStore) {
        this.localizationStore = localizationStore;

        autorun(() => {
            this.fetchLocalizedEvalutions(this.localizationStore.language);
            this.fetchLocalizedCompetencies(this.localizationStore.language);
        });
    }

    @observable evaluations: Evaluation[] = [];
    @observable competencies: Competency[] = [];
    @observable factors: Factor[] = [];
    @observable isLoaded: boolean;
    @observable isLoading: boolean;
    @observable loadingLanguage: string;
    @observable isAuthenticated: boolean = true;
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
        return this.evaluations.length > 0 && this.evaluations.every(o => o.evaluatedCompetences == o.Limit);
    }

    @action evaluateCompetency(competencyID: number, evaluation: Evaluation) {
        const competency = this.competencies.find(o => o.ID == competencyID);
        competency.Evaluation = evaluation;
        evaluation.Competencies.push(competency);
        competency.IsEvaluated = true;
    }

    @action evaluateCompetencyItem(competency: Competency, evaluation: Evaluation) {
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

    @action fetchEvaluations() {
        this.fetchLocalizedEvalutions(this.localizationStore.language);
    }

    @action fetchLocalizedEvalutions(lang: string) {
        if (lang) {
            fetch('api/evaluations', {
                headers: { 'Accept-Language': lang },
            })
                .then((response) => {
                    if (!response.ok) {
                        this.isLoading = false;
                        throw Error(response.statusText);
                    }
                    return response.text();
                })
                .then((data) => {
                    runInAction(() => {
                        const evaluationsJSON: EvaluationJSON[] = JSON.parse(data);
                        this.evaluations = evaluationsJSON.map(evaluationJSON => Evaluation.fromJSON(evaluationJSON));
                    })
                });
        }
    }

    @action fetchCompetencies() {
        this.fetchLocalizedCompetencies(this.localizationStore.language);
    }

    @action fetchLocalizedCompetencies(lang: string) {
        if (!this.isLoading && lang || lang != this.loadingLanguage) {
            this.competencies = [];
            this.loadingLanguage = lang;
            this.isLoaded = false;
            this.isLoading = true;
            fetch('api/competencies', {
                headers: { 'Accept-Language': lang },
            })
                .then((response) => {
                    if (!response.ok) {
                        this.isLoading = false;
                        throw Error(response.statusText);
                    }

                    return response.text();
                })
                .then((data) => {
                    if (lang == this.loadingLanguage) {
                        runInAction(() => {
                            const competenciesJSON: CompetencyJSON[] = JSON.parse(data);
                            this.competencies = competenciesJSON.map(competencyJSON => Competency.fromJSON(competencyJSON));
                            this.factors = this.groupCompetencies(this.competencies);
                            this.isLoading = false;
                            this.isLoaded = true;
                        });
                    }
                });
        }
    }

    @action login(password: string, failCallback: () => void) {
        this.isAuthenticated = false;
        this.isAuthenticating = true;
        fetch('api/login', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(password)
        })
            .then((response) =>
                setTimeout(() => {
                    this.isAuthenticating = false;
                    this.isAuthenticated = response.status == 200;
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
            if (f1.ID > f2.ID) {
                return 1;
            }
            if (f1.ID < f2.ID) {
                return -1;
            }
            return 0;
        }));

        return factors.sort((f1, f2) => {
            if (f1.ID > f2.ID) {
                return 1;
            }
            if (f1.ID < f2.ID) {
                return -1;
            }
            return 0;
        });
    }
}



