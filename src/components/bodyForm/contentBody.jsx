import React, { Component } from "react";
import { Grid } from "react-bootstrap";
import Select from "react-select";
import Body from "./body";
import { observer } from "mobx-react";
import Button from "components/CustomButton/CustomButton.jsx";

@observer
class createBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
    };
  }

  changeSelect(value, name) {}
  errorsField(name) {
    return "";
  }

  componentWillReceiveProps(props) {
    let values = props.fieldValues;
    this.setState({
      values: values,
    });
  }

  isValidated() {
    let errors = this.props.errors;
    for (const i in errors) {
      if (errors[i]) {
        this.props.alertMessage(
          "Hay campos requeridos",
          "Favor de revisar los campos vacios",
          "warning"
        );
        return false;
      }
    }
    return true;
  }

  render() {
    return (
      <div>
        <form>
          <Grid fluid style={{ minHeight: 200 }}>
            <Body
              fields={this.props.fields || []}
              permissions={this.props.permissions}
              rules={this.props.rules}
              location={this.props.location}
              alertLoading={this.props.alertLoading}
              alertMessage={this.props.alertMessage}
              view={this.props.view}
              errors={this.props.errors}
              onChange={this.props.setValue || {}}
              fieldValues={this.state.values}
            />
          </Grid>
          {this.props.method && (
            <div style={{ paddingRight: "1%" }}>
              <Button
                style={{
                  postion: "relative",
                  marginLeft: "2%",
                  marginTop: this.props.showSteps === false ? "-4%" : "",
                }}
                bsStyle="success"
                fill
                wd
                onClick={() => this.isValidated() && this.props.method()}
                pullRight
              >
                {this.props.buttonName}
              </Button>
            </div>
          )}
        </form>
      </div>
    );
  }
}

export default createBody;
