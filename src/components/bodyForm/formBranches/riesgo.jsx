import React, { Component } from "react";
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  InputGroup,
  FormControl,
  Grid,
} from "react-bootstrap";
import Select from "react-select";
import Button from "components/CustomButton/CustomButton.jsx";

import { observer, inject } from "mobx-react";
@inject("lists")
@observer
class Motor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: {},
      body: {},
      isError: false,
      text: "",
      errors: {
        civil_risk_type: true,
        commercial_activity: true,
      }
    };
    this.onChangeValue = this.onChangeValue.bind(this);
  }

  async componentDidMount() {
    const { lists } = this.props;
    const civil = await lists.getLists("civilRisk");
    const commercial_activity = await lists.getLists("commercialActivity");
    this.setState({
      lists: {
        civil_risk_type: civil.data,
        commercial_activity: commercial_activity.data,
      },
    });
    console.log("civil", commercial_activity);
  }
  componentWillReceiveProps(nextProps, nextState) {
    let fields = nextProps.fieldsValues.polices;
    if (fields.branch_detail) {
      this.setState({
        body: fields.branch_detail,
        vehicle_type: false,
        errors: {
            civil_risk_type: false,
            commercial_activity: false,
        },
      });
    }
  }

  loadSelected(field, list) {
    if (this.state.body[field]) {
      let listFull = this.state.lists[list];
      for (const i in listFull) {
        if (listFull[i] === this.state.body[field]) {
          return { label: listFull[i], value: listFull[i] };
        }
      }
    }
    return "";
  }

  onErrors(e) {
    let errors = this.state.errors;

    errors[e.target.name] = e.target.value ? false : true;
    this.setState({
      errors: errors,
    });
  }

  onChangeValue(e) {
    let body = this.state.body;

    body[e.target.name] = e.target.value;
    this.setState({
      body: body,
    });
    this.onErrors(e);
    console.log("this.state", this.state);
  }
  isError() {
    let errors = this.state.errors;
    let isError = false;
    for (const i in errors) {
      if (errors[i]) {
        isError = true;
      }
    }
    this.setState({
      isError: isError,
    });
    return isError;
  }

  onSave() {
    if (!this.isError()) {
      this.props.onChange(this.props.name, this.state.body, this.props.model);
      this.props.modalClose();
      this.setState({
        text: "",
      });
    }

    this.setState({
      text: "Hay campos vacios que son obligatorios!",
    });
  }
  render() {
    console.log("this.props.fieldsValues", this.props.fieldsValues);
    return (
      <div>
        <Row>
          <Col md={6}>
          <FormGroup
              validationState={this.state.errors.civil_risk_type ? "error" : ""}
            >
              <ControlLabel>
                {"Plan de Riesgo"}{" "}
                {this.state.errors.civil_risk_type && <span className="star">*</span>}
              </ControlLabel>
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                name={"civil_risk_type"}
                value={this.loadSelected("civil_risk_type", "civil_risk_type")}
                onChange={(e) =>
                  this.onChangeValue({
                    target: { name: "civil_risk_type", value: e.value },
                  })
                }
                options={
                  this.state.lists.civil_risk_type &&
                  this.state.lists.civil_risk_type.map((item, i) => {
                    return { label: item, value: item };
                  })
                }
                placeholder={"Plan de Riesgo"}
                isDisabled={false}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
          <FormGroup
              validationState={this.state.errors.commercial_activity ? "error" : ""}
            >
              <ControlLabel>
                {"Actividad Comercial"}{" "}
                {this.state.errors.commercial_activity && <span className="star">*</span>}
              </ControlLabel>
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                name={"commercial_activity"}
                value={this.loadSelected("commercial_activity", "commercial_activity")}
                onChange={(e) =>
                  this.onChangeValue({
                    target: { name: "commercial_activity", value: e.value },
                  })
                }
                options={
                  this.state.lists.commercial_activity &&
                  this.state.lists.commercial_activity.map((item, i) => {
                    return { label: item, value: item };
                  })
                }
                placeholder={"Actividad Comercial"}
                isDisabled={false}
              />
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup validationState={false ? "error" : ""}>
              <ControlLabel>
                {"Condicion Especial"} {false && <span className="star">*</span>}
              </ControlLabel>
              <textarea
                placeholder="Condicion Especial"
                onChange={(e) => this.onChangeValue(e)}
                name="special_conditions"
                value={this.state.body.special_conditions}
                className="form-control"
              >
              </textarea>
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup validationState={false ? "error" : ""}>
              <ControlLabel>
                {"Direccion"} {false && <span className="star">*</span>}
              </ControlLabel>
              <textarea
                placeholder="Direccion"
                onChange={(e) => this.onChangeValue(e)}
                name="address"
                value={this.state.body.address}
                className="form-control"
              >
              </textarea>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {this.state.lists.commercial_activity && this.state.lists.civil_risk_type && (
              <Button
                disabled={this.er}
                fill
                bsStyle="primary"
                onClick={(e) => this.onSave()}
              >
                Guardar
              </Button>
            )}
            <label style={{ color: "red" }}>{this.state.text}</label>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Motor;
