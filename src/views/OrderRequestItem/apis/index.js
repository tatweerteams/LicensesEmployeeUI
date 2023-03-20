import requestAPI from "../../../util/baseUrlCustomer";

export function getOrderItems(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderItem/GetOrderItems",
    method: "Get",
    params: param,
  });
}
export function getAccountWithOutOrderItem(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderItem/GetAccountWithOutOrderItem",
    method: "Get",
    params: param,
  });
}

export function insertOrderItemRequest(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderItem/InsertOrderItemRequest",
    method: "Post",
    data,
  });
}

export function updateOrderItem(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderItem/UpdateOrderItem",
    method: "Put",
    data,
  });
}


export function changeItemState(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderItem/ChangeItemState",
    method: "Put",
    params: item,
  });
}

export function deleteOrderItem(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/OrderItem/DeleteOrderItem",
    method: "Delete",
    params: item,
  });
}
