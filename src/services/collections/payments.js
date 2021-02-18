import api from "../api/create";

function getPayments(model) {
  return api.get("/payments/" + model);
}

function getPaymentsById(id) {
  return api.get("/payments/" + id);
}

function getPaymentsAll() {
  return api.get("/payments/payments/all");
}


function getPaymentsBypolicy(id) {
    return api.get("/payments?policy="+id);
  }

  
function savePayment(body) {
  return api.post("/payments/", body);
}

function deletePayment(id) {
  return api.delete("/payments/" + id);
}

function updatePayment(id, body) {
  return api.put("/payments/" + id, body);
}

function filterDatePayment(field, page, body) {
  console.log("field,body", field, body);
  return api.get("/payments/filterby/" + field + "?per_page=" + page, body);
}

export {
  getPayments,
  savePayment,
  getPaymentsById,
  deletePayment,
  updatePayment,
  filterDatePayment,
  getPaymentsAll,
  getPaymentsBypolicy
};
