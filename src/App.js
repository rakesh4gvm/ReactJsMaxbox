import './App.css';
import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom'; 
import { history } from '../src/_helpers/history'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from '../src/_components/HomePage/HomePage';

function App() {
  return (
    <div className="App">
       <Router history={history}>
            <Switch>
                <Route exact path="/" component={HomePage} /> 
            </Switch>
        </Router>
    </div>
  );
}

export default App;
