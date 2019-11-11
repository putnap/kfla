import { observable, computed, action, runInAction, autorun } from 'mobx';
import { Stopper } from '../models/Stopper';
import { StopperCluster } from '../models/StopperCluster';
import { LocalizationStore } from './LocalizationStore';
import { IGetStoppers } from '../api';

export class StoppersStore {

    localizationStore: LocalizationStore;
    getStoppers: IGetStoppers;

    constructor(localizationStore: LocalizationStore, getStoppers: IGetStoppers) {
        this.localizationStore = localizationStore;
        this.getStoppers = getStoppers;

        autorun(() => this.fetchLocalizedStoppers(this.localizationStore.language));
    }

    @observable stoppers: Stopper[] = [];
    @observable stopperClusters: StopperCluster[] = [];
    @observable loadingLanguage: string;
    @observable isLoaded: boolean;
    @observable isLoading: boolean;

    @computed get selectedStoppers(): Stopper[] {
        return this.stoppers.filter(o => o.IsSelected && o.selectedQuestions.length);
    }

    @computed get questionaireReady(): boolean {
        return this.selectedStoppers.length > 0;
    }

    @action resetQuestionaire() {
        this.stoppers.forEach(o => {
            o.Questions.map(q => q.IsSelected = true);
            o.IsSelected = false;
        });
    }

    @action async fetchStoppers() {
        this.fetchLocalizedStoppers(this.localizationStore.language);
    }

    @action async fetchLocalizedStoppers(lang: string) {
        if ((!this.isLoading && lang) || lang !== this.loadingLanguage) {
            this.stoppers = [];
            this.stopperClusters = [];
            this.loadingLanguage = lang;
            this.isLoaded = false;
            this.isLoading = true;

            try {
                const response = await this.getStoppers(lang);

                runInAction(() => {
                    this.stoppers = response;
                    this.stopperClusters = this.groupStoppers(this.stoppers);
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

    @action groupStoppers(stoppers: Stopper[]): StopperCluster[] {
        const clusters: StopperCluster[] = [];
        stoppers.forEach(stopper => {
            let type = new StopperCluster(stopper.Cluster.ID, stopper.Cluster.Name);
            if (!clusters.some(f => f.ID === type.ID))
                clusters.push(type);
            else
                type = clusters.find(f => f.ID === type.ID);

            if (!type.Stoppers.some(c => c.ID === stopper.ID))
                type.Stoppers.push(stopper);
        });

        return clusters.sort((c1, c2) => {
            if (c1.ID > c2.ID) {
                return 1;
            }
            if (c1.ID < c2.ID) {
                return -1;
            }
            return 0;
        });
    }
}



