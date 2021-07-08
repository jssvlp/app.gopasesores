import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

export default class ModalBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    let errors = nextProps.errors;
    this.setState({
      errors: errors,
    });
  }

  isError() {
    let errors = this.state.errors;
    for (const i in errors) {
      if (errors[i]) return true;
    }
    return false;
  }

  render() {
    return (
      <Modal
        bsSize="lg"
        show={this.props.modalShow}
        onHide={() => this.props.modalCreate()}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body> {this.props.body}</Modal.Body>
        <Modal.Footer>
          {!this.props.notClose && (
            <Button simple onClick={() => this.props.modalCreate()}>
              Cerrar
            </Button>
          )}

          {this.props.saveMethod && (
            <Button
              bsStyle="warning"
              fill
              onClick={() =>
                !this.isError()
                  ? this.props.saveMethod()
                  : this.props.alertMessage(
                      "Hay campos requeridos",
                      "Favor de revisar los campos vacios",
                      "warning"
                    )
              }
            >
              Guardar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}
