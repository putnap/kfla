import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LocalizationContainer } from './components/localization/LocalizationContainer';
import { hot } from 'react-hot-loader/root';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;

const App: React.FC = () => {
    return <BrowserRouter basename={baseUrl}>
        <Layout>
            <Switch>
                <Route path='/:language([A-Za-z]{2})' component={LocalizationContainer} />
                <Route render={() => <Redirect to='en' />} />
            </Switch>
        </Layout>
    </BrowserRouter>
};

export default hot(App);