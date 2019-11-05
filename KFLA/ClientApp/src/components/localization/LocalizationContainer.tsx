import * as React from "react";
import { observer, inject } from "mobx-react";
import { RouteComponentProps, Route, Switch } from "react-router";
import { LocalizationStore } from "../../stores/LocalizationStore";
import { Loader } from "../../components/Loader";
import Home from '../../components/Home';
import { QuestionsContainer } from "../../components/questions/QuestionsContainer";
import { QuestionsResult } from "../../components/questions/QuestionsResult";
import { CompetenciesContainer } from "../../components/competencies/CompetenciesContainer";
import { EvaluationResultContainer } from "../../components/competencies/EvaluationResult";
import { LibraryContainer } from "../../components/library/LibraryContainer";
import { CompetencyContainer } from "../../components/library/items/CompetencyContainer";
import { StopperContainer } from "../../components/library/items/StopperContainer";
import ScrollToTop from "../../components/ScrollToTop";
import { LanguageParam } from "../../@types/types";


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
        if (!prevProps || prevProps.match.params.language !== language || !localizationStore.isLoaded) {
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
