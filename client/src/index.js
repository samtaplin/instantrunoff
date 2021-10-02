import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import about from "./about";
import simulator from "./simulator";
import login from "./login";
import addelection from "./addelection";

// ========================================

ReactDOM.render(
  <BrowserRouter basename="/instantrunoff">
       <Switch>
        <Route exact path="/" component={about} />
        <Route path="/simulator" component={simulator} />
        <Route path="/login" component={login} />
        <Route path="/addelection" component={addelection} />
      </Switch>
    </BrowserRouter>
  ,
  document.getElementById('root')
);
