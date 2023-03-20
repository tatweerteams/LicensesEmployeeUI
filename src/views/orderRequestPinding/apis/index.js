import requestAPI from "../../../util/baseUrlCustomer";

export function getOrderRequestPinding(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderRequest/GetOrderRequestPinding",
    method: "Get",
    params: param,
  });
}
 
