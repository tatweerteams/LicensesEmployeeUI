import requestAPI from "../../../util/baseUrlCustomer";

export function getBankRegions(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/BankRegion/GetBankRegions",
    method: "Get",
    params: param,
  });
}
export function getActiveBankRegions(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/BankRegion/GetActiveBankRegions",
    method: "Get",
    params: param,
  });
}
export function insertBankRegion(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/BankRegion/InsertBankRegion",
    method: "Post",
    data,
  });
}
 

export function activationBankRegion(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/BankRegion/ActivationBankRegion",
    method: "Put",
    params: item,
  });
}

export function deleteBankRegion(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/BankRegion/DeleteBankRegion",
    method: "Delete",
    params: item,
  });
}
