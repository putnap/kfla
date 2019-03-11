import './css/site.css';
import 'bootstrap';
import '@fortawesome/fontawesome-free-solid';
import 'core-js/es6/array';
import 'core-js/fn/object/assign';
import 'core-js/fn/promise';
import 'core-js/fn/symbol';
import 'whatwg-fetch'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import * as RoutesModule from './routes';
import { CompetencyStore } from './stores/CompetencyStore';
import { Stores } from './@types/types';
import { StoppersStore } from './stores/StoppersStore';
import { LocalizationStore } from './stores/LocalizationStore';

let routes = RoutesModule.routes;
const localizationStore = new LocalizationStore();
localizationStore.loadLanguages();
const stores: Stores = { competencyStore: new CompetencyStore(localizationStore), stoppersStore: new StoppersStore(localizationStore), localizationStore: localizationStore };

function renderApp() {
    // This code starts up the React app when it runs in a browser. It sets up the routing
    // configuration and injects the app into a DOM element.
    const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
    ReactDOM.render(
        <AppContainer>
            <Provider {...stores}>
                <BrowserRouter children={routes} basename={baseUrl} />
            </Provider>
        </AppContainer>,
        document.getElementById('react-app')
    );
}

renderApp();

// Allow Hot Module Replacement
if (module.hot) {
    module.hot.accept('./routes', () => {
        routes = require<typeof RoutesModule>('./routes').routes;
        renderApp();
    });
}
