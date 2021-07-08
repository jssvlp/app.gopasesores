import { observable, computed } from "mobx";
import { Statistics } from "../../services/index";

class ListController {
  @observable load = true;
  @observable listLists = [];
  @observable statistics = [];
  @observable ListById = [];
  @observable allUsers = [];
  @observable isActive = false;
  @observable typeList = "people";

  @computed
  get getDataStatistics() {
    return this.statistics;
  }

  async getStatistics() {
    const result = await Statistics.getStatistics();
    if (result.data && result.status === 200)
      return (this.statistics = result.data);
    return (this.statistics = []);
  }
}

export default ListController;
