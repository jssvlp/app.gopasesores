import React, {Component} from "react";
import {
    Row,
    Col,
    Nav,
    NavItem,
    Tab
} from "react-bootstrap";
import PaymentsClient from "./paymentClient";
import PaymentInsurence from "./paymentInsurences"



export default class Security extends Component {
    render() {
        return (
            <div style={{paddingTop:'2%'}}>
                <Tab.Container id="tabs-with-dropdown" defaultActiveKey="pay_cobrar">
                    <Row className="clearfix">
                        <Col sm={12}>
                            <Nav bsStyle="tabs">
                                <NavItem eventKey="pay_cobrar">
                                    <i className="fa fa-money" /> Pagos Por Cobrar
                                </NavItem>
                                <NavItem eventKey="pay_aseguradora">
                                    <i className="fa fa-coin" /> Pagos Por Pagar A Aseguradoras
                                </NavItem>
                                <NavItem eventKey="pay_commision">
                                    <i className="fa fa-user" /> Comisiones Por Cobrar
                                </NavItem>
                            </Nav>
                        </Col>
                        <Col sm={12}>
                            <Tab.Content animation>
                                <Tab.Pane eventKey="pay_cobrar">
                                    <PaymentsClient {...this.props}/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="pay_aseguradora">
                                    <PaymentInsurence {...this.props}/>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        )
    }
}
