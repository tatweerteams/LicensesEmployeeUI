import requestAPI from "../../../util/baseUrlCustomer";

export function login(data) {
  return requestAPI({
    url: "/LoginUserGeteway/SecurityLogin/LoginUser",
    method: "post",
    data,
  });
}

export function chenagePassword(data) {
  return requestAPI({
    url: "/LoginUserGeteway/SecurityLogin/ChenagePassword",
    method: "post",
    data,
  });
}

export function getInfoUser(data) {
  return requestAPI({
    url: "/LoginUserGeteway/SecurityLogin/GetUserInfo",
    method: "Get",
    params: data,
  });
}

export function getXAntiForgery() {
  return requestAPI({
    url: "/LoginUserGeteway/SecurityLogin/GenerateAntiForgeryTokens",
    method: "Get",
  });
}

