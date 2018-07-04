import { CompetencyStore } from "../stores/CompetencyStore";
import { StoppersStore } from "../stores/StoppersStore";

export interface Stores {
    competencyStore: CompetencyStore;
    stoppersStore: StoppersStore;
}

export const PageTitles = {
    QUESTIONS: 'Behavior-Based Questions',
    COMPETENCIES: 'Competency Assessment',
    LIBRARY: 'Competency Library'
}

export const Skills = {
    SKILLED: 'SKILLED',
    LESS: 'LESS SKILLED',
    TALENTED: 'TALENTED',
    OVERUSED: 'OVERUSED SKILL'
}
