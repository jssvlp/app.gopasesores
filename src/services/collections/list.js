import api from "../api/create";

function getLists(model) {
  return api.get("/lists/" + model);
}

function getListsById(id) {
  return api.get("/lists/" + id);
}

function getListsAll() {
  return api.get("/lists/lists/all");
}

function saveList(body) {
  return api.post("/lists/", body);
}

function deleteList(id) {
  return api.delete("/lists/" + id);
}

function updateList(id, body) {
  return api.put("/lists/" + id, body);
}

function filterDateList(field, page, body) {
  console.log("field,body", field, body);
  return api.get("/lists/filterby/" + field + "?per_page=" + page, body);
}

export {
  getLists,
  saveList,
  getListsById,
  deleteList,
  updateList,
  filterDateList,
  getListsAll,
};
