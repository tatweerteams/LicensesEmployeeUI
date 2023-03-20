import requestAPI from "../../../../util/baseUrlCustomer";

export function getPermisstions(param) {
  return requestAPI({
    url: "/UserManagmentGeteway/Permisstion/GetPermisstions",
    method: "Get",
    params: param,
  });
}
export function getActivePermisstions(param) {
  return requestAPI({
    url: "/UserManagmentGeteway/Permisstion/GetActivePermisstion",
    method: "Get",
    params: param,
  });
}
export function insertPermisstion(data) {
  return requestAPI({
    url: "/UserManagmentGeteway/Permisstion/InsertPermisstion",
    method: "Post",
    data,
  });
}
export function updatePermisstion(data) {
  return requestAPI({
    url: "/UserManagmentGeteway/Permisstion/UpdatePermisstion",
    method: "Put",
    data,
  });
}

export function activationPermisstion(item) {
  return requestAPI({
    url: "/UserManagmentGeteway/Permisstion/ActivationPermisstion",
    method: "Put",
    params: item,
  });
}
 