import 'react-app-polyfill/ie9';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import getHistory from './services/router/getHistory';
import App from './App';
import './style/app.scss';

ReactDOM.render(
  <Router history={getHistory()}>
    <App />
  </Router>,
  document.getElementById('root')
);
