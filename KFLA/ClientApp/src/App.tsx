import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LocalizationContainer } from './components/localization/LocalizationContainer';
import { hot } from 'react-hot-loader/root';
import { setConfig } from 'react-hot-loader';

setConfig({ trackTailUpdates: false })

const App: React.FC = () => {
    return <Layout>
        <Switch>
            <Route path='/:language([A-Za-z]{2})' component={LocalizationContainer} />
            <Route render={() => <Redirect to='en' />} />
        </Switch>
    </Layout>
};

export default hot(App);


