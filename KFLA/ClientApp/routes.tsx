import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Questions } from './components/Questions';
import { CompetenciesContainer } from './components/CompetenciesContainer';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/questions' component={ Questions } />
    <Route path='/competencies' component={CompetenciesContainer } />
</Layout>;
