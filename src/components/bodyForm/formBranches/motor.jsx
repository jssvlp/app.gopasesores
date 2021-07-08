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
        vehicle_type: true,
        model: true,
        brand: true,
        year: true,
        plan_type: true,
        endorsement_of_assignment: true,
      },
    };
    this.onChangeValue = this.onChangeValue.bind(this);
  }

  async componentDidMount() {
    const { lists } = this.props;
    const brands = await lists.getLists("brands");
    const vehicleType = await lists.getLists("vehicleTypes");
    const banks = await lists.getLists("banks");
    const planType = await lists.getLists("planTypes");
    this.setState({
      lists: {
        brands: brands.data,
        vehicleType: vehicleType.data,
        banks: banks.data,
        planType: planType.data,
      },
    });
    console.log("planType", vehicleType);
  }
  componentWillReceiveProps(nextProps, nextState) {
    let fields = nextProps.fieldsValues.polices;
    if (fields.branch_detail) {
      this.setState({
        body: fields.branch_detail,
        vehicle_type: false,
        errors: {
          model: false,
          brand: false,
          year: false,
          plan_type: false,
          endorsement_of_assignment: false,
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
          <Col md={4}>
            <FormGroup
              validationState={this.state.errors.vehicle_type ? "error" : ""}
            >
              <ControlLabel>
                {"Tipo de Vehiculo"}{" "}
                {this.state.errors.vehicle_type && (
                  <span className="star">*</span>
                )}
              </ControlLabel>
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                name={"vehicle_type"}
                value={this.loadSelected("vehicle_type", "vehicleType")}
                onChange={(e) =>
                  this.onChangeValue({
                    target: { name: "vehicle_type", value: e.value },
                  })
                }
                options={
                  this.state.lists.vehicleType &&
                  this.state.lists.vehicleType.map((item, i) => {
                    return { label: item, value: item };
                  })
                }
                placeholder={"Tipo de Vehiculo"}
                isDisabled={false}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup validationState={this.state.errors.brand ? "error" : ""}>
              <ControlLabel>
                {"Marca"}{" "}
                {this.state.errors.brand && <span className="star">*</span>}
              </ControlLabel>
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                name={"brand"}
                value={this.loadSelected("brand", "brands")}
                onChange={(e) =>
                  this.onChangeValue({
                    target: { name: "brand", value: e.value },
                  })
                }
                options={
                  this.state.lists.brands &&
                  this.state.lists.brands.map((item, i) => {
                    return { label: item, value: item };
                  })
                }
                placeholder={"Marca"}
                isDisabled={false}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup validationState={this.state.errors.model ? "error" : ""}>
              <ControlLabel>
                {"Modelo"}{" "}
                {this.state.errors.model && <span className="star">*</span>}
              </ControlLabel>
              <input
                placeholder="Modelo"
                type="text"
                value={this.state.body.model}
                onChange={(e) => this.onChangeValue(e)}
                name="model"
                className="form-control"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <FormGroup validationState={this.state.errors.year ? "error" : ""}>
              <ControlLabel>
                {"Año"}{" "}
                {this.state.errors.year && <span className="star">*</span>}
              </ControlLabel>
              <input
                placeholder="Año"
                type="number"
                value={this.state.body.year}
                onChange={(e) => this.onChangeValue(e)}
                name="year"
                className="form-control"
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup validationState={false ? "error" : ""}>
              <ControlLabel>
                {"Chasis"} {false && <span className="star">*</span>}
              </ControlLabel>
              <input
                placeholder="Chasis"
                type="text"
                onChange={(e) => this.onChangeValue(e)}
                value={this.state.body.chasis}
                name="chasis"
                className="form-control"
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup validationState={false ? "error" : ""}>
              <ControlLabel>
                {"Cantidad de Pasajeros"}{" "}
                {false && <span className="star">*</span>}
              </ControlLabel>
              <input
                placeholder="Cantidad de Pasajeros"
                type="number"
                onChange={(e) => this.onChangeValue(e)}
                name="passengers_quantity"
                value={this.state.body.passengers_quantity}
                className="form-control"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <FormGroup validationState={false ? "error" : ""}>
              <ControlLabel>
                {"Cilindros"} {false && <span className="star">*</span>}
              </ControlLabel>
              <input
                placeholder="Cilindors"
                type="number"
                onChange={(e) => this.onChangeValue(e)}
                name="cylinders"
                value={this.state.body.cylinders}
                className="form-control"
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup validationState={false ? "error" : ""}>
              <ControlLabel>
                {"Toneladas del Vehiculo"}{" "}
                {false && <span className="star">*</span>}
              </ControlLabel>
              <input
                placeholder="Toneladas del Vehiculo"
                type="number"
                onChange={(e) => this.onChangeValue(e)}
                name="tons"
                value={this.state.body.tons}
                className="form-control"
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup validationState={false ? "error" : ""}>
              <ControlLabel>
                {"Deducible"} {false && <span className="star">*</span>}
              </ControlLabel>
              <input
                placeholder="inferable"
                type="number"
                onChange={(e) => this.onChangeValue(e)}
                name="inferable"
                value={this.state.body.inferable}
                className="form-control"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup
              validationState={
                this.state.errors.endorsement_of_assignment ? "error" : ""
              }
            >
              <ControlLabel>
                {"Endoso de cesion"}{" "}
                {this.state.errors.endorsement_of_assignment && (
                  <span className="star">*</span>
                )}
              </ControlLabel>
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                name={"endorsement_of_assignment"}
                value={this.loadSelected("endorsement_of_assignment", "banks")}
                onChange={(e) =>
                  this.onChangeValue({
                    target: {
                      name: "endorsement_of_assignment",
                      value: e.value,
                    },
                  })
                }
                options={
                  this.state.lists.banks &&
                  this.state.lists.banks.map((item, i) => {
                    return { label: item, value: item };
                  })
                }
                placeholder={"Endoso de cesion"}
                isDisabled={false}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup
              validationState={this.state.errors.plan_type ? "error" : ""}
            >
              <ControlLabel>
                {"Tipo de Plan"}{" "}
                {this.state.errors.plan_type && <span className="star">*</span>}
              </ControlLabel>
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                name={"plan_type"}
                value={this.loadSelected("plan_type", "planType")}
                onChange={(e) =>
                  this.onChangeValue({
                    target: { name: "plan_type", value: e.value },
                  })
                }
                options={
                  this.state.lists.planType &&
                  this.state.lists.planType.map((item, i) => {
                    return { label: item, value: item };
                  })
                }
                placeholder={"Tipo de Plan"}
                isDisabled={false}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {this.state.body.plan_type && (
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
