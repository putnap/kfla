import { CompetencyStore } from "./CompetencyStore";
import { StoppersStore } from "./StoppersStore";
import { LocalizationStore } from "./LocalizationStore";
import { getLanguages, getLocalizedStrings, getEvaluations, getCompetencies, getStoppers } from "../api";

export const createStores = () => {
    const localizationStore = new LocalizationStore(getLanguages, getLocalizedStrings);
    const stores = {
        localizationStore: localizationStore,
        competencyStore: new CompetencyStore(localizationStore, getEvaluations, getCompetencies),
        stoppersStore: new StoppersStore(localizationStore, getStoppers),
    };

    return stores;
}

export type Stores = ReturnType<typeof createStores>;