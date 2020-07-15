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
// react component that creates a form divided into multiple steps
import StepZilla from "react-stepzilla";
import { Grid, Row, Col } from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import Card from "components/Card/Card.jsx";
import StepWizard from 'react-step-wizard';


class StepsWizzard extends Component {



    

  render() {

    const {steps,title,subtitle,showNavigation,showSteps,stepsNavigation} = this.props
    console.log('steps!!!!', steps)
    return (
      <div className="">
        <Grid fluid>
          <Row>
            <Col md={10} mdOffset={1} ><br/>
            <Button  round fill  bsStyle="danger" onClick={()=>this.props.closeWizard()} bsSize="sm"><i className="fa fa-times" />Cerrar</Button><br/><br/>

              <Card
                wizard
                id="wizardCard"
                textCenter
                title={title}
                category={subtitle}
                content={
                  <StepZilla
                    steps={steps}
                    showNavigation={showNavigation}
                    showSteps={showSteps}
                    stepsNavigation={stepsNavigation}
                    nextButtonCls="btn btn-prev btn-info btn-fill pull-right btn-wd"
                    backButtonCls="btn btn-next btn-default btn-fill pull-left btn-wd"
                    nextButtonText={"Siguiente"}
                    backButtonText={"Atrás"}
                  />
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default StepsWizzard;
