import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRoute } from "react-router";
import ajax from "./common/ajax-functions.js";
import Main from "./components/Main.jsx";
import MyWall from "./components/MyWall.jsx";
import Recent from "./components/Recent.jsx";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: undefined, response: false };
        this.requireLogin = this.requireLogin.bind(this);
    }

    componentDidMount() {
        if(!this.state.user){
            ajax('GET', "/api/user", "", function(data) {
                data = JSON.parse(data);
                if (data !== "no user"){
                    this.setState({ user: data })
                }
                this.setState({ response: true })
            }.bind(this));
        }
    }

    requireLogin(nextState, replaceState) {
      if (!this.state.user) {
          replaceState({ nextPathname: nextState.location.pathname }, '/recent');
      }
    }

    render() {
        if(this.state.response) {
          return (
            <Router history={browserHistory}>
              <Route path="/" component={Main} user={this.state.user}>
                <IndexRoute component={MyWall} onEnter={this.requireLogin} />
                <Route path="/recent" component={Recent} />
                <Route path="/mywall" onEnter={this.requireLogin} component={MyWall} />
              </Route>
            </Router>
          );
        }
        else {
          return (
            <div></div>
          );
        }
    }
}

ReactDOM.render((<App />), document.getElementById("app"));
