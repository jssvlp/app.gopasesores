import React, { Component } from "react";
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Datetime from "react-datetime";
import InputMask from "react-input-mask";
import { observer, inject } from "mobx-react";
import Checkbox from "../CustomCheckbox/CustomCheckbox";
import Datatable from "../DataTable/Datatable";
import moment from "moment";
import avatar from "assets/img/default-user-image.png";
import { Storage } from "../../services/firebase/index";
import Modal from "../../components/Modal/Modal";
import FileBody from "./fileBody";
import Button from "components/CustomButton/CustomButton.jsx";
import MotorBody from "./formBranches/motor";
import Riesgo from './formBranches/riesgo';
import Select from "react-select";
import branches from "views/Branches/branches";
import FileView from "./fileView"

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    console.log("file", file);
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
@inject("insurances", "docs")
@observer
class body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
      seletectedItems: [],
      fields: [],
      branchesFilter: [],
      imgprofile: null,
      files: [],
      fileViewData:[],
      fileSelected: {
        name: "",
        file: "",
        type: "",
      },
      modalViewFile: false,
      branchSelect: false,
      modal: false,
      modalBranch: false,
      has_detail: 0,
    };
    this.selectedItem = this.selectedItem.bind(this);
    this.openModal = this.openModal.bind(this);
    this.openModalBranch = this.openModalBranch.bind(this);
    this.onChangeFilesInput = this.onChangeFilesInput.bind(this);
    this.onValueBranchOfInsurances = this.onValueBranchOfInsurances.bind(this);
    this.openModalFileView = this.openModalFileView.bind(this);
  }

  async componentWillReceiveProps(props) {
    let values = props.fieldValues;
    let picture = values.user ? values.user.picture : null;
    let files = values.documents ? values.documents : [];
    this.setState({
      values: values,
      fields: props.fields,
      imgprofile: picture ? await this.getProfileImage(picture) : null,
      files: files,
    });
  }

  openModalBranch() {
    this.setState({
      modalBranch: !this.state.modalBranch,
    });
  }

  openModal() {
    this.setState({
      modal: !this.state.modal,
      fileSelected: {
        name: "",
        file: "",
        type: "",
      },
    });
  }

  openModalFileView() {
    this.setState({
      modalViewFile: !this.state.modalViewFile,
    });
  }

  componentDidMount() {
    let values = this.props.fieldValues;
    let files = values.documents ? values.documents : [];
    this.setState({
      values: values,
      fields: this.props.fields,
      files: files,
    });
  }

  initRules(name, value, model) {
    let field = this.state.fields;
    let error = this.props.errors;
    let rules = this.props.rules;
    let values = this.state.values;
    console.log("rules", rules, name, value);

    for (const x in rules) {
      if ((rules[x].fieldFrom === name && rules[x].valueFrom === value) || (rules[x].fieldFrom === name && rules[x].valueFrom === "value_field")) {
        for (const i in field) {
          
          if (field[i].name === rules[x].fieldTo) {
            if (rules[x].rule === "show") {
              field[i].hidden = false;
              values[field[i].model][field[i].name] = "";
            }
            if (rules[x].rule === "hidden") {
              field[i].hidden = true;
              values[field[i].model][field[i].name] = "";
            }
            if (rules[x].rule === "disabled") {
              field[i].disabled = true;
              values[field[i].model][field[i].name] = "";
            }
            if (rules[x].rule === "active") {
              field[i].disabled = false;
              values[field[i].model][field[i].name] = "";
            }
            if (rules[x].rule === "require") {
              error[field[i].name] = true;
              values[field[i].model][field[i].name] = "";
            }
            if (rules[x].rule === "notrequire") {
              error[field[i].name] = false;
              values[field[i].model][field[i].name] = "";
            }
            if (rules[x].rule === "nomask") {
              field[i].mask = "";
              values[field[i].model][field[i].name] = "";
              //values[model][field[i].name] = ''
              console.log("LALOAL");
            }
            if (rules[x].rule === "mask") {
              field[i].mask = rules[x].mask;
              values[field[i].model][field[i].name] = "";
            }

            if (rules[x].rule === "sum") {
              let first =  values[field[i].model] ? values[field[i].model][rules[x].fieldFrom] : 0;
              let second =  values[field[i].model] ? values[field[i].model][field[i].name] : 0;
              let result = parseInt(first) + parseInt(second)
              values[field[i].model] && (values[field[i].model][rules[x].fieldResult] = result);
            }

            if (rules[x].rule === "div") {
              let first =  values[field[i].model] ? values[field[i].model][rules[x].fieldFrom] : 0;
              let second =  values[field[i].model] ? values[field[i].model][field[i].name] : 0;
              let result = parseInt(second) / parseInt(first)
              values[field[i].model] && (values[field[i].model][rules[x].fieldResult] = result.toFixed(2));
            }
            if (rules[x].rule === "multi") {

              let first =  values[field[i].model] ? values[field[i].model][rules[x].fieldFrom] : 0;
              let second =  values[field[i].model] ? values[field[i].model][field[i].name] : 0;
              let result = parseInt(second) * parseInt(first)
              values[field[i].model] && (values[field[i].model][rules[x].fieldResult] = result.toFixed(2));
            }

            if (rules[x].rule === "porcentage") {

              let first =  values[field[i].model] ? values[field[i].model][rules[x].fieldFrom] : 0;
              let second =  values[field[i].model] ? values[field[i].model][field[i].name] : 0;
              let result = (parseInt(second)/100) * parseInt(first)
              values[field[i].model] && (values[field[i].model][rules[x].fieldResult] = result.toFixed(2));
            }
          }
        }
      }
    }
  }

  async deleteTable(method) {
    let items = this.state.seletectedItems;
    let allErrorsDelete = [];
    this.props.alertLoading("Eliminando Espere un momento....", true);
    for (const i in items) {
      console.log("items[i]", items[i]);
      let result = await method(items[i]);
      !result.success && allErrorsDelete.push(items[i]);
    }
    this.props.alertLoading("Eliminando Espere un momento....", false);
    if (allErrorsDelete.length > 0) {
      this.props.alertMessage(
        "Ups!, algunos Rols no se eliminaron",
        "los siguientes Rols no se borraron: " + allErrorsDelete.toString(),
        "error"
      );
    }

    if (allErrorsDelete.length === 0) {
      this.props.alertMessage(
        "Se elimino correctamente",
        "Puede verificar en la lista de registros ",
        "success"
      );
    }
    this.setState({
      seletectedItems: [],
    });
  }

  value(values, model, name, value) {
    if (values[model]) {
      return values[model][name];
    }
    if (!model) {
      return values[name];
    }
    if (values.length === 0) {
      return value;
    }
  }

  findValueSelect(values, selected) {
    console.log('sdfdfsdfdf')
    return values.find((e) => e.value === selected);
  }

  selectedItem(id, checkbox) {
    let items = this.state.seletectedItems;
    console.log("checkbox.target.checked", checkbox.target.checked);
    checkbox.target.checked
      ? items.push(id)
      : (items = items.filter((e) => e !== id));
    this.setState({
      seletectedItems: items,
    });
  }

  fileImage(id) {
    document.getElementById(id).click();
  }

  async fileChange(e, id, name, model) {
    let file = e.target.files[0];
    let base64 = await toBase64(file);
    let result = await Storage.uploadImage(name.document_id, file.name, base64);
    if (result.success) {
      this.props.onChange(id, result.data.metadata.fullPath, model);
      this.setState({
        imgprofile: await this.getProfileImage(result.data.metadata.fullPath),
      });
    }
    if (!result.success) alert("Error al subir archivo");
  }

  async removeFile(child, id, model, idFile = null) {
    const { docs } = this.props;
    let result = await Storage.removeFile(child);
    let files = this.state.files;
    console.log("result", result);
    console.log("child,id,model", child, id, model);
    if (result.success) {
      let resultFiles = files.filter((item, i) => {
        return item.url !== child;
      });
      const resultFIleRemove = idFile ? await docs.deleteFilesById(idFile) : "";
      console.log("resultFiles", resultFiles, resultFIleRemove);
      this.props.onChange(id, resultFiles, model);
      resultFiles.documents && delete resultFiles.documents;
      this.setState({
        files: resultFiles,
      });
    }
  }

  async uploadFile(path, child, model, id) {
    this.props.alertLoading("Espere un momento....", true);
    let file = this.state.fileSelected.file;
    let resultFile = this.state.files;

    for (const i in file) {
      if (typeof file[i] === "object") {
        let base64 = await toBase64(file[i]);
        let result = await Storage.uploadFile(
          path + "/" + child,
          file[i].name,
          base64
        );
        console.log("result file!!!", result);
        if (result.success) {
          resultFile.push({
            name: this.state.fileSelected.name,
            url: result.data.metadata.fullPath,
            document_type: this.state.fileSelected.type,
          });
        }
        if (!result.success) alert("Error al subir archivo");
      }
    }

    this.props.onChange(id, resultFile, model);
    resultFile.documents && delete resultFile.documents;
    // this.setState({
    //   files: resultFile,
    // });
    console.log("resultFile ", this.state.files);
    this.props.alertLoading("Espere un momento....", false);
    this.openModal();
  }

  async getProfileImage(data) {
    if (data) {
      let result = await Storage.getProfileImage(data);
      if (result.success) {
        console.log("result", result);
        return result.data;
      }
      if (!result.success) {
        return null;
      }
    }
    return null;
  }

  cardFile(id, isFile, fileName, path = null) {
    return (
      <div
        style={{
          padding: 5,
          display: "flex",
        }}
      >
        {/* {isFile && (
          <i
            className={"fa fa-times-circle"}
            style={{ color: "#cc1e35", cursor: "pointer" }}
            onClick={() => this.removeFile(path)}
          ></i>
        )}
        {!isFile && (
          <i className={"fa fa-times-circle"} style={{ color: "white" }}></i>
        )} */}

        <div>
          <center>
            <i
              className={isFile ? "fa fa-file-text" : "fa fa-folder-open"}
              style={{ fontSize: 28 }}
            ></i>
            <br />
            <br />
            <label style={{ fontSize: isFile ? 9 : 12 }}>
              {isFile ? fileName : "subir archivos"}
            </label>
          </center>
        </div>
      </div>
    );
  }

  onChangeFilesInput(name, value) {
    let fileSelected = this.state.fileSelected;
    fileSelected[name] = value;
    this.setState({
      fileSelected: fileSelected,
    });

    console.log("this.state", this.state);
  }

  async onValueBranchOfInsurances(id) {
    console.log("this.state.values", this.state.values);
    const { insurances } = this.props;
    const result = await insurances.getBranchesByInsurances(id);
    if (result.success) {
      this.setState({
        branchesFilter: result.branches.map((item, i) => {
          return {
            label: item.name,
            value: item.id,
            has_detail: item.has_detail,
          };
        }),
      });
    }
    console.log("result", result, this.state);
  }

  loadBranchSelect(field, values) {
    let value = field.value.find(
      (e) =>
        e.value === this.value(values, field.model, field.name, field.value)
    );
    if (value && !this.state.branchSelect)
      this.setState({
        branchSelect: value.value,
        has_detail: value.has_detail,
      });
    return value;
  }


  async viewFile(item, field){
    console.log(`item`, item,field)
    const result = await Storage.viewFile(item.url);
    if(result.success){
      this.openDocInNewTab(result.data)
    }
    console.log(`result`, result)

  }

   openDocInNewTab(url) {
    window.open(url, '_blank').focus();
   }
  

  render() {
    const { onChange, errors, view } = this.props;
    const { values } = this.state;
    console.log("view", this.state);
    return (
      <div>
        <Row>
          {this.state.fields.length > 0 &&
            this.state.fields.map((field, i) =>
              field.type === "text" ? (
                <Col
                  md={field.col}
                  style={{
                    display: field.hidden
                      ? "none"
                      : field.display.indexOf(view) !== -1
                      ? "block"
                      : "none",
                  }}
                >
                  <FormGroup
                    validationState={errors[field.name] ? "error" : ""}
                  >
                    <ControlLabel>
                      {field.label}{" "}
                      {errors[field.name] && <span className="star">*</span>}
                    </ControlLabel>
                    <InputMask
                      className="form-control"
                      mask={field.mask}
                      placeholder={field.label}
                      name={field.name}
                      value={this.value(
                        values,
                        field.model,
                        field.name,
                        field.value
                      )}
                      onChange={(e) =>
                        [
                          onChange(
                              field.name,
                              e.target.value,
                              field.model,
                              field.mask
                          ),
                          this.initRules(field.name, e.target.value)
                        ]
                      }
                      type={field.type}
                      disabled={field.disabled}
                    />
                    {errors[field.name] && <span style={{color:'red',fontSize: 10}} >Este campo es requerido</span>}
                  </FormGroup>
                </Col>
              ) : field.type === "header" ? (
                <Col
                  md={field.col}
                  style={{
                    display: field.hidden
                      ? "none"
                      : field.display.indexOf(view) !== -1
                      ? "block"
                      : "none",
                  }}
                >
                  <h4 style={{ color: "#073E7D" }}>
                    <b>{field.label}</b>
                  </h4>
                  <hr style={{ borderTop: "1px solid #073E7D" }} />
                </Col>
              ) : field.type === "date" ? (
                <Col
                  md={field.col}
                  style={{
                    display: field.hidden
                      ? "none"
                      : field.display.indexOf(view) !== -1
                      ? "block"
                      : "none",
                  }}
                >
                  <FormGroup
                    validationState={errors[field.name] ? "error" : ""}
                  >
                    <ControlLabel>
                      {field.label}{" "}
                      {errors[field.name] && <span className="star">*</span>}
                    </ControlLabel>
                    <Datetime
                      timeFormat={false}
                      name={field.name}
                      value={this.value(
                        values,
                        field.model,
                        field.name,
                        field.value
                      )}
                      inputProps={{ placeholder: field.label }}
                      onChange={(e) =>
                        onChange(
                          field.name,
                          moment(e).format("YYYY-MM-DD"),
                          field.model
                        )
                      }
                      defaultValue={new Date()}
                      disabled={field.disabled}
                    />
                    {errors[field.name] && <span style={{color:'red',fontSize: 10}} >Este campo es requerido</span>}
                  </FormGroup>
                </Col>
              ) : field.type === "email" ? (
                <Col
                  md={field.col}
                  style={{
                    display: field.hidden
                      ? "none"
                      : field.display.indexOf(view) !== -1
                      ? "block"
                      : "none",
                  }}
                >
                  <FormGroup
                    validationState={errors[field.name] ? "error" : ""}
                  >
                    <ControlLabel>
                      {field.label}{" "}
                      {errors[field.name] && <span className="star">*</span>}
                    </ControlLabel>
                    <FormControl
                      placeholder={field.label}
                      name={field.name}
                      id={field.name}
                      value={this.value(
                        values,
                        field.model,
                        field.name,
                        field.value
                      )}
                      onChange={(e) =>
                        onChange(field.name, e.target.value, field.model)
                      }
                      type={field.type}
                      disabled={field.disabled}
                    />
                    {errors[field.name] && <span style={{color:'red',fontSize: 10}} >Este campo es requerido</span>}
                  </FormGroup>
                </Col>
              ) : field.type === "password" ? (
                <Col
                  md={field.col}
                  style={{
                    display: field.hidden
                      ? "none"
                      : field.display.indexOf(view) !== -1
                      ? "block"
                      : "none",
                  }}
                >
                  <FormGroup
                    validationState={errors[field.name] ? "error" : ""}
                  >
                    <ControlLabel>
                      {field.label}{" "}
                      {errors[field.name] && <span className="star">*</span>}
                    </ControlLabel>
                    <FormControl
                      placeholder={field.label}
                      name={field.name}
                      autoComplete="off"
                      value={this.value(
                        values,
                        field.model,
                        field.name,
                        field.value
                      )}
                      onChange={(e) =>
                        onChange(field.name, e.target.value, field.model)
                      }
                      type={field.type}
                      disabled={field.disabled}
                    />
                    {errors[field.name] && <span style={{color:'red',fontSize: 10}} >Este campo es requerido</span>}
                  </FormGroup>
                </Col>
              ) : field.type === "number" ? (
                <Col
                  md={field.col}
                  style={{
                    display: field.hidden
                      ? "none"
                      : field.display.indexOf(view) !== -1
                      ? "block"
                      : "none",
                  }}
                >
                  <FormGroup
                    validationState={errors[field.name] ? "error" : ""}
                  >
                    <ControlLabel>
                      {field.label}{" "}
                      {errors[field.name] && <span className="star">*</span>}
                    </ControlLabel>
                    <FormControl
                      placeholder={field.label}
                      name={field.name}
                      id={field.name}
                      value={this.value(
                        values,
                        field.model,
                        field.name,
                        field.value
                      )}
                      onChange={(e) =>

                            [
                              onChange(field.name, e.target.value, field.model),
                                this.initRules(field.name, e.target.value)
                            ]
                      }
                      type={field.type}
                      disabled={field.disabled}
                    />
                    {errors[field.name] && <span style={{color:'red',fontSize: 10}} >Este campo es requerido</span>}
                  </FormGroup>
                </Col>
              ) : field.type === "textarea" ? (
                <Col
                  md={field.col}
                  style={{
                    display: field.hidden
                      ? "none"
                      : field.display.indexOf(view) !== -1
                      ? "block"
                      : "none",
                  }}
                >
                  <FormGroup
                    validationState={errors[field.name] ? "error" : ""}
                  >
                    <ControlLabel>
                      {field.label}{" "}
                      {errors[field.name] && <span className="star">*</span>}
                    </ControlLabel>
                    <textarea
                      className="form-control"
                      placeholder={field.label}
                      name={field.name}
                      value={this.value(
                        values,
                        field.model,
                        field.name,
                        field.value
                      )}
                      onChange={(e) =>
                        onChange(field.name, e.target.value, field.model)
                      }
                      type={field.type}
                      disabled={field.disabled}
                    />
                    {errors[field.name] && <span style={{color:'red',fontSize: 10}} >Este campo es requerido</span>}
                  </FormGroup>
                </Col>
              ) : field.type === "checkbox" ? (
                <Col
                  md={field.col}
                  style={{
                    display: field.hidden
                      ? "none"
                      : field.display.indexOf(view) !== -1
                      ? "block"
                      : "none",
                  }}
                >
                  <FormGroup
                    validationState={errors[field.name] ? "error" : ""}
                  >
                    <Checkbox
                      number={field.name}
                      label={
                        field.label + " " + (errors[field.name] ? "*" : "")
                      }
                      checked={this.value(
                        values,
                        field.model,
                        field.name,
                        field.value
                      )}
                      onClick={(e) =>
                        onChange(field.name, e.target.checked, field.model)
                      }
                      disabled={field.disabled}
                    />
                    {errors[field.name] && <span style={{color:'red',fontSize: 10}} >Este campo es requerido</span>}
                  </FormGroup>
                </Col>
              ) : field.type === "title" ? (
                <Col
                  md={field.col}
                  style={{
                    display: field.hidden
                      ? "none"
                      : field.display.indexOf(view) !== -1
                      ? "block"
                      : "none",
                  }}
                >
                  <FormGroup style={{ paddingLeft: "2%" }}>
                    <label>{field.label}:</label>
                  </FormGroup>
                </Col>
              ) : field.type === "br" ? (
                <Col md={field.col}>
                  <FormGroup style={{ paddingLeft: "2%" }}>
                    <br />
                  </FormGroup>
                </Col>
              ) : field.type === "image" ? (
                <Col md={field.col}>
                  <ControlLabel>{field.label}:</ControlLabel>
                  <br />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      cursor: "pointer",
                    }}
                    onClick={() => this.fileImage("file" + field.name)}
                  >
                    <img
                      src={this.state.imgprofile || avatar}
                      className="img-thumbnail"
                      width="100"
                      alt="profile"
                    />
                    &nbsp;&nbsp;
                    <i
                      className={"fa fa-pencil"}
                      style={{ fontSize: 17, color: "#103F88" }}
                    ></i>
                    <input
                      type="file"
                      accept="images/*"
                      id={"file" + field.name}
                      onChange={(e) =>
                        this.fileChange(
                          e,
                          field.name,
                          values["employee"],
                          field.model
                        )
                      }
                      style={{ display: "none" }}
                    />
                  </div>
                </Col>
              ) : field.type === "file" ? (
                <Col
                  md={field.col}
                  style={{
                    width: "90%",
                    display: field.hidden
                      ? "none"
                      : field.display.indexOf(view) !== -1
                      ? "block"
                      : "none",
                  }}
                >
                  {/* <div
                    style={{
                      display: "flex",
                      width: "90%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                    }}
                  >
                    {this.cardFile(field.name, false, null)}
                    {this.state.files.length > 0 &&
                      this.state.files.map((item, i) =>
                        this.cardFile(field.name, true, item.name, item.url)
                      )}
                  </div>
                  <input
                    type="file"
                    id={"file" + field.name}
                    multiple={true}
                    onChange={(e) =>
                      this.uploadFile(
                        e,
                        field.child.path,
                        values[field.child.model][field.child.field],
                        field.model,
                        field.name
                      )
                    }
                    style={{ display: "none" }}
                  /> */}
                  <br />
                  <Button wd bsStyle="info" onClick={() => this.openModal()}>
                    <span className="btn-label">
                      <i className="fa fa-plus" />
                    </span>{" "}
                    Agregar nuevo archivo
                  </Button>
                  {this.state.files.length > 0 &&
                    this.state.files.map((item, i) => (
                      <div>
                        <hr />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            backgroundColor: "#FFFFFF",
                          }}
                        >
                          <div>
                            
                            <i
                              className={"fa fa-user"}
                              style={{ color: "#23CCEF" }}
                            ></i>
                            <label>{item.name}</label>
                          </div>
                          <div>
                            <i
                              className={"fa fa-eye"}
                              style={{ color: "green", cursor: "pointer" }}
                              onClick={()=>this.viewFile(item,field)}
                            ></i>
                            <i
                              className={"fa fa-close"}
                              style={{ color: "red", cursor: "pointer" }}
                              onClick={() =>
                                this.removeFile(
                                  item.url,
                                  field.name,
                                  field.model,
                                  item.id
                                )
                              }
                            ></i>
                          </div>
                          

                        </div>
                      </div>
                    ))}

                  <Modal
                    body={
                      <FileBody
                        onChange={this.onChangeFilesInput}
                        fields={this.state.fileSelected}
                      />
                    }
                    title="Subir un nuevo archivo"
                    alertMessage={this.props.alertMessage}
                    modalShow={this.state.modal}
                    modalCreate={this.openModal}
                    saveMethod={() => {
                      this.state.fileSelected.name &&
                        this.uploadFile(
                          field.child.path,
                          values[field.child.model][field.child.field],
                          field.model,
                          field.name
                        );
                    }}
                  />
                </Col>
              ) : field.type === "table" ? (
                <Col
                  md={field.col}
                  style={{
                    display: field.hidden
                      ? "none"
                      : field.display.indexOf(view) !== -1
                      ? "block"
                      : "none",
                  }}
                >
                  <FormGroup
                    validationState={errors[field.name] ? "error" : ""}
                  >
                    <Datatable
                      thArray={field.headers}
                      permissions={this.props.permissions}
                      location={this.props.location}
                      tdArray={{
                        data: this.value(
                          values,
                          field.model,
                          field.name,
                          field.value
                        ),
                      }}
                      loading={false}
                      view={field.model}
                      selectedItem={this.selectedItem}
                      items={this.state.seletectedItems}
                      deleteMethod={() => {
                        field.delete && this.deleteTable(field.delete);
                      }}
                      changePage={this.changePage}
                      create={field.create}
                      openDetail={field.openDetail}
                      titleBtn={field.btnName}
                    />
                  </FormGroup>
                </Col>
              ) : field.type === "branchButton" ? (
                <Col
                  md={field.col}
                  style={{
                    display: field.hidden
                      ? "none"
                      : field.display.indexOf(view) !== -1
                      ? "block"
                      : "none",
                  }}
                >
                  <FormGroup
                    validationState={errors[field.name] ? "error" : ""}
                  >
                    <InputGroup>
                      <ControlLabel>
                        {field.label}{" "}
                        {errors[field.name] && <span className="star">*</span>}
                      </ControlLabel>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name={field.name}
                        value={this.loadBranchSelect(field, values)}
                        onChange={(e) => [
                          onChange(field.name, e.value, field.model),
                          this.initRules(field.name, e.value),
                          this.setState({
                            branchSelect: e.value,
                            has_detail: e.has_detail,
                          }),
                        ]}
                        options={
                          this.state.branchesFilter.length > 0
                            ? this.state.branchesFilter
                            : []
                        }
                        placeholder={field.label}
                        isDisabled={field.disabled}
                      />
                      <InputGroup.Addon
                        style={{ border: "0px", paddingTop: 24 }}
                      >
                        {this.state.branchSelect &&
                          this.state.has_detail === 1 && (
                            <Button
                              fill
                              bsStyle="primary"
                              onClick={this.openModalBranch}
                            >
                              <i className="fa fa-plus"></i>
                            </Button>
                          )}
                      </InputGroup.Addon>
                    </InputGroup>
                  </FormGroup>
                  <Modal
                    body={
                      this.state.branchSelect===5?
                      <MotorBody
                        onChange={this.props.onChange}
                        fieldsValues={values}
                        brandSelect={this.state.branchSelect}
                        model={field.model}
                        name={"branch_detail"}
                        modalClose={this.openModalBranch}
                      />
                      :
                      <Riesgo
                        onChange={this.props.onChange}
                        fieldsValues={values}
                        brandSelect={this.state.branchSelect}
                        model={field.model}
                        name={"branch_detail"}
                        modalClose={this.openModalBranch}
                      />
                    }
                    title="Detalle Del Ramo"
                    alertMessage={this.props.alertMessage}
                    modalShow={this.state.modalBranch}
                    modalCreate={this.openModalBranch}
                    saveMethod={false}
                    notClose={true}
                  />
                </Col>
              ) : (
                field.type === "select" && (
                  <Col
                    md={field.col}
                    style={{
                      display: field.hidden
                        ? "none"
                        : field.display.indexOf(view) !== -1
                        ? "block"
                        : "none",
                    }}
                  >
                    <FormGroup
                      validationState={errors[field.name] ? "error" : ""}
                    >
                      <ControlLabel>
                        {field.label}{" "}
                        {errors[field.name] && <span className="star">*</span>}
                      </ControlLabel>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name={field.name}
                        value={field.value.find(
                          (e) =>
                            e.value ===
                            this.value(
                              values,
                              field.model,
                              field.name,
                              field.value
                            )
                        )}
                        onChange={(e) => [
                          onChange(field.name, e.value, field.model),
                          this.initRules(field.name, e.value),
                          field.name === "insurances" &&
                            this.onValueBranchOfInsurances(e.value),
                        ]}
                        options={field.value}
                        placeholder={field.label}
                        isDisabled={field.disabled}
                      />
                      {errors[field.name] && <span style={{color:'red',fontSize: 10}} >Este campo es requerido</span>}
                    </FormGroup>
                  </Col>
                )
              )
            )}
        </Row>
      </div>
    );
  }
}

export default body;

