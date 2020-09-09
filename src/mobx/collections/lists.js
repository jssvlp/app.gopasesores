import { observable, computed } from "mobx";
import { Lists, Branches, Clients, Insurances } from "../../services/index";

class ListController {
  @observable load = true;
  @observable listLists = [];
  @observable Lists = [];
  @observable ListById = [];
  @observable allUsers = [];
  @observable isActive = false;
  @observable typeList = "people";

  @computed
  get modelLists() {
    return this.model;
  }

  @computed
  get getDataLists() {
    return this.Lists;
  }

  @computed
  get ListByIdInfo() {
    return this.ListById;
  }

  @computed
  get loading() {
    return this.load;
  }

  @computed
  get getTypeList() {
    return this.typeList;
  }

  @computed
  get getListLists() {
    return this.listLists;
  }

  statusLoading(status) {
    this.load = status;
  }

  changeList(type) {
    this.typeList = type;
  }

  async getLists(model) {
    const result = await Lists.getLists(model);
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

  async getListById(id) {
    const result = await Lists.getListsById(id);
    if (result.data.success && result.status === 200)
      this.ListById = result.data;
    if (!result.data.success || result.status !== 200) this.ListById = [];
    console.log("result", result);
  }

  async deleteListById(id) {
    const result = await Lists.deleteList(id);
    return result.data;
  }

  async getListsAllList() {
    const result = await Lists.getListsAll();
    if (result.data && result.status === 200) this.listLists = result.data;
  }

  async getAllLists(page) {
    this.initValues();
    const result = await Lists.getLists(page || 1);
    console.log("result", result);
    if (result.status === 200 && result.data) {
      let data = result.data;
      this.Lists = data;
      console.log("this.Lists", result.data);
    } else {
      this.Lists = [];
    }
    this.load = false;
  }

  async filterList(field, page, body) {
    const result = await Lists.filterDateList(field, page, body);
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
      this.Lists = result.data;

      console.log("this.Lists", result.data);
    } else {
      this.Lists = [];
    }
    this.load = false;
  }

  async saveList(body) {
    let content = Object.assign({}, body.polices);
    console.log("content", content);
    const result = await Lists.saveList(content);
    return result.data;
  }

  async updateList(body) {
    console.log("body", body);
    let content = Object.assign({}, body.Lists);

    console.log("content", content);
    const result = await Lists.updateList(body.List_id, content);
    return result.data;
  }
}

export default ListController;
