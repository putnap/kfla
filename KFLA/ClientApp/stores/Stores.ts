import { CompetencyStore } from "@Stores/CompetencyStore";
import { StoppersStore } from "@Stores/StoppersStore";
import { LocalizationStore } from "@Stores/LocalizationStore";

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