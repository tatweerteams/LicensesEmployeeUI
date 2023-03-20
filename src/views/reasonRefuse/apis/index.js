import requestAPI from "../../../util/baseUrlCustomer";

export function getReasonRefuses(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/ReasonRefuses/GetReasonRefuses",
    method: "Get",
    params: param,
  });
}

export function getActiveReasonRefuses(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/ReasonRefuses/GetActiveReasonRefuses",
    method: "Get",
    params: param,
  });
}

export function insertReasonRefuse(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/ReasonRefuses/InsertReasonRefuse",
    method: "Post",
    data,
  });
}

export function updateReasonRefuse(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/ReasonRefuses/UpdateReasonRefuse",
    method: "Put",
    data,
  });
}

export function activationReasonRefuse(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/ReasonRefuses/ActivationReasonRefuse",
    method: "Put",
    params: item,
  });
}

export function deleteReasonRefuse(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/ReasonRefuses/DeleteReasonRefuse",
    method: "Delete",
    params: item,
  });
}
