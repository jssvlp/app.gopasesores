import api from "../api/create";

function getPolicies(page, client) {
  return api.get("/policies?page=" + page+"&client="+client);
}

function getPoliciesById(id) {
  return api.get("/policies/" + id);
}

function getPoliciesAll() {
  return api.get("/policies/list/all");
}

function savePolicy(body) {
  return api.post("/policies/", body);
}

function deletePolicy(id) {
  return api.delete("/policies/" + id);
}

function updatePolicy(id, body) {
  return api.put("/policies/" + id, body);
}

function filterDatePolicy(field, page, body) {
  console.log("field,body", field, body);
  return api.get("/policies/filterby/" + field + "?per_page=" + page, body);
}

export {
  getPolicies,
  savePolicy,
  getPoliciesById,
  deletePolicy,
  updatePolicy,
  filterDatePolicy,
  getPoliciesAll,
};
