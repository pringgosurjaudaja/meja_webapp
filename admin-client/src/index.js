import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

var metaTag=document.createElement('meta');
metaTag.name = "viewport"
metaTag.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
document.getElementsByTagName('head')[0].appendChild(metaTag);

ReactDOM.render(<App />, document.getElementById('root'));
