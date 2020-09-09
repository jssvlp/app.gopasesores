import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "components/CustomButton/CustomButton.jsx";
import BodyContent from "../../components/bodyForm/contentBody";
import Wizzard from "../../components/stepsWizzard/StepsWizzard";
import moment from "moment";
@inject("polices", "users")
@observer
class Polices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      body: {
        polices: {
          police_code: "",
          renewable: false,
        },
        documents: [],
      },
      errors: {
        polices: [],
        documents: [],
      },
      police_id: null,
      create: false,
      update: false,
      id_permissions: null,
      seletectedItems: [],
      modalPermission: false,
      dateStart: moment().format("YYYY-MM-DD"),
      dateEnd: moment().format("YYYY-MM-DD"),
    };
    this.changePage = this.changePage.bind(this);
    this.openModal = this.openModal.bind(this);
    this.setValue = this.setValue.bind(this);
    this.savepolice = this.savepolice.bind(this);
    this.openDetail = this.openDetail.bind(this);
    this.closeWizard = this.closeWizard.bind(this);
    this.updatepolice = this.updatepolice.bind(this);
    this.deletepolice = this.deletepolice.bind(this);
    this.selectedItem = this.selectedItem.bind(this);
    this.filterDate = this.filterDate.bind(this);
    this.openModalPermissions = this.openModalPermissions.bind(this);
    this.addPermissions = this.addPermissions.bind(this);
    this.deletePermissons = this.deletePermissons.bind(this);
    this.setIdPermissons = this.setIdPermissons.bind(this);
  }

  componentDidMount() {
    const { polices } = this.props;
    polices.statusLoading(true);
    this.reloadTable();
    this.setState({
      errors: polices.fieldErrors,
    });
    console.log("polices.fieldErrors", polices.fieldErrors);
    polices.statusLoading(false);
  }

  reloadTable() {
    const { polices } = this.props;
    polices.getAllPolicies();
  }

  changePage(page) {
    const { polices } = this.props;
    polices.getAllpolices(page);
  }

  openModal() {
    this.setState({
      create: !this.state.create,
      update: false,
      body: {
        polices: {
          renewable: false,
        },
        documents: [],
        update: false,
      },
    });
  }

  async setValue(name, value, modelName, mask = null) {
    const { polices } = this.props;
    let body = this.state.body;

    if (modelName === null && body) {
      body[name] = value;
      this.setState({
        body: body,
        errors: this.setErrors(name, value, modelName, mask),
      });
      return;
    }

    let model = body[modelName];
    console.log("model", modelName, name);
    model[name] = value;
    body[modelName] = model;
    this.setState({
      body: body,
      errors: this.setErrors(name, value, modelName, mask),
    });
  }

  setErrors(name, value, model, mask) {
    let errorsArray = this.state.errors;
    let errors = [];

    if (model) errors = errorsArray[model];
    if (!model) errors = errorsArray;

    if (mask)
      !value.endsWith("_") ? (errors[name] = false) : (errors[name] = true);
    if (!mask) value ? (errors[name] = false) : (errors[name] = true);

    model ? (errorsArray[model] = errors) : (errorsArray = errors);
    //console.log('errors', errorsArray)
    return errorsArray;
  }

  verifyErrors() {
    let body = this.state.body;
    let errors = this.state.errors;
    for (const i in body) {
      let value = body[i];

      if (typeof value === "object") {
        for (const key in value) {
          let model = errors[i];
          value && (model[key] = false);
        }
        continue;
      }
      if (typeof value === "string") {
        value && (errors[i] = false);
      }
    }
  }

  async savepolice() {
    const { polices } = this.props;
    let body = this.state.body;
    const result = await polices.savePolicy(body);
    console.log("result", result);
    if (result.success) {
      this.props.alertMessage(
        "Se ha creado la poliza",
        "Puede verificar en la lista la nueva poliza registrada",
        "success"
      );
      this.setState({
        create: false,
      });
      this.reloadTable();
    }
    if (!result.success)
      this.props.alertMessage(
        result.message,
        "Favor verificar los datos",
        "error"
      );
  }

  async filterDate(date, name) {
    const { polices } = this.props;
    this.setState({
      [name]: date,
    });
    let body = {
      filter_values: [this.state.dateStart, this.state.dateEnd],
    };
    await polices.filterpolice("created_at", 1, body);
  }

  configurationsTable(data) {
    const { polices } = this.props;
    let fields = polices.fields.polices.fields;

    for (const i in fields) {
      if (fields[i].name === "permissions") {
        fields[i].delete = this.deletePermissons;
        fields[i].create = this.openModalPermissions;
      }
    }
    return data.map((item, i) => {
      return [item.id, item.name, item.path];
    });
  }

  openModalPermissions() {
    this.setState({
      modalPermission: !this.state.modalPermission,
      body: {
        permissions: [],
      },
    });
  }

  setIdPermissons(id) {
    this.setState({
      id_permissions: id,
    });
  }

  async addPermissions() {
    const { polices } = this.props;
    const result = await polices.addPermissions(
      this.state.police_id,
      this.state.id_permissions
    );
    console.log("result", result);
    if (result.success) {
      this.props.alertMessage(
        "Se agrego el permiso",
        "Puede verificar en la lista el nuevo permiso registrado",
        "success"
      );
      this.setState({
        modalPermission: !this.state.modalPermission,
      });
      await this.reloadPermissionsTable(polices, this.state.police_id);
    }
    if (!result.success)
      this.props.alertMessage(
        result.message,
        "Favor verificar los datos",
        "error"
      );
  }

  async deletePermissons(id_permissions) {
    const { polices } = this.props;
    const result = await polices.deletePermissions(
      this.state.police_id,
      id_permissions
    );
    await this.reloadPermissionsTable(polices, this.state.police_id);
    return result;
  }

  async reloadPermissionsTable(polices, id) {
    await polices.getpoliceById(id);
    console.log("policesss", polices.policeByIdInfo);
    delete polices.policeByIdInfo.rol.updated_at;
    delete polices.policeByIdInfo.rol.created_at;
    polices.policeByIdInfo.rol.permissions = this.configurationsTable(
      polices.policeByIdInfo.rol.permissions
    );
    console.log("polices.field.foie", polices.fields.polices.fields);
    let body = {
      polices: polices.policeByIdInfo.rol,
      police_id: id,
    };
    this.setState({
      body: body,
      update: true,
      police_id: id,
    });
    this.verifyErrors();
    //  this.props.alertLoading("Espere un momento....",false)
  }

  async openDetail(id) {
    const { polices } = this.props;
    console.log("id", id);
    this.props.alertLoading("Espere un momento....", true);
    await polices.getPolicyById(id);
    console.log("policesss", polices.PolicyByIdInfo);
    delete polices.PolicyByIdInfo.updated_at;
    delete polices.PolicyByIdInfo.created_at;
    polices.PolicyByIdInfo.branch_detail &&
      delete polices.PolicyByIdInfo.branch_detail.updated_at;
    polices.PolicyByIdInfo.branch_detail &&
      delete polices.PolicyByIdInfo.branch_detail.created_at;
    console.log("polices.field.foie", polices.fields.polices.fields);
    let body = {
      polices: polices.PolicyByIdInfo,
      police_id: id,
      documents: polices.PolicyByIdInfo.documents,
    };
    this.setState({
      body: body,
      create: true,
      update: true,
      police_id: id,
    });
    this.verifyErrors();
    this.props.alertLoading("Espere un momento....", false);
  }

  closeWizard() {
    this.setState({
      create: !this.state.create,
    });
  }

  async updatepolice() {
    const { polices } = this.props;
    let body = this.state.body;
    const result = await polices.updatePolicy(body);
    console.log("result", result);
    if (result.success) {
      this.props.alertMessage(
        "Se ha actualizado el Rol",
        "Puede verificar en la lista el Rol actualizado",
        "success"
      );
      this.setState({
        create: false,
      });
      this.reloadTable();
    }
    if (!result.success)
      this.props.alertMessage(
        result.message,
        "Favor verificar los datos",
        "error"
      );
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

  async deletepolice() {
    const { polices } = this.props;
    let items = this.state.seletectedItems;
    let allErrorsDelete = [];
    this.props.alertLoading("Eliminando Espere un momento....", true);
    for (const i in items) {
      console.log("items[i]", items[i]);
      let result = await polices.deletepoliceById(items[i]);
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
    this.reloadTable();
    this.setState({
      seletectedItems: [],
    });
  }

  async deletePolicyById(id) {
    const { polices } = this.props;
    let allErrorsDelete = [];
    this.props.alertLoading("Eliminando Espere un momento....", true);

    let result = await polices.deletePolicyById(id);
    console.log("items[i]", result);
    !result.success && allErrorsDelete.push(id);

    this.props.alertLoading("Eliminando Espere un momento....", false);
    if (allErrorsDelete.length > 0) {
      this.props.alertMessage(
        "Ups!, algunas polizas no se eliminaron",
        "los siguientes Polizas no se borraron: " + allErrorsDelete.toString(),
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
    this.reloadTable();
    this.setState({
      seletectedItems: [],
    });
  }

  render() {
    const { polices, users } = this.props;
    console.log("polices.getDataPolicies", polices.getDataPolicies);
    const steps = [
      {
        name: polices.fields.polices.title,
        errors: this.state.errors.polices,
        component: (
          <BodyContent
            fields={polices.fields.polices.fields}
            fieldValues={this.state.body}
            setValue={this.setValue}
            errors={this.state.errors.polices}
            alertMessage={this.props.alertMessage}
            alertLoading={this.props.alertLoading}
            showSteps={false}
            permissions={users.infoUser}
            location={this.props.location}
            view={this.state.update ? "update" : "create"}
            method={this.state.update && this.updatepolice}
            buttonName={this.state.update ? "Actualizar" : "Guardar"}
          />
        ),
      },
      {
        name: polices.fields.documents.title,
        errors: this.state.errors.documents,
        component: (
          <BodyContent
            fields={polices.fields.documents.fields}
            fieldValues={this.state.body}
            setValue={this.setValue}
            errors={this.state.errors.documents}
            alertMessage={this.props.alertMessage}
            alertLoading={this.props.alertLoading}
            showSteps={false}
            permissions={users.infoUser}
            location={this.props.location}
            view={this.state.update ? "update" : "create"}
            method={this.state.update ? this.updatepolice : this.savepolice}
            buttonName={this.state.update ? "Actualizar" : "Guardar"}
          />
        ),
      },
    ];
    console.log("this.state", this.state);
    return (
      <div
        className="main-content"
        style={{ padding: !this.state.create ? 60 : 0 }}
      >
        {this.state.create && (
          <Wizzard
            steps={steps}
            closeWizard={this.closeWizard}
            subtitle={""}
            title={
              this.state.update
                ? "DETALLE DE LA POLIZA"
                : "CREANDO UNA NUEVA POLIZA"
            }
          />
        )}
        {!this.state.create && (
          <Button bsStyle="primary" className="zoom" onClick={this.openModal}>
            Nueva Poliza
          </Button>
        )}
        <br />
        <br />
        <div className="row ">
          {!this.state.create &&
            polices.getDataPolicies.data &&
            polices.getDataPolicies.data.map((item, i) => (
              <div
                className="col-md-12 card zoom"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderBottom: "solid",
                  borderBottomColor: "#c9c9c9",
                  borderBottomWidth: 0.4,
                  borderTop: 0,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h3 style={{ color: "#053E7A" }}>
                    No. Poliza:{item.policy_number} | {item.insurance_name} |{" "}
                    {item.branch}
                  </h3>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ fontWeight: "normal" }}>
                      Cliente:{" "}
                      <b>
                        {item.client_document_id} - {item.client_name}
                      </b>
                    </label>
                    <label style={{ fontWeight: "normal" }}>
                      Vendedor: <b>{item.client_owner}</b>
                    </label>
                    <label style={{ fontWeight: "normal" }}>
                      Estado de cobros: <b>{item.payment_status}</b>
                    </label>
                    <label style={{ fontWeight: "normal" }}>
                      Descripción: <b>{item.description_insured_property}</b>
                    </label>
                    <label style={{ fontWeight: "normal" }}>
                      Tiene sinistro:{" "}
                      <b>{item.has_sinister === 0 ? "No" : "Si"}</b>
                    </label>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    <label>{item.validity_end_date}</label>
                    <label>{item.validity_start_date}</label>
                    <label>Vigente</label>
                    <label
                      style={{
                        backgroundColor: "#23ccef",
                        color: "white",
                        borderRadius: 2,
                        padding: 2,
                      }}
                    >
                      Nuevo
                    </label>
                    <br />
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <Button
                        onClick={() => this.openDetail(item.id)}
                        bsStyle="info"
                        bsSize="md"
                        fill
                        wd
                      >
                        Editar <i className="fa fa-edit"></i>
                      </Button>
                      &nbsp;&nbsp;
                      <Button
                        bsStyle="danger"
                        bsSize="md"
                        fill
                        wd
                        onClick={(e) => this.deletePolicyById(item.id)}
                      >
                        Eliminar <i className="fa fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            ))}
        </div>
      </div>
    );
  }
}
export default Polices;
