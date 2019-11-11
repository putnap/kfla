import { observable, action, runInAction, autorun } from "mobx";
import { LocalizedString } from "../models/LocalizedString";
import { IGetLanguages, IGetLocalizedStrings } from '../api';

const wait = (ms) => new Promise(res => setTimeout(res, ms));

export class LocalizationStore {
    getLanguages: IGetLanguages;
    getLocalizedStrings: IGetLocalizedStrings;

    constructor(getLanguages: IGetLanguages, getLocalizedStrings: IGetLocalizedStrings) {
        this.getLanguages = getLanguages;
        this.getLocalizedStrings = getLocalizedStrings;
    }

    @observable languages: string[] = [];
    @observable language: string;
    @observable strings: LocalizedString[] = [];
    @observable isLoaded: boolean;
    @observable isLoading: boolean;

    getString(key: string): string {
        const localizedString = this.strings.find(s => s.Key === key);
        if (!localizedString) {
            if (!this.isLoading) {
                console.log(`'${key}' doesn't have a translation.`);
                return key;
            }
        }
        else {
            return localizedString.Value;
        }
    }

    @action setTitle(key: string) {
        autorun(() => {
            document.title = this.getString(key);
        });
    }

    @action async loadLanguages() {
        if (this.languages.length === 0) {
            this.isLoaded = false;
            this.isLoading = true;

            try {
                const response = await this.getLanguages();
                runInAction(() => {
                    this.languages = response;
                    this.isLoading = false;
                });
            }
            catch (error) {
                this.isLoading = false;
                throw Error(error);
            }
        }
    }

    @action async loadStrings(lang: string) {
        if (!this.isLoaded || lang !== this.language) {
            this.language = lang;
            this.isLoaded = false;
            this.isLoading = true;

            try {
                const response = await this.getLocalizedStrings(lang);

                await wait(500);
                runInAction(() => {
                    this.strings = response;
                    this.isLoading = false;
                    this.isLoaded = true;
                });
            }
            catch (error) {
                this.isLoading = false;
                throw Error(error);
            }
        }

        //this.strings = [
        //    { Key: "Stoppers.Title", Value: "CAREER STALLERS AND STOPPERS" },
        //    { Key: "Stoppers.Loading", Value: "Loading stoppers..." },
        //    { Key: "PageTitles.LIBRARY", Value: "Competency Library" },
        //    { Key: "PageTitles.COMPETENCIES", Value: "Competency Assessment" },
        //    { Key: "PageTitles.QUESTIONS", Value: "Behavior-Based Questions" },
        //    { Key: "Home.Title", Value: "Korn Ferry Leadership Architect™" },
        //    { Key: "Home.Internal", Value: "For internal use only" },
        //    { Key: "QuestionsResult.Questions", Value: "QUESTIONS" },
        //    { Key: "QuestionsResult.Notes", Value: "Notes" },
        //    { Key: "QuestionsResult.Empty", Value: "No competencies or stoppers selected. Redirrecting..." },
        //    { Key: "Buttons.Print", Value: "Print" },
        //    { Key: "Buttons.Info", Value: "Info" },
        //    { Key: "Buttons.Submit", Value: "Submit" },
        //    { Key: "Buttons.Reset", Value: "Reset" },
        //    { Key: "Buttons.Close", Value: "Close" },
        //    { Key: "Questionaire.Reset", Value: "Are you sure you wish to reset questionaire?" },
        //    { Key: "Questionaire.PasswordRequired", Value: "Password is required to continue" },
        //    { Key: "Questionaire.PasswordIncorrect", Value: "Password is incorrect" },
        //    { Key: "Questionaire.Password", Value: "Password" },
        //    { Key: "Questionaire.Login", Value: "Login" },
        //    { Key: "Questionaire.Loading", Value: "Loading competencies..." },
        //    { Key: "StopperItem.Problem", Value: "PROBLEM" },
        //    { Key: "StopperItem.NotAProblem", Value: "NOT A PROBLEM" },
        //    { Key: "Library.Loading", Value: "Loading competencies..." },
        //    { Key: "Library.SortByNumber", Value: "Sort by Competency number" },
        //    { Key: "Library.SortByFactors", Value: "Sort by Factors and Clusters" },
        //    { Key: "Skills.SKILLED", Value: "SKILLED" },
        //    { Key: "Skills.LESS", Value: "LESS SKILLED" },
        //    { Key: "Skills.TALENTED", Value: "TALENTED" },
        //    { Key: "Skills.OVERUSED", Value: "OVERUSED SKILL" },
        //    { Key: "RightsReserved", Value: "© Korn Ferry 2014-2015. All rights reserved." },
        //    { Key: "Evaluation.Reset", Value: "Are you sure you wish to reset evaluation?" },
        //    { Key: "Evaluation.Loading", Value: "Loading competencies..." },
        //    { Key: "CompetencyItem.Cards", Value: "Korn Ferry Leadership Architect™ Global Competency Framework Sort Cards" },
        //    { Key: "EvaluationResult.Legend", Value: "Legend" },
        //    { Key: "EvaluationResult.Empty", Value: "No competencies evaluated. Redirrecting..." },
        //];
    }
}