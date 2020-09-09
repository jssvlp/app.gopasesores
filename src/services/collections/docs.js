import api from "../api/create";

function deleteFiles(id) {
  return api.delete("/files/" + id);
}

export { deleteFiles };
