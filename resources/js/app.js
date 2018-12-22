import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import App from './components/App';

axios.defaults.headers.common['X-CSRF-TOKEN'] = window.Laravel.csrfToken;
window.axios = axios;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
} else {
    console.error('Error. Div App not found!');
}