import { CompetencyStore } from "./CompetencyStore";
import { StoppersStore } from "./StoppersStore";
import { LocalizationStore } from "./LocalizationStore";

export function createStores() {
    const localizationStore = new LocalizationStore();
    const stores = {
        localizationStore: localizationStore,
        competencyStore: new CompetencyStore(localizationStore),
        stoppersStore: new StoppersStore(localizationStore),
    };

    return stores;
}

export type Stores = ReturnType<typeof createStores>;