import { observable, computed } from "mobx";
import { Payments, Branches, Clients, Insurances } from "../../services/index";
import { PaymentsForm,PaymentsClientForm } from "../../jsonForms/index";
import moment from "moment";

class PaymentController {
  @observable load = true;
  @observable AllListPayment = [];
  @observable AllListPaymentByPolicy = [];
  @observable AllListPaymentInsurence = [];
  @observable fieldErrors = PaymentsForm.fieldErrors;
  @observable headers = PaymentsForm.headers;
  @observable headersClient = PaymentsClientForm.headers;
  @observable fields = PaymentsForm.fieldsPages;
  @observable Payments = [];
  @observable PaymentById = [];
  @observable allUsers = [];
  @observable existPayments = false;
  @observable isActive = false;
  @observable typePayment = "people";

  @computed
  get modelPayments() {
    return this.model;
  }

  @computed
  get getDataPayments() {
    return this.Payments;
  }

  @computed
  get PaymentByIdInfo() {
    return this.PaymentById;
  }

  @computed
  get loading() {
    return this.load;
  }

  @computed
  get getTypePayment() {
    return this.typePayment;
  }

  @computed
  get getAllListPayment() {
    return this.AllListPayment;
  }
  @computed
  get getAllListPaymentByPolicy() {
    return this.AllListPaymentByPolicy;
  }
  @computed
  get getAllListPaymentInsurence() {
    return this.AllListPaymentInsurence;
  }
  @computed
  get isExistPayments() {
    return this.existPayments;
  }

  statusLoading(status) {
    this.load = status;
  }

  changePayment(type) {
    this.typePayment = type;
  }

  async getPayments(model) {
    const result = await Payments.getPayments(model);
    return result.data;
  }

  async initValues() {
    if (this.init) return;
    const fieldsAll = this.fields;
    const branch = await Branches.getBranches();
    const clients = await Clients.getClients();
    const insurances = await Insurances.getInsurancesAll();
    console.log("branch.data.data", insurances.data);

    for (const x in fieldsAll) {
      let fields = fieldsAll[x].fields;
      console.log("fields", fields);
      for (const i in fields) {
        if (fields[i].name === "branch_id") {
          fields[i].value = branch.data.data.map((item, i) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
        }
        if (fields[i].name === "client_id") {
          fields[i].value = clients.data.data.map((item, i) => {
            return {
              label: item.name + " " + item.last_name,
              value: item.id,
              type: item.type,
            };
          });
        }
        if (fields[i].name === "insurances") {
          fields[i].value = insurances.data.map((item, i) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
        }
      }
    }

    this.init = true;
  }

  async getPaymentById(id) {
    const result = await Payments.getPaymentsById(id);
    if (result.data.success && result.status === 200)
      this.Payments = result.data;
    if (!result.data.success || result.status !== 200) this.PaymentById = [];

  }

  async deletePaymentById(id) {
    const result = await Payments.deletePayment(id);
    return result.data;
  }

  async getPaymentsAllPayment() {
    
    const result = await Payments.getPayments();
    if (result.data && result.status === 200) this.AllListPayment = result.data;
  }

  async getPaymentsBypolicy(id) {
    const result = await Payments.getPaymentsBypolicy(id);
    if (result.data && result.status === 200) {
      let data = result.data.data.payments;
      console.log('data@@@@@@@@@@@ :>> ', result.data);
      let json = [];
      let today = new Date();
      for (const i in data) {
        let date = new Date(data[i].limit_payment_date);
        json.push([
          ( parseInt(i) +1),
          data[i].limit_payment_date,
          data[i].commissioned_mount,
          data[i].value_to_paid.toFixed(2),
          data[i].collected_insurance === 1? "c%#0fad17%PAGO" : today<date? "c%#e59b1b%PENDIENTE": today>date? "c%#ff0000%ATRASO":null
        ]);
      }


      this.existPayments = (json.length>0)
      result.data = json;
      this.AllListPaymentByPolicy = result.data;

    }
  }


  async getPaymentsPendingInsurences(filter,page = 1) {
    this.AllListPaymentInsurence = []
    const result = await Payments.getPaymentPending(filter, page)
    if (result.data && result.status === 200) {
      let data = result.data.payments.data;
      console.log('data@@@@@@@@@@@ insurence :>> ', result.data);
      let jsonInsurence = [];
      let today = new Date();
      for (const i in data) {
        let date = new Date(data[i].limit_payment_date);
        console.log('data@@@@@@@@@@@ insurence :>> ', data[i]);
        jsonInsurence.push([
          data[i].policy.policy_number,
          data[i].payment_number,
          data[i].policy.client.clientName,
          //data[i].policy.branch.insurances[0].name,
          data[i].policy.branch.name,
          data[i].value_to_paid.toFixed(2) +' $RD',
          data[i].value_to_paid.toFixed(2)+' $RD',
          (data[i].value_to_paid + data[i].commissioned_mount).toFixed(2)+' $RD',
          data[i].expiredDays,
          data[i].limit_payment_date,
          "drop%Accion%Recaudar a Oficina%"+ data[i].id+"%"+data[i].value_to_paid.toFixed(2)

        ]);
      }


      this.existPayments = (jsonInsurence.length > 0)
      result.data.payments.data = jsonInsurence;
      this.AllListPaymentInsurence = result.data.payments;
    }
  }

  async getPaymentsPedingClient(filter,page = 1) {
    this.AllListPayment = []
    const result = await Payments.getPaymentPending(filter,page)
    if (result.data && result.status === 200) {
      let data = result.data.payments.data;
      console.log('data@@@@@@@@@@@ :>> ', result.data);
      let json = [];
      let today = new Date();
      for (const i in data) {
        let date = new Date(data[i].limit_payment_date);
        json.push([
          data[i].policy.payment_number,
          data[i].payment_number,
          data[i].policy.client.clientName,
         // data[i].policy.branch.insurances[0].name,
          data[i].policy.branch.name,
          data[i].value_to_paid.toFixed(2) +' $RD',
          data[i].value_to_paid.toFixed(2)+' $RD',
          (data[i].value_to_paid + data[i].commissioned_mount).toFixed(2)+' $RD',
          data[i].expiredDays,
          data[i].limit_payment_date,
          "drop%Accion%Recaudar a Aseguradora%"+ data[i].id+"%"+data[i].value_to_paid.toFixed(2)

        ]);
      }


      this.existPayments = (json.length>0)
      result.data.payments.data = json;
      this.AllListPayment = result.data.payments;

    }
  }


  async getAllPayments(page) {
    //this.initValues();
    const result = await Payments.getPayments(page || 1);
    console.log("result", result);
    if (result.status === 200 && result.data) {
      let data = result.data;
      this.Payments = data;
      console.log("this.Payments", result.data);
    } else {
      this.Payments = [];
    }
    this.load = false;
  }

  async filterPayment(field, page, body) {
    const result = await Payments.filterDatePayment(field, page, body);
    if (result.status === 200 && result.data) {
      console.log("result.data.data", result.data.data);
      let data = result.data.data;
      let json = [];
      for (const i in data) {
        json.push([
          data[i].id,
          data[i].status,
          data[i].renewable,
          data[i].description_insured_property,
          data[i].insured_amount,
          data[i].additional_beneficiary_name,
          moment(data[i].validity_start_date).format('DD/MM/YYYY'),
          moment(data[i].validity_end_date).format('DD/MM/YYYY'),
        ]);
      }

      result.data.data = json;
      this.Payments = result.data;

      console.log("this.Payments", result.data);
    } else {
      this.Payments = [];
    }
    this.load = false;
  }

  async savePayment(body) {
    let content = Object.assign({}, body.payments);
    console.log("content", content);
    const result = await Payments.savePayment(content);
    return result.data;
  }

  async payToOffice(body){
    let content = Object.assign({},body);
    const result = await Payments.payToOffice(content);
    return result.data
  }

  async payToIsurece(body){
    let content = Object.assign({},body);
    const result = await Payments.payToIsurece(content);
    return result.data
  }

  async updatePayment(body) {
    console.log("body", body);
    let content = Object.assign({}, body.payments);

    console.log("content", content);
    const result = await Payments.updatePayment(body.Payment_id, content);
    return result.data;
  }
}

export default PaymentController;
