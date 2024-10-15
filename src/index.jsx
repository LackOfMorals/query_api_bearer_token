import React from 'react';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';

import App from './App';
import './index.css';
import './polyfills';

import registerServiceWorker from './registerServiceWorker';


const container = document.getElementById('root');
const root = createRoot(container);
root.render(
 <BrowserRouter>
      <App />
  </BrowserRouter>);

registerServiceWorker();

