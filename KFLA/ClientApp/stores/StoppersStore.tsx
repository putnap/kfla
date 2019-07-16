import { observable, computed, action, runInAction, autorun } from 'mobx';
import { Stopper, StopperJSON } from '../models/Stopper';
import { StopperCluster } from '../models/StopperCluster';
import { LocalizationStore } from './LocalizationStore';

export class StoppersStore {

    localizationStore: LocalizationStore;

    constructor(localizationStore: LocalizationStore) {
        this.localizationStore = localizationStore;

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

    @action fetchStoppers() {
        this.fetchLocalizedStoppers(this.localizationStore.language);
    }

    @action fetchLocalizedStoppers(lang: string) {
        if (!this.isLoading && lang || lang != this.loadingLanguage) {
            this.stoppers = [];
            this.stopperClusters = [];
            this.loadingLanguage = lang;
            this.isLoaded = false;
            this.isLoading = true;
            fetch('api/stoppers', {
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
                            const stoppersJSON: StopperJSON[] = JSON.parse(data);
                            this.stoppers = stoppersJSON.map(stopperJSON => Stopper.fromJSON(stopperJSON));
                            this.stopperClusters = this.groupStoppers(this.stoppers);
                            this.isLoading = false;
                            this.isLoaded = true;
                        });
                    }
                });
        }
    }

    @action groupStoppers(stoppers: Stopper[]): StopperCluster[] {
        const clusters: StopperCluster[] = [];
        stoppers.forEach(stopper => {
            let type = new StopperCluster(stopper.Cluster.ID, stopper.Cluster.Name);
            if (!clusters.some(f => f.ID == type.ID))
                clusters.push(type);
            else
                type = clusters.find(f => f.ID == type.ID);

            if (!type.Stoppers.some(c => c.ID == stopper.ID))
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



