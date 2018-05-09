import { CompetencyStore } from "../stores/CompetencyStore";

export interface Stores {
    competencyStore: CompetencyStore;
}

export interface EvaluationResultID {
    evaluationResult?: string
}