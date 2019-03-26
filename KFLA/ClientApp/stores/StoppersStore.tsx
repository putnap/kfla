import { observable, computed, action, runInAction, autorun } from 'mobx';
import { Stopper, StopperJSON } from '../models/Stopper';
import { StopperType } from '../models/StopperType';
import { LocalizationStore } from './LocalizationStore';

export class StoppersStore {

    localizationStore: LocalizationStore;

    constructor(localizationStore: LocalizationStore) {
        this.localizationStore = localizationStore;

        autorun(() => this.fetchLocalizedStoppers(this.localizationStore.language));
    }

    @observable stoppers: Stopper[] = [];
    @observable stopperTypes: StopperType[] = [];
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
        if (!this.isLoading && lang) {
            this.stoppers = [];
            this.stopperTypes = [];
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
                    runInAction(() => {
                        const stoppersJSON: StopperJSON[] = JSON.parse(data);
                        this.stoppers = stoppersJSON.map(stopperJSON => Stopper.fromJSON(stopperJSON));
                        this.stopperTypes = this.groupStoppers(this.stoppers);
                        this.isLoading = false;
                        this.isLoaded = true;
                    });
                });
        }
    }

    @action groupStoppers(stoppers: Stopper[]): StopperType[] {
        const types: StopperType[] = [];
        stoppers.forEach(stopper => {
            let type = new StopperType(stopper.StopperType.ID, stopper.StopperType.Name);
            if (!types.some(f => f.ID == type.ID))
                types.push(type);
            else
                type = types.find(f => f.ID == type.ID);

            if (!type.Stoppers.some(c => c.ID == stopper.ID))
                type.Stoppers.push(stopper);
        });

        return types.sort((t1, t2) => {
            if (t1.Name > t2.Name) {
                return 1;
            }
            if (t1.Name < t2.Name) {
                return -1;
            }
            return 0;
        });
    }
}



