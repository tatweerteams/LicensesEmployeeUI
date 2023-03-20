import requestAPI from "../../../util/baseUrlCustomer";

export function getAccountRequestReport(filter) {
  return requestAPI({
    url: "/TatweerSendGeteway/Reports/GetAccountRequestReport",
    method: "Get",
    params:filter
  });
}
export function getEmpolyeeReport(filter) {
  return requestAPI({
    url: "/TatweerSendGeteway/Reports/GetEmpolyeeReport",
    method: "Get",
    params:filter
  });
}
export function getBranchReport(filter) {
  return requestAPI({
    url: "/TatweerSendGeteway/Reports/GetBranchReport",
    method: "Get",
    params:filter
  });
}

export function getStatisticBranchReport(filter) {
  return requestAPI({
    url: "/TatweerSendGeteway/Reports/GetStatisticBranchReport",
    method: "Get",
    params:filter
  });
}
export function getOrderRequestPriteOutReport(filter) {
  return requestAPI({
    url: "/TatweerSendGeteway/Reports/GetOrderRequestPriteOutReport",
    method: "Get",
    params:filter
  });
}