

import requestAPI from "../../../util/baseUrlCustomer";

export function getOrderRequestReject(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderRequest/GetOrderRequestReject",
    method: "Get",
    params: param,
  });
}
export function getRejectNoteByOrderId(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderRequest/GetRejectNoteByOrderId",
    method: "Get",
    params: param,
  });
}