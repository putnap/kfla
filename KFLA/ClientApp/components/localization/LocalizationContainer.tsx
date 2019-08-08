import * as React from "react";
import { observer, inject } from "mobx-react";
import { RouteComponentProps, Route } from "react-router";
import { LocalizationStore } from "../../stores/LocalizationStore";
import { Loader } from "../Loader";
import { Home } from '../../components/Home';
import { QuestionsContainer } from "../questions/QuestionsContainer";
import { QuestionsResult } from "../questions/QuestionsResult";
import { CompetenciesContainer } from "../competencies/CompetenciesContainer";
import { EvaluationResult } from "../competencies/EvaluationResult";
import { LibraryContainer } from "../library/LibraryContainer";
import { CompetencyContainer } from "../library/items/CompetencyContainer";
import { StopperContainer } from "../library/items/StopperContainer";
import { LanguageParam } from "../LanguageParam";


const getSafeLanguage = (language: string): string => {
    return language ? language : 'en';
}

interface LocalizationContainerProps extends RouteComponentProps<LanguageParam> {
    localizationStore?: LocalizationStore
}

@inject("localizationStore")
@observer
export class LocalizationContainer extends React.Component<LocalizationContainerProps, {}> {

    componentDidMount() {
        const { localizationStore } = this.props;
        if (!localizationStore.isLoaded) {
            localizationStore.loadLanguages();
        }
    }

    componentDidUpdate(prevProps: LocalizationContainerProps) {
        const { language } = this.props.match.params;
        const { localizationStore } = this.props;
        if (!prevProps || prevProps.match.params.language != language || !localizationStore.isLoaded) {
            localizationStore.loadStrings(getSafeLanguage(language));
        }
    }

    public render() {
        const { localizationStore, match } = this.props;
        return !localizationStore.isLoaded || localizationStore.isLoading ?
            <Loader /> :
            <div>
                <Route exact path={`${match.path}/`} component={Home} />
                <Route path={`${match.path}/questions`} component={QuestionsContainer} />
                <Route path={`${match.path}/questionaire`} component={QuestionsResult} />
                <Route path={`${match.path}/competencies`} component={CompetenciesContainer} />
                <Route path={`${match.path}/evaluation`} component={EvaluationResult} />
                <Route exact path={`${match.path}/library`} component={LibraryContainer} />
                <Route path={`${match.path}/library/competencies/:competencyId`} component={CompetencyContainer} />
                <Route path={`${match.path}/library/stoppers/:stopperId`} component={StopperContainer} />
            </div>
    }
}
