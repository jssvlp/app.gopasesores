import React, { Component } from "react";
import {
    Row,
    Col,
    Nav,
    NavItem,
    Tab
  } from "react-bootstrap";
import Insurences from '../Insurances/insurances'
import Branches from '../Branches/branches'

  export default class InsurencesTab extends Component {
      render() {
          return (
            <div style={{paddingTop:'2%'}}>
                <Tab.Container id="tabs-with-dropdown" defaultActiveKey="insurences">
                    <Row className="clearfix">
                    <Col sm={12}>
                        <Nav bsStyle="tabs">
                        <NavItem eventKey="insurences">
                            <i className="fa fa-info" /> Aseguradoras
                        </NavItem>
                        <NavItem eventKey="branches">
                            <i className="pe-7s-shuffle" /> Ramos
                        </NavItem>
                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Tab.Content animation>
                        <Tab.Pane eventKey="insurences">
                        <Insurences {...this.props}/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="branches">
                           <Branches {...this.props}/>
                        </Tab.Pane>
                        </Tab.Content>
                    </Col>
                    </Row>
                </Tab.Container>
            </div>
          )
      }
  }
  