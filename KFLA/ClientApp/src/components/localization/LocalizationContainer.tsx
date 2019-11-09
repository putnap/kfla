import * as React from "react";
import { RouteComponentProps, Route, Switch } from "react-router";
import { observer } from "mobx-react-lite";
import { Loader } from "../../components/Loader";
import { Home } from '../../components/Home';
import { QuestionsContainer } from "../../components/questions/QuestionsContainer";
import { QuestionsResult } from "../../components/questions/QuestionsResult";
import { CompetenciesContainer } from "../../components/competencies/CompetenciesContainer";
import { EvaluationResultContainer } from "../../components/competencies/EvaluationResult";
import { LibraryContainer } from "../../components/library/LibraryContainer";
import { CompetencyContainer } from "../../components/library/items/CompetencyContainer";
import { StopperContainer } from "../../components/library/items/StopperContainer";
import { LanguageParam } from "../../@types/types";
import { useStore } from "../../stores/hook";
import ScrollToTop from "../../components/ScrollToTop";

const getSafeLanguage = (language: string): string => {
    return language ? language : 'en';
}

export const LocalizationContainer: React.FC<RouteComponentProps<LanguageParam>> = observer(props => {
    const localizationStore = useStore(stores => stores.localizationStore);
    const { match } = props;
    const { language } = match.params;

    React.useEffect(() => {
        async function loadLanguages() {
            await localizationStore.loadLanguages();
        }

        if (!localizationStore.isLoaded && !localizationStore.isLoading)
            loadLanguages();
    }, [localizationStore]);

    React.useEffect(() => {
        async function loadStrings(lang) {
            await localizationStore.loadStrings(getSafeLanguage(lang));
        }

        loadStrings(language);
    }, [language, localizationStore]);

    return <ScrollToTop {...props} >
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
});
