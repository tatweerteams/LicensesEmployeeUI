import requestAPI from "../../../util/baseUrlCustomer";

export function getAccounts(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/Account/GetAccounts",
    method: "Get",
    params: param,
  });
}

export function insertAccount(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/Account/InsertAccount",
    method: "Post",
    data,
  });
}

export function insertAccounts(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/Account/InsertListOfAccounts",
    method: "Post",
    data,
  });
}

export function updateAccount(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/Account/UpdateAccount",
    method: "Post",
    data,
  });
}

export function deleteAccount(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/Account/DeleteAccount",
    method: "Delete",
    params: item,
  });
}

export function activateAccount(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/Account/ActivateAccount",
    method: "Put",
    params: item,
  });
}

export function activatePrintExternally(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/Account/ActivatePrintExternally",
    method: "Put",
    params: item,
  });
}
