import { observable, computed, action, runInAction } from 'mobx';
import { Stopper, StopperJSON } from '../models/Stopper';
import { StopperType } from '../models/StopperType';

export class StoppersStore {
    @observable stoppers: Stopper[] = [];
    @observable stopperTypes: StopperType[] = [];
    @observable isLoaded: boolean;
    @observable isLoading: boolean;

    @action fetchStoppers() {
        if (!this.isLoading) {
            this.stoppers = [];
            this.stopperTypes = [];
            this.isLoaded = false;
            this.isLoading = true;
            fetch('api/Competencies/getStoppers')
                .then((response) => {
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



