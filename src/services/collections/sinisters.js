import api from "../api/create";

function getSinisters(page) {
  return api.get("/sinisters?page=" + page);
}

function getSinistersById(id) {
  return api.get("/sinisters/" + id);
}

function getSinistersAll() {
  return api.get("/sinisters/list/all");
}

function saveSinister(body) {
  return api.post("/sinisters/", body);
}

function deleteSinister(id) {
  return api.delete("/sinisters/" + id);
}

function updateSinister(id, body) {
  return api.put("/sinisters/" + id, body);
}

function filterDateSinister(field, page, body) {
  console.log("field,body", field, body);
  return api.get("/sinisters/filterby/" + field + "?per_page=" + page, body);
}

export {
  getSinisters,
  saveSinister,
  getSinistersById,
  deleteSinister,
  updateSinister,
  filterDateSinister,
  getSinistersAll,
};
