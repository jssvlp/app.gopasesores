import { firebase } from "../configFirebase";

async function uploadImage(child, name, base64) {
  const storage = firebase.ref().child("images/" + child + "/" + name);
  const result = await storage
    .putString(base64, "data_url")
    .then((snapshot) => {
      return { data: snapshot, success: true };
    })
    .catch((error) => {
      return { data: error, success: false };
    });
  return result;
}

async function uploadFile(child, name, base64) {
  const storage = firebase.ref().child("file/" + child + "/" + name);
  const result = await storage
    .putString(base64, "data_url")
    .then((snapshot) => {
      return { data: snapshot, success: true };
    })
    .catch((error) => {
      return { data: error, success: false };
    });
  return result;
}

async function removeFile(child) {
  const storage = firebase.ref().child(child);
  const result = await storage
    .delete()
    .then((snapshot) => {
      return { data: snapshot, success: true };
    })
    .catch((error) => {
      return { data: error, success: false };
    });
  return result;
}

async function getProfileImage(rute) {
  let result = await firebase
    .ref()
    .child(rute)
    .getDownloadURL()
    .then((url) => {
      return { data: url, success: true };
    })
    .catch((error) => {
      return { data: error, success: false };
    });
  return await result;
}

export { uploadImage, getProfileImage, uploadFile, removeFile };
