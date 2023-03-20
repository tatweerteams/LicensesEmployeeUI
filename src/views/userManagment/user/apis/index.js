import requestAPI from "../../../../util/baseUrlCustomer";

export function getUsers(param) {
  return requestAPI({
    url: "/UserManagmentGeteway/User/GetUsers",
    method: "Get",
    params: param,
  });
}
export function insertUser(data) {
  return requestAPI({
    url: "/UserManagmentGeteway/User/InsertUser",
    method: "Post",
    data,
  });
}
export function updateUser(data) {
  return requestAPI({
    url: "/UserManagmentGeteway/User/UpdateUser",
    method: "Put",
    data,
  });
}
export function activationUser(item) {
  return requestAPI({
    url: "/UserManagmentGeteway/User/ActivationUser",
    method: "Put",
    params: item,
  });
}
export function resetPassword(item) {
  return requestAPI({
    url: "/UserManagmentGeteway/User/ResetPassword",
    method: "Put",
    params: item,
  });
}
