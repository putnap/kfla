import { CompetencyStore } from "../stores/CompetencyStore";
import { StoppersStore } from "../stores/StoppersStore";
import { LocalizationStore } from "../stores/LocalizationStore";

export interface Stores {
    competencyStore: CompetencyStore;
    stoppersStore: StoppersStore;
    localizationStore: LocalizationStore;
}

export interface LanguageParam {
    language: string
}
