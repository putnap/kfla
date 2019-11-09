import 'core-js/es';
import 'react-app-polyfill/ie11';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './css/site.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faLeanpub } from '@fortawesome/free-brands-svg-icons'
import StoreProvider from './context';
import { createStores } from './stores/Stores';
import App from './App';

library.add(fas, faLeanpub);

const stores = createStores();

ReactDOM.render(
    <StoreProvider createStores={() => stores}>
        <App />
    </StoreProvider>,
    document.getElementById('react-app')
);
