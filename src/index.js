import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "./../node_modules/bootstrap/dist/js/bootstrap.js";
import "./../node_modules/jquery/dist/jquery.js";

import "./index.css";
import Login from "./pages/Login";

import * as serviceWorker from "./serviceWorker";
// import {createStore} from 'redux';
// import {Provider} from 'react-redux';
// import reducer from './reducers/reducer';
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";

import Passcode from "./pages/Passcode";
import UpdateForgotPassword from "./pages/updateforgotpassword";
import { BrowserRouter as Router, Route } from "react-router-dom";

import UserAgreement from "./pages/UserAgreement";
import QRCode from "./pages/QRCode";
import ShippingDetails from "./pages/shipping-details";
import ShippingDetailsTwo from "./pages/shipping-details-2";
import GreenCounter from "./pages/GreenCounter";
import ShipmentPlanner from "./pages/shipment-planner";
import RateSearch from "./pages/rate-search";
import NewRateSearch from "./pages/new-rate-search";
import RateTable from "./pages/rate-table";

// import Exmaple from './pages/Example';

// import Signin from './pages/Signin';
// const store=createStore(reducer);

ReactDOM.render(
  <Router>
    <Route exact path="/" component={Login} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/dashboard" component={Dashboard} />
    <Route exact path="/changepassword" component={ChangePassword} />
    <Route exact path="/forgotpassword" component={ForgotPassword} />
    <Route exact path="/passcode" component={Passcode} />
    <Route
      exact
      path="/updateforgotpassword"
      component={UpdateForgotPassword}
    />
    <Route exact path="/user-agreement" component={UserAgreement} />
    {/* <Route exact path="/popup" component={PopupModal} /> */}

    <Route exact path="/qrcode" component={QRCode} />
    <Route exact path="/shipment-summary" component={ShippingDetails} />
    <Route exact path="/shipment-details" component={ShippingDetailsTwo} />
    <Route exact path="/green-counter" component={GreenCounter} />
    <Route exact path="/shipment-planner" component={ShipmentPlanner} />
    <Route exact path="/rate-search" component={RateSearch} />
    <Route exact path="/new-rate-search" component={NewRateSearch} />
    <Route exact path="/rate-table" component={RateTable} />
    {/* <Route exact path="/example" component={Exmaple} /> */}

    {/* <Route  path="/" component={Login} />   */}
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
