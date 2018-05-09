import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { QuestionsContainer } from './components/questions/QuestionsContainer';
import { CompetenciesContainer } from './components/competencies/CompetenciesContainer';
import { EvaluationResult } from './components/competencies/EvaluationResult';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/questions' component={QuestionsContainer} />
    <Route exact path='/competencies' component={CompetenciesContainer} />
    <Route path='/evaluation/:evaluationResult?' component={ EvaluationResult } />
</Layout>;
