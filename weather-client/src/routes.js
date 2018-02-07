import React from 'react';
import { Router, Route } from 'react-router';

import App from './App';
import About from './pages/About/';
import Brightness from './pages/Brightness/';
import Humidity from './pages/Humidity/';
import Pressure from './pages/Pressure/';
import Rain from './pages/Rain/';
import Temperature from './pages/Temperature/';
import NotFound from './pages/NotFound/';

const Routes = (props) => (
  <Router {...props} >
    <Route path="/" component={App}>
      <Route path="/about" component={About} />
      <Route path="/brightness" component={Brightness} />
      <Route path="/humidity" component={Humidity} />
      <Route path="/pressure" component={Pressure} />
      <Route path="/rain" component={Rain} />
      <Route path="/temperature" component={Temperature} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

export default Routes;
