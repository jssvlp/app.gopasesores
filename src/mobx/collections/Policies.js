import { observable, computed } from "mobx";
import {
  Policies,
  Branches,
  Clients,
  Insurances,
  Lists,
} from "../../services/index";
import { PolicesForm } from "../../jsonForms/index";

class PolicyController {
  @observable load = true;
  @observable fieldErrors = PolicesForm.fieldErrors;
  @observable headers = PolicesForm.headers;
  @observable fields = PolicesForm.fieldsPages;
  @observable listPolicies = [];
  @observable Policies = [];
  @observable comission = [];
  @observable PolicyById = [];
  @observable allUsers = [];
  @observable isActive = false;
  @observable pages = [];
  @observable fistPage = 1;
  @observable lastPage =1;
  @observable pageSelect = 1;
  @observable typePolicy = "people";

  @computed
  get modelPolicies() {
    return this.model;
  }

  @computed
  get getDataPolicies() {
    return this.Policies;
  }

  @computed
  get PolicyByIdInfo() {
    return this.PolicyById;
  }

  @computed
  get getFisrtPage() {
    return this.fistPage;
  }

  @computed
  get getLastPage() {
    return this.lastPage;
  }

  @computed
  get getAllPages() {
    return this.pages;
  }

  @computed
  get loading() {
    return this.load;
  }

  @computed
  get getTypePolicy() {
    return this.typePolicy;
  }

  @computed
  get getListPolicies() {
    return this.listPolicies;
  }

  @computed
  get getExactComissionCompany() {
    return this.comission;
  }
  @computed
  get getPageSelect(){
    return this.pageSelect;
  }

  statusLoading(status) {
    this.load = status;
  }




  changePolicy(type) {
    this.typePolicy = type;
  }

  async initValues() {
    if (this.init) return;
    const fieldsAll = this.fields;
    const branch = await Branches.getBranches();
    const clients = await Clients.getClients();
    const insurances = await Insurances.getInsurancesAll();
    const status = await Lists.getLists("policyStatus");
    const currency = await Lists.getLists("currencies");
    console.log("branch.data.data", branch);

    for (const x in fieldsAll) {
      let fields = fieldsAll[x].fields;
      console.log("fields", fields);
      for (const i in fields) {
        if (fields[i].name === "branch_id") {
          fields[i].value = branch.data.data.map((item, i) => {
            return {
              label: item.name,
              value: item.id,
              has_detail: item.has_detail,
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
        if (fields[i].name === "status") {
          fields[i].value = status.data.data.map((item, i) => {
            return {
              label: item,
              value: item,
            };
          });
        }
        if (fields[i].name === "currency") {
          fields[i].value = currency.data.data.map((item, i) => {
            return {
              label: item,
              value: item,
            };
          });
        }
      }
    }

    this.init = true;
  }

  async getPolicyById(id) {
    const result = await Policies.getPoliciesById(id);
    if (result.data && result.status === 200) this.PolicyById = result.data;
    if (!result.data || result.status !== 200) this.PolicyById = [];
    console.log("result", result);
  }

  async getCommissionCompany(id,id_branch){
    const result = await Policies.comissionCompany(id,id_branch);
    if (result.data && result.status === 200) return result.data;
    if (!result.data || result.status !== 200) return [];
  }

  async deletePolicyById(id) {
    const result = await Policies.deletePolicy(id);
    return result.data;
  }

  async getPoliciesAllList() {
    const result = await Policies.getPoliciesAll();
    if (result.data && result.status === 200) this.listPolicies = result.data;
  }

  async changePage(page, idClient = null) {
    this.pageSelect = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await this.getAllPolicies(page, idClient)

  }

  async getAllPolicies(page,idClient) {
    this.load = true
    this.initValues();
    const result = await Policies.getPolicies(page || 1,idClient);
    console.log("result", result);
    if (result.status === 200 && result.data) {
      let data = result.data;
      this.Policies = data;
      this.fistPage = result.data.current_page;
      this.lastPage = result.data.last_page;

      let arraypages=[];
      for (let i = 1; i <= this.lastPage; i++) {
        arraypages.push(i)

      }
      this.pages = arraypages;
      console.log("this.Policies", result.data);
    } else {
      this.Policies = [];
    }
    this.load = false;
  }

  async filterPolicy(field, page, body) {
    const result = await Policies.filterDatePolicy(field, page, body);
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
          data[i].validity_start_date,
          data[i].validity_end_date,
        ]);
      }

      result.data.data = json;
      this.Policies = result.data;

      console.log("this.Policies", result.data);
    } else {
      this.Policies = [];
    }
    this.load = false;
  }

  async savePolicy(body) {
    let content = Object.assign({}, body.polices);
    content.documents = body.documents;
    console.log("content", content);
    const result = await Policies.savePolicy(content);
    return result.data;
  }

  async updatePolicy(body) {
    console.log("body", body);
    let content = Object.assign({}, body.polices);
    content.documents = body.documents;

    console.log("content", content);
    const result = await Policies.updatePolicy(body.police_id, content);
    return result.data;
  }
}

export default PolicyController;
