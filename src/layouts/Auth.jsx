/*!

=========================================================
* Light Bootstrap Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import NotificationSystem from "react-notification-system";
import { style } from "variables/Variables.jsx";
import SweetAlert from "react-bootstrap-sweetalert";

// import Footer from "components/Footer/Footer.jsx";
// import AuthNavbar from "components/Navbars/AuthNavbar.jsx";

// dinamically create pages routes
import routes from "routes.js";
import { Provider } from "mobx-react";
import stores from '../mobx/index';
//import bgImage from "assets/img/full-screen-image-3.jpg";

class Pages extends Component {

  constructor(props){
    super(props);
    this.state = {
      _notificationSystem: null,
    }
    this.successDelete = this.successDelete.bind(this);
  }
  componentWillMount() {
    this.setState({ _notificationSystem: this.refs.notificationSystem });
    if (document.documentElement.className.indexOf("nav-open") !== -1) {
      document.documentElement.classList.toggle("nav-open");
    }
  }

  handleNotificationClick = (position,color,mesg,icon) => {
    let level;
    switch (color) {
      case "success":
        level = "success";
        break;
      case "warning":
        level = "warning";
        break;
      case "error":
        level = "error";
        break;
      case "info":
        level = "info";
        break;
      default:
        break;
    }
    this.state._notificationSystem.addNotification({
      title: <span data-notify="icon" className={icon} />,
      message: (
        <div>
         {mesg}
        </div>
      ),
      level: level,
      position: position,
      autoDismiss: 15
    });
  };

  hideAlert(repsonse) {
    this.setState({
      alert: null,
      responseAlert: repsonse
    });
  }

  
  successDelete(title,subtitle) {
    this.setState({
      alert: (
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title={title}
          onConfirm={() => this.hideAlert(false)}
          onCancel={() => this.hideAlert(false)}
          confirmBtnBsStyle="success"
        >
         {subtitle}
        </SweetAlert>
      ),
      responseAlert: true
    });
  }
  getPageClass() {
    var pageClass = "";
    switch (this.props.location.pathname) {
      case "/auth/login-page":
        pageClass = " login-page";
        break;
      case "/auth/register-page":
        pageClass = " register-page";
        break;
      case "/auth/lock-screen-page":
        pageClass = " lock-page";
        break;
      default:
        pageClass = "";
        break;
    }
    return pageClass;
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            render={routeProps => (
              <prop.component
                {...routeProps}
                success={this.successDelete}
              />
            )}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  render() {
    return (
      <div className="">
            <Provider  {...stores}>
            <NotificationSystem ref="notificationSystem" style={style} />

              <Switch>{this.getRoutes(routes)}</Switch>
            </Provider>
      </div>
    );
  }
}

export default Pages;
