import axios from 'axios';
import { StopperJSON, Stopper } from './models/Stopper';
import { LocalizedString } from './models/LocalizedString';
import { EvaluationJSON, Evaluation } from './models/Evaluation';
import { CompetencyJSON, Competency } from './models/Competency';

export interface IGetLanguages {
    (): Promise<string[]>;
}

export interface IGetLocalizedStrings {
    (lang): Promise<LocalizedString[]>;
}

export interface IGetStoppers {
    (lang): Promise<Stopper[]>;
}

export interface IGetEvaluations {
    (lang): Promise<Evaluation[]>;
}

export interface IGetCompetencies {
    (lang): Promise<Competency[]>;
}

export const getLanguages = async () => {
    const response = await axios.get<string[]>('api/languages');
    return response.data;
}

export const getLocalizedStrings = async (lang) => {
    const response = await axios.get<LocalizedString[]>('api/strings', {
        headers: { 'Accept-Language': lang }
    });

    return response.data;
}

export const getStoppers = async (lang) => {
    const response = await axios.get<StopperJSON[]>('api/stoppers', {
        headers: { 'Accept-Language': lang },
    });

    const stoppers = response.data.map(stopperJSON => Stopper.fromJSON(stopperJSON));
    return stoppers;
}

export const getEvaluations = async (lang) => {
    const response = await axios.get<EvaluationJSON[]>('api/evaluations', {
        headers: { 'Accept-Language': lang },
    });
    const evaluations = response.data.map(evaluationJSON => Evaluation.fromJSON(evaluationJSON))
    return evaluations;
}

export const getCompetencies = async (lang) => {
    const response = await axios.get<CompetencyJSON[]>('api/competencies', {
        headers: { 'Accept-Language': lang },
    });
    const competencies = response.data.map(competencyJSON => Competency.fromJSON(competencyJSON))
    return competencies;
}
