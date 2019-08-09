import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LocalizationContainer } from './components/localization/LocalizationContainer';

export const routes = <Layout>
        <Switch>
            <Route path='/:language([A-Za-z]{2})' component={LocalizationContainer} />
            <Route render={() => <Redirect to='en' />} />
        </Switch>
    </Layout>;


