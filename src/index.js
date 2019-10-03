import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './pages/Login';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
// import './../node_modules/bootstrap/dist/js/bootstrap.js';


import * as serviceWorker from './serviceWorker';
// import {createStore} from 'redux';
// import {Provider} from 'react-redux';
// import reducer from './reducers/reducer';
import Dashboard from './pages/Dashboard';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';

import Passcode from './pages/Passcode';
import UpdateForgotPassword from './pages/updateforgotpassword';
import { BrowserRouter as Router, Route } from "react-router-dom";
 
// import Signin from './pages/Signin';
// const store=createStore(reducer);

ReactDOM.render(<Router>
    <Route exact path="/" component={Login} />    
    <Route exact path="/login" component={Login} /> 
    <Route exact path="/dashboard" component={Dashboard} />    
    <Route exact path="/changepassword" component={ChangePassword} /> 
    <Route exact path="/forgotpassword" component={ForgotPassword} /> 
    <Route exact path="/passcode" component={Passcode} />
    <Route exact path="/updateforgotpassword" component={UpdateForgotPassword} />
   
    
    {/* <Route  path="/" component={Login} />   */}
  </Router>,
 document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
