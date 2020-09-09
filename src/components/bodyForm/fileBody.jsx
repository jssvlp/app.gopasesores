import React, { Component } from "react";
import {
  Row,
  Col,
  Grid,
  FormGroup,
  ControlLabel,
  InputGroup,
  FormControl,
} from "react-bootstrap";
export default class fileBody extends Component {
  render() {
    const { fields, onChange } = this.props;
    return (
      <div>
        <Row>
          <Col md={6}>
            <ControlLabel>Nombre del archivo</ControlLabel>
            <input
              className="form-control"
              onChange={(e) => onChange("name", e.target.value)}
              value={fields.name}
            />
          </Col>
          <Col md={6} style={{ cursor: "pointer" }}>
            <ControlLabel>Seleccionar archivo</ControlLabel>
            <InputGroup
              style={{ cursor: "pointer" }}
              onClick={() => document.getElementById("file").click()}
            >
              <input
                type="file"
                className="form-control"
                id="file"
                multiple={false}
                style={{ display: "none" }}
                onChange={(e) => onChange("file", e.target.files)}
              />
              <input
                type="text"
                className="form-control"
                name="fileName"
                readOnly={true}
                value={fields.file[0] && "Archivo seleccionado"}
              />
              <InputGroup.Addon style={{ backgroundColor: "#073E7D" }}>
                {" "}
                <i
                  className={"fa fa-folder-open"}
                  style={{ color: "white" }}
                ></i>
                {fields.file[0] && (
                  <i className={"fa fa-check"} style={{ color: "green" }}></i>
                )}
              </InputGroup.Addon>
            </InputGroup>
          </Col>
        </Row>
        <br />
        <Row>
          <Col md={12}>
            <ControlLabel>Tipo de documentos</ControlLabel>
            <select
              className="form-control"
              value={fields.type}
              onChange={(e) => onChange("type", e.target.value)}
            >
              <option value="Seleccione">Seleccione</option>
              <option value="Cedula de Identidad">Cedula de Identidad</option>
            </select>
          </Col>
        </Row>
      </div>
    );
  }
}
