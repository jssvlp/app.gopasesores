import api from "../api/create";

function getInsurances(page) {
  return api.get("/insurances?page=" + page);
}

function getInsurancesById(id) {
  return api.get("/insurances/" + id);
}
function getBranchesByInsurances(id) {
  return api.get("/insurances/" + id + "/branches");
}



function getInsurancesAll() {
  return api.get("/insurances/list/all");
}

function saveInsurance(body) {
  return api.post("/insurances/", body);
}

function deleteInsurance(id) {
  return api.delete("/insurances/" + id);
}

function updateInsurance(id, body) {
  return api.put("/insurances/" + id, body);
}

function filterDateInsurance(field, page, body) {
  console.log("field,body", field, body);
  return api.get("/insurances/filterby/" + field + "?per_page=" + page, body);
}

export {
  getInsurances,
  saveInsurance,
  getInsurancesById,
  deleteInsurance,
  updateInsurance,
  filterDateInsurance,
  getInsurancesAll,
  getBranchesByInsurances,

};
