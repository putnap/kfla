import axios from 'axios';
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
        return this.evaluations.length > 0 && this.evaluations.every(o => o.evaluatedCompetences === o.Limit);
    }

    @action resetEvaluation() {
        this.competencies.forEach(o => o.evaluateCompetency());
    }

    @action resetQuestionaire() {
        this.competencies.forEach(o => {
            o.Questions.map(q => q.IsSelected = true);
            o.IsSelected = false;
        });
    }

    @action async fetchEvaluations() {
        await this.fetchLocalizedEvalutions(this.localizationStore.language);
    }

    @action async fetchLocalizedEvalutions(lang: string) {
        if (lang) {

            try {
                const response = await axios.get<EvaluationJSON[]>('api/evaluations', {
                    headers: { 'Accept-Language': lang },
                });
                runInAction(() => {
                    this.evaluations = response.data.map(evaluationJSON => Evaluation.fromJSON(evaluationJSON));
                });
            }
            catch (error) {
                throw Error(error);
            }
        }
    }

    @action async fetchCompetencies() {
        await this.fetchLocalizedCompetencies(this.localizationStore.language);
    }

    @action async fetchLocalizedCompetencies(lang: string) {
        if ((!this.isLoading && lang) || lang !== this.loadingLanguage) {
            this.competencies = [];
            this.loadingLanguage = lang;
            this.isLoaded = false;
            this.isLoading = true;

            try {
                const response = await axios.get<CompetencyJSON[]>('api/competencies', {
                    headers: { 'Accept-Language': lang },
                });
                runInAction(() => {
                    this.competencies = response.data.map(competencyJSON => Competency.fromJSON(competencyJSON));
                    this.factors = this.groupCompetencies(this.competencies);
                    this.isLoading = false;
                    this.isLoaded = true;
                });
            }
            catch (error) {
                this.isLoading = false;
                throw Error(error);
            }
        }
    }

    @action groupCompetencies(competencies: Competency[]): Factor[] {
        const factors: Factor[] = [];
        competencies.forEach(competency => {
            let factor = new Factor(competency.Factor.ID, competency.Factor.Name);
            let cluster = new Cluster(competency.Cluster.ID, competency.Cluster.Name);
            if (!factors.some(f => f.ID === competency.Factor.ID))
                factors.push(factor);
            else
                factor = factors.find(f => f.ID === competency.Factor.ID);

            if (!factor.Clusters.some(c => c.ID === cluster.ID))
                factor.Clusters.push(cluster);
            else
                cluster = factor.Clusters.find(c => c.ID === cluster.ID);

            if (!cluster.Competencies.some(c => c.ID === competency.ID))
                cluster.Competencies.push(competency);
        });

        factors.forEach(o => o.Clusters = o.Clusters.slice().sort((f1, f2) => {
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



