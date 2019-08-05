import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { QuestionsContainer } from './components/questions/QuestionsContainer';
import { CompetenciesContainer } from './components/competencies/CompetenciesContainer';
import { EvaluationResult } from './components/competencies/EvaluationResult';
import { QuestionsResult } from './components/questions/QuestionsResult';
import { LibraryContainer } from './components/library/LibraryContainer';
import { CompetencyContainer } from './components/library/items/CompetencyContainer';
import { StopperContainer } from './components/library/items/StopperContainer';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/questions' component={QuestionsContainer} />
    <Route path='/questionaire' component={QuestionsResult} />
    <Route path='/competencies' component={CompetenciesContainer} />
    <Route path='/evaluation' component={EvaluationResult} />
    <Route exact path='/library' component={LibraryContainer} />
    <Route path='/library/competencies/:competencyId' component={CompetencyContainer} />
    <Route path='/library/stoppers/:stopperId' component={StopperContainer} />
</Layout>;
