import requestAPI from "../../../util/baseUrlCustomer";

export function getBanks(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/Bank/GetBanks",
    method: "Get",
    params: param,
  });
}
export function getActiveBanks(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/Bank/GetActiveBanks",
    method: "Get",
    params: param,
  });
}
export function insertBank(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/Bank/InsertBank",
    method: "Post",
    data,
  });
}
export function updateBank(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/Bank/UpdateBank",
    method: "Put",
    data,
  });
}

export function activationBank(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/Bank/ActivationBank",
    method: "Put",
    params: item,
  });
}

export function deleteBank(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/Bank/DeleteBank",
    method: "Delete",
    params: item,
  });
}
