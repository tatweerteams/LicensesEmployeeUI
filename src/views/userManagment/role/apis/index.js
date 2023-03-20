import requestAPI from "../../../../util/baseUrlCustomer";

export function getRoles(param) {
  return requestAPI({
    url: "/UserManagmentGeteway/Role/GetRoles",
    method: "Get",
    params: param,
  });
}
export function getActiveRoles(param) {
  return requestAPI({
    url: "/UserManagmentGeteway/Role/GetActiveRoles",
    method: "Get",
    params: param,
  });
}
export function insertRole(data) {
  return requestAPI({
    url: "/UserManagmentGeteway/Role/InsertRole",
    method: "Post",
    data,
  });
}
export function updateRole(data) {
  return requestAPI({
    url: "/UserManagmentGeteway/Role/UpdateRole",
    method: "Put",
    data,
  });
}

export function activationRole(item) {
  return requestAPI({
    url: "/UserManagmentGeteway/Role/ActivationRole",
    method: "Put",
    params: item,
  });
}
export function deleteRole(item) {
  return requestAPI({
    url: "/UserManagmentGeteway/Role/DeleteRole",
    method: "delete",
    params: item,
  });
}
 