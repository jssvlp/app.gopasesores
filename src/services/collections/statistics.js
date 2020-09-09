import api from "../api/create";

function getStatistics() {
  return api.get("/statistics/");
}

export { getStatistics };
