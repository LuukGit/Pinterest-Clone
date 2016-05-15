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
        window.location.href = "https://luuk-pinterest-clone.herokuapp.com/logout";
    }

    render() {
        if (this.state.user) {
            var profileName = this.state.user.twitter.displayName.charAt(0).toUpperCase() + this.state.user.twitter.displayName.substr(1, this.state.user.twitter.displayName.length);
              return (
                <nav id="myNav" className="navbar navbar-default">
                  <div className="container-fluid">
                    <div className="navbar-header"> <h3 className="navbar-text">Pinterest Clone</h3> </div>
                    <ul className="nav navbar-nav navbar-right">
                      <li className="navbar-li">
                        <Link to="/recent">Recent</Link>
                      </li>
                      <li className="navbar-li">
                        <Link to="/mywall">My Wall</Link>
                      </li>;
                      <NavDropdown className="navbar-li" title={profileName} id="nav-dropdown">
                          <MenuItem className="menu-item" onClick={this.logout}>Logout</MenuItem>
                      </NavDropdown>;
                    </ul>
                  </div>
                </nav>
              );
          }
          else {
              return (
                <nav id="myNav" className="navbar navbar-default">
                  <div className="container-fluid">
                    <div className="navbar-header"> <h3 className="navbar-text">Pinterest Clone</h3> </div>
                    <ul className="nav navbar-nav navbar-right">
                      <li className="navbar-li">
                        <Link to="/recent">Recent</Link>
                      </li>
                      <li className="navbar-li">
                          <a href="/auth/twitter"> Login </a>
                      </li>
                    </ul>
                  </div>
                </nav>
              );
          }
    }
}

module.exports = GlobalNav;
