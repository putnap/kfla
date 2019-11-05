import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './css/site.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faLeanpub } from '@fortawesome/free-brands-svg-icons'
import StoreProvider from './context';
import { createStores } from './stores/Stores';
import App from './App';

library.add(fas, faLeanpub);

const stores = createStores();

function renderApp() {
    // This code starts up the React app when it runs in a browser. It sets up the routing
    // configuration and injects the app into a DOM element.
    const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
    ReactDOM.render(
        <AppContainer>
            <Provider {...stores}>
                <StoreProvider createStores={() => stores}>
                    <BrowserRouter basename={baseUrl}>
                        <App />
                    </BrowserRouter>
                </StoreProvider>
            </Provider>
        </AppContainer>,
        document.getElementById('react-app')
    );
}

renderApp();