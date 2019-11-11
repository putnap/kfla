import 'core-js/es';
import 'react-app-polyfill/ie11';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './css/site.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faLeanpub } from '@fortawesome/free-brands-svg-icons'
import StoreProvider from './context';
import App from './App';

library.add(fas, faLeanpub);

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;

ReactDOM.render(
    <BrowserRouter basename={baseUrl}>
        <StoreProvider>
            <App />
        </StoreProvider>
    </BrowserRouter>,
    document.getElementById('react-app')
);
