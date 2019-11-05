import * as React from "react";
import { observer, inject } from "mobx-react";
import { RouteComponentProps, Route, Switch } from "react-router";
import { LocalizationStore } from "@Stores/LocalizationStore";
import { Loader } from "@Components/Loader";
import Home from '@Components/Home';
import { QuestionsContainer } from "@Components/questions/QuestionsContainer";
import { QuestionsResult } from "@Components/questions/QuestionsResult";
import { CompetenciesContainer } from "@Components/competencies/CompetenciesContainer";
import { EvaluationResultContainer } from "@Components/competencies/EvaluationResult";
import { LibraryContainer } from "@Components/library/LibraryContainer";
import { CompetencyContainer } from "@Components/library/items/CompetencyContainer";
import { StopperContainer } from "@Components/library/items/StopperContainer";
import ScrollToTop from "@Components/ScrollToTop";
import { LanguageParam } from "@Types/types";


const getSafeLanguage = (language: string): string => {
    return language ? language : 'en';
}

interface LocalizationContainerProps extends RouteComponentProps<LanguageParam> {
    localizationStore?: LocalizationStore
}

@inject("localizationStore")
@observer
export class LocalizationContainer extends React.Component<LocalizationContainerProps, {}> {

    async componentDidMount() {
        const { localizationStore } = this.props;
        if (!localizationStore.isLoaded) {
            await localizationStore.loadLanguages();
        }
    }

    async componentDidUpdate(prevProps: LocalizationContainerProps) {
        const { language } = this.props.match.params;
        const { localizationStore } = this.props;
        if (!prevProps || prevProps.match.params.language != language || !localizationStore.isLoaded) {
            await localizationStore.loadStrings(getSafeLanguage(language));
        }
    }

    public render() {
        const { localizationStore, match } = this.props;
        return <ScrollToTop {...this.props} >
            {!localizationStore.isLoaded || localizationStore.isLoading ?
                <Loader /> :
                <Switch>
                    <Route path={`${match.path}/questions`} component={QuestionsContainer} />
                    <Route path={`${match.path}/questionaire`} component={QuestionsResult} />
                    <Route path={`${match.path}/competencies`} component={CompetenciesContainer} />
                    <Route path={`${match.path}/evaluation`} component={EvaluationResultContainer} />
                    <Route path={`${match.path}/library/competencies/:competencyId`} component={CompetencyContainer} />
                    <Route path={`${match.path}/library/stoppers/:stopperId`} component={StopperContainer} />
                    <Route path={`${match.path}/library`} component={LibraryContainer} />
                    <Route path={`${match.path}/`} component={Home} />
                </Switch>
            }
        </ScrollToTop>
    }
}
