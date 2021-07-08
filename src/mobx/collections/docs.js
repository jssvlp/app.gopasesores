import { observable } from "mobx";
import { Docs } from "../../services/index";

class ListController {
  @observable load = true;
  @observable listLists = [];
  @observable Lists = [];
  @observable ListById = [];
  @observable allUsers = [];
  @observable isActive = false;
  @observable typeList = "people";

  async deleteFilesById(id) {
    const result = await Docs.deleteFiles(id);
    return result.data;
  }
}

export default ListController;
