import React, { Component } from 'react';
import EditorView from './views/EditorView';


import { BrowserRouter as Router, Route } from "react-router-dom";
const customHistory = require("history").createBrowserHistory;

class App extends Component {
  render() {
    return (
        <Router history  = {customHistory}>
            <Route exact path="/" component={EditorView} />
            <Route exact path="/editor" component={EditorView} />
        </Router>
      
    );
  }
}
export default App;
