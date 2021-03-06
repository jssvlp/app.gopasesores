import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "components/CustomButton/CustomButton.jsx";
import BodyContent from "../../components/bodyForm/contentBody";

import Wizzard from "../../components/stepsWizzard/StepsWizzard";
import { Table, Grid, Row, Col, Tooltip, OverlayTrigger, Pagination } from "react-bootstrap";

import moment from "moment";
import Skeleton from "react-loading-skeleton";
@inject("polices", "users","clients")
@observer
class Polices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      pages:[],
      pageSelect: 1,
      fistPage: 1,
      lastPage: 1,
      itemsPage:[],
      reloadCommision:true,
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
    const { polices, users } = this.props;
    let permission = users.infoUser.permissions;
    polices.statusLoading(true);



    let AllPermission =  permission && permission.filter((el)=>{
      return el.path === "/payments"
    })
    console.log('this.props.history.location', AllPermission, permission)
    let idClient =  this.props.history.location.state? this.props.history.location.state.idClient? this.props.history.location.state.idClient:null : null
    this.reloadTable(idClient);


    this.setState({
      idClient: idClient,
      errors: polices.fieldErrors,
      permissionPayment: AllPermission,
    });
    console.log("polices.fieldErrors", polices.fieldErrors);
    polices.statusLoading(false);
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const { polices,clients } = this.props;
    let body = this.state.body.polices
    let reload = this.state.reloadCommision
    if((body && body.branch_id && body.insurances && reload)
        || this.state.changeBranch !== body.branch_id
        || this.state.changeInsurence !== body.insurances ){
      let comissionCompany = await polices.getCommissionCompany(body.insurances,body.branch_id);
      if(comissionCompany.success){
        body.commission_percentage = comissionCompany.commision.commission_percentage;
        body.isc = comissionCompany.commision.isc_percent
        this.setState({
          body:{polices:body},
          reloadCommision:false,
          changeBranch: body.branch_id,
          changeInsurence: body.insurances
        })
      }

      return false
    }


    if(body.client_id && this.state.changeClient !== body.client_id){
      await clients.getClientById(body.client_id);
      let comiisonCLient = clients.clientByIdInfo.owner.pivot.commission_percentage
      console.log('owner',clients.clientByIdInfo.owner)
      body.commission_percentage_client_owner = comiisonCLient
      this.setState({
        body:{polices:body},
        changeClient: body.client_id
      })
      console.log(comiisonCLient)
      return false
    }
    console.log('state',this.state.body)

  }


  reloadTable(idClient) {
    const { polices } = this.props;
    polices.getAllPolicies(null,idClient);
  }

  changePage(page) {
    const { polices } = this.props;
    polices.getAllPolicies(page,null);
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
      this.reloadTable(null);
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
    let neta = (polices.PolicyByIdInfo.isc/100) * polices.PolicyByIdInfo.prime
    polices.PolicyByIdInfo.neta = neta;
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
      this.reloadTable(null);
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
    this.reloadTable(null);
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
    this.reloadTable(null);
    this.setState({
      seletectedItems: [],
    });
  }

  selectpage(p){
    this.setState({
      pageSelect:p
    })
    this.changePage(p)
    this.scrollTop();
  }


  createPolicy(id){
    this.props.history.push({
      pathname:"/admin/sinisters",
      state:{
        idPolicy:id
      }
    })
  }

  scrollTop(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  render() {
    const { polices, users } = this.props;
   // console.log("polices.getDataPolicies",  users.infoUser.permissions);

    const steps = [
      {
        name: polices.fields.polices.title,
        errors: this.state.errors.polices,
        component: (
          <BodyContent
            fields={polices.fields.polices.fields}
            fieldValues={this.state.body}
            setValue={this.setValue}
            rules={polices.fields.polices.rules}
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

    if(polices.loading){
      return(
          <div
              className="main-content"
              style={{ padding: !this.state.create ? 60 : 0 }}
          >
            <div className={"card"} style={{padding: 20}}>
              <Skeleton  height={250} width={'100%'}/>
            </div>
            <br/>
            <div className={"card"} style={{padding: 20}}>
              <Skeleton  height={250} width={'100%'}/>
            </div>
            <br/>
            <div className={"card"} style={{padding: 20}}>
              <Skeleton  height={250} width={'100%'}/>
            </div>
          </div>


      )
    }else{
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
                          <b>{item.has_sinister === 0 ? "No" : "Si" }</b>
                        </label><br/>
                        {item.has_sinister === 0 &&(
                            <Button
                                onClick={() => this.createPolicy(item.id)}
                                bsStyle="warning"
                                bsSize="sm"
                                fill

                            >
                              Reportar Sinistro <i className="fa fa-plus"></i>
                            </Button>
                        )}

                        {item.has_sinister === 1 &&(
                            <Button
                                onClick={() => this.props.history.push("sinisters")}
                                bsStyle="success"
                                bsSize="sm"


                            >
                              Ver Sinistro <i className="fa fa-eye"></i>
                            </Button>
                        )}

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
                          &nbsp;&nbsp;
                          {this.state.permissionPayment && this.state.permissionPayment.length>0&&(
                              <Button
                                  onClick={() => [localStorage.setItem("idPolicy", item.id),localStorage.setItem("prime", item.prime),  this.props.history.push({
                                    pathname:"/admin/payments",
                                    state:{
                                      idPolicy:item.id
                                    }
                                  })]
                                  }
                                  bsStyle="default"
                                  bsSize="sm"
                                  fill

                              >
                                Acuerdo de Pago <i className="fa fa-dollar"></i>
                              </Button>
                          )}

                          &nbsp;&nbsp;
                          {this.state.permissionPayment && this.state.permissionPayment.length>0&&(
                              <Button
                                  onClick={() => [localStorage.setItem("idPolicy", item.id),localStorage.setItem("prime", item.prime),  this.props.history.push({
                                    pathname:"/admin/payments",
                                    state:{
                                      idPolicy:item.id
                                    }
                                  })]
                                  }
                                  onClick={() => this.props.history.push("payclient")}
                                  bsStyle="success"
                                  bsSize="sm"
                                  fill

                              >
                                Cobros <i className="fa fa-dollar"></i>
                              </Button>
                          )}


                          &nbsp;&nbsp;
                          <Button
                              onClick={() => this.openDetail(item.id)}
                              bsStyle="info"
                              bsSize="sm"
                              fill

                          >
                            Editar <i className="fa fa-edit"></i>
                          </Button>
                          &nbsp;&nbsp;
                          <Button
                              bsStyle="danger"
                              bsSize="sm"
                              fill

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
            {polices.getDataPolicies&&polices.getDataPolicies.last_page>0&&(
                <Pagination className="pagination-blue" style={{paddingLeft: 10}}>
                  <Pagination.First  onClick={()=> polices.changePage(polices.getFisrtPage)} />
                  {polices.getAllPages.length>0&&
                  polices.getAllPages.map((p,i)=>(
                      <Pagination.Item active={polices.getPageSelect=== p} onClick={()=>  polices.changePage(p)}>{p}</Pagination.Item>
                  ))}
                  <Pagination.Last  onClick={()=> polices.changePage(polices.getLastPage)}/>
                </Pagination>
            )}
          </div>
      );
    }

  }
}
export default Polices;
