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
// this is used to create scrollbars on windows devices like the ones from apple devices
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// react component that creates notifications (like some alerts with messages)
import NotificationSystem from "react-notification-system";

import Sidebar from "components/Sidebar/Sidebar.jsx";
import AdminNavbar from "components/Navbars/AdminNavbar.jsx";
import Footer from "components/Footer/Footer.jsx";
import { Provider } from "mobx-react";
import stores from '../mobx/index';
import image from "assets/img/full-screen-image-3.jpg";
// dinamically create dashboard routes
import routes from "routes.js";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";
import Protect from './protect';
// style for notifications
import { style } from "variables/Variables.jsx";


var ps;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _notificationSystem: null,
      image: image,
      color: "black",
      hasImage: true,
      navbar: false,
      mini: false,
      fixedClasses: "dropdown show-dropdown open",
      alert:null,
      show: false,
      responseAlert: false,
    };
    this.alertMessage = this.alertMessage.bind(this);
    this.htmlAlert = this.htmlAlert.bind(this);
    this.alertLoading = this.alertLoading.bind(this);
  }
  componentDidMount() {
    this.setState({ _notificationSystem: this.refs.notificationSystem });
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.mainPanel);
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  componentDidUpdate(e) {
    if (navigator.platform.indexOf("Win") > -1) {
      setTimeout(() => {
        ps.update();
      }, 350);
    }
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
    if (
      window.innerWidth < 993 &&
      e.history.action === "PUSH" &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
  }
  componentWillMount() {
    if (document.documentElement.className.indexOf("nav-open") !== -1) {
      document.documentElement.classList.toggle("nav-open");
    }
  }
  // function that shows/hides notifications - it was put here, because the wrapper div has to be outside the main-panel class div
  handleNotificationClick = position => {
    var color = Math.floor(Math.random() * 4 + 1);
    var level;
    switch (color) {
      case 1:
        level = "success";
        break;
      case 2:
        level = "warning";
        break;
      case 3:
        level = "error";
        break;
      case 4:
        level = "info";
        break;
      default:
        break;
    }
    this.state._notificationSystem.addNotification({
      title: <span data-notify="icon" className="pe-7s-gift" />,
      message: (
        <div>
          Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for
          every web developer.
        </div>
      ),
      level: level,
      position: position,
      autoDismiss: 15
    });
  };
  handleImageClick = image => {
    this.setState({ image: image });
  };
  handleColorClick = color => {
    this.setState({ color: color });
  };
  handleHasImage = hasImage => {
    this.setState({ hasImage: hasImage });
  };
  handleNavbarClick = navbar => {
    this.setState({ navbar: navbar });
  };
  handleMiniClick = () => {
    this.setState({ mini: !this.state.mini });
    document.body.classList.toggle("sidebar-mini");
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({ fixedClasses: "dropdown show-dropdown open" });
    } else {
      this.setState({ fixedClasses: "dropdown" });
    }
  };

  hideAlert(repsonse) {
    this.setState({
      alert: null,
      responseAlert: repsonse
    });
  }
  
  alertMessage(title,subtitle,option) {
    this.setState({
      alert: (
        <SweetAlert
          success={option ==='success'}
          error={option ==='error'}
          warning={option ==='warning'}
          style={{ display: "block", marginTop: "-100px" }}
          title={title}
          onConfirm={() => this.hideAlert(false)}
          onCancel={() => this.hideAlert(false)}
          confirmBtnBsStyle={option}
        >
         {subtitle}
        </SweetAlert>
      ),
      responseAlert: true
    });
  }

  htmlAlert(title,method) {
    this.setState({
      alert: (
        <SweetAlert
          style={{ display: "block",paddingBottom:100 }}
          title={title}
          onCancel={() => this.hideAlert(false)}
          showConfirm={false}
        >
            <Select
            className="react-select primary"
            classNamePrefix="react-select"
            onChange={(e)=> [method(e.value), this.hideAlert(false)]}
            options={[
              {label: 'Persona',value:'people'},
              {label: 'Empresa',value:'company'},
            ]}
            placeholder={"Seleccione el tipo"}
            />
        </SweetAlert>
      )
    });
  }

  alertLoading(title,option) {
    this.setState({
      alert: (
        <SweetAlert
          style={{ display: "block", marginTop: "-100px" }}
          title={title}
          showConfirm={false}
        >
         <center><i className="fa fa-spin fa-circle-o-notch" style={{fontSize:20}}/></center>
        </SweetAlert>
        
      )
    });
   !option&&this.hideAlert()
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        return (
         
            <Route
              path={prop.layout + prop.path}
              key={key}
              render={routeProps => ( 
              <Protect path={prop.path} layout={prop.layout }>
                <prop.component
                  {...routeProps}
                  handleClick={this.handleNotificationClick}
                  alertMessage={this.alertMessage}
                  htmlAlert={this.htmlAlert}
                  alertLoading={this.alertLoading}
                />
              </Protect>
                
              )}
            />
        );
      } else {
        return null;
      }
    });
  };
  render() {
    return (
      <div className="wrapper">
       {this.state.alert}
      <Provider  {...stores}>
        <NotificationSystem ref="notificationSystem" style={style} />
        <Sidebar
          {...this.props}
          image={this.state.image}
          color={this.state.color}
          hasImage={this.state.hasImage}
          mini={this.state.mini}
          alertMessage={this.alertMessage}
          htmlAlert={this.htmlAlert}
          alertLoading={this.alertLoading}
        />
        <div
          className={
            "main-panel" +
            (this.props.location.pathname === "/maps/full-screen-maps"
              ? " main-panel-maps"
              : "")
          }
          ref="mainPanel"
        >
          <AdminNavbar
            {...this.props}
            handleMiniClick={this.handleMiniClick}
            navbar={this.state.navbar}
            alertMessage={this.alertMessage}
            htmlAlert={this.htmlAlert}
            alertLoading={this.alertLoading}
          />
          <Switch>{this.getRoutes(routes)}</Switch>
          <Footer fluid />
          {/* <FixedPlugin
            handleImageClick={this.handleImageClick}
            handleColorClick={this.handleColorClick}
            handleHasImage={this.handleHasImage}
            handleNavbarClick={this.handleNavbarClick}
            handleMiniClick={this.handleMiniClick}
            bgColor={this.state["color"]}
            bgImage={this.state["image"]}
            mini={this.state["mini"]}
            handleFixedClick={this.handleFixedClick}
            fixedClasses={this.state.fixedClasses}
          /> */}
        </div>
        </Provider>
      </div>
    );
  }
}

export default Dashboard;
