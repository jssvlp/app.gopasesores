import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    PanelGroup,
    Panel,
    Nav,
    NavItem,
    Tab
  } from "react-bootstrap";
import Roles from '../roles/roles'
import Permissions from '../permissions/permissions'

  export default class Security extends Component {
      render() {
          return (
            <div style={{paddingTop:'2%'}}>
                <Tab.Container id="tabs-with-dropdown" defaultActiveKey="roles">
                    <Row className="clearfix">
                    <Col sm={12}>
                        <Nav bsStyle="tabs">
                        <NavItem eventKey="roles">
                            <i className="fa fa-info" /> Roles
                        </NavItem>
                        <NavItem eventKey="permissions">
                            <i className="fa fa-user" /> Permisos
                        </NavItem>
                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Tab.Content animation>
                        <Tab.Pane eventKey="roles">
                        <Roles {...this.props}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="permissions">
                           <Permissions {...this.props}/>
                        </Tab.Pane>
                        </Tab.Content>
                    </Col>
                    </Row>
                </Tab.Container>
            </div>
          )
      }
  }
  