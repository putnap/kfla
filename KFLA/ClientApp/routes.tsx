import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { QuestionsContainer } from './components/questions/QuestionsContainer';
import { CompetenciesContainer } from './components/competencies/CompetenciesContainer';
import { EvaluationResult } from './components/competencies/EvaluationResult';
import { QuestionsResult } from './components/questions/QuestionsResult';
import { LibraryContainer } from './components/library/LibraryContainer';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/questions' component={QuestionsContainer} />
    <Route path='/questionaire' component={QuestionsResult} />
    <Route path='/competencies' component={CompetenciesContainer} />
    <Route path='/evaluation' component={EvaluationResult} />
    <Route path='/library' component={LibraryContainer} />
</Layout>;
