import requestApi from "../../../util/baseUrlCustomer";

export function getLogs(param) {
  return requestApi({
    url: "/TatweerSendLogginGeteway/Logging/GetLogginData",
    method: "Get",
    params: param,
  });
}

