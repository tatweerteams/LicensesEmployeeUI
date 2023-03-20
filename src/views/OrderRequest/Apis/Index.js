import requestAPI from "../../../util/baseUrlCustomer";

export function getOrderRequests(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderRequest/GetOrderRequests",
    method: "Get",
    params: param,
  });
}

export function insertOrderRequest(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderRequest/InsertOrderRequest",
    method: "Post",
    data,
  });
}

export function updateOrderRequest(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderRequest/UpdateOrderRequest",
    method: "Put",
    data,
  });
}

export function deleteOrderRequest(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderRequest/DeleteOrderRequest",
    method: "Delete",
    params: item,
  });
}

export function sendOrderRequest(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderRequest/SendOrderRequest",
    method: "put",
    params: item,
  });
}


export function approvedOrderRequest (item) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderRequest/ApprovedOrderRequest",
    method: "put",
    params: item,
  });
}


export function rejectOrderRequest(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderRequest/RejectOrderRequest",
    method: "put",
    params: item,
  });
}
