import React from "react";
import { Link } from "react-router";
import { NavDropdown, MenuItem } from "react-bootstrap";

class GlobalNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: undefined };
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.setState({ user: this.props.user });
    }

    logout() {
        sessionStorage.removeItem("_book_token");
        window.location.href = "http://127.0.0.1:8080/logout";
    }

    render() {
      var log = <li><a href="/auth/twitter"> Login </a></li>;
      if (this.state.user) {
          var profileName = this.state.user.twitter.displayName.charAt(0).toUpperCase() + this.state.user.twitter.displayName.substr(1, this.state.user.twitter.displayName.length);
          log =  <NavDropdown className="navbar-li" title={profileName} id="nav-dropdown">
                    <MenuItem className="menu-item" onClick={this.logout}>Logout</MenuItem>
                  </NavDropdown>
      }

      return (
        <nav id="myNav" className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header"> <h3 className="navbar-text">Book Trading App</h3> </div>
            <ul className="nav navbar-nav navbar-right">
              <li className="navbar-li">
                <Link to="/recent">Recent</Link>
              </li>
              <li className="navbar-li">
                <Link to="/mywall">My Wall</Link>
              </li>
              {log}
            </ul>
          </div>
        </nav>
      );
    }
}

module.exports = GlobalNav;
