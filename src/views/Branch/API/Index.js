import requestAPI from "../../../util/baseUrlCustomer";

export function getBranchs(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/Branch/GetBranchs",
    method: "Get",
    params: param,
  });
}

export function getActiveBranchs(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/Branch/GetActiveBranchs",
    method: "Get",
    params: param,
  });
}

export function getBranchSetting(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/Branch/GetBranchSetting",
    method: "Get",
    params: param,
  });
}
export function getBranchWorkTime(param) {
  return requestAPI({
    url: "/TatweerSendGeteway/Branch/GetBranchWorkTime",
    method: "Get",
    params: param,
  });
}

export function insertBranch(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/Branch/InsertBranch",
    method: "Post",
    data,
  });
}

export function insertBranchList(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/Branch/InsertBranchList",
    method: "Post",
    data,
  });
}

export function updateBranch(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/Branch/UpdateBranch",
    method: "Put",
    data,
  });
}

export function updateBranchSetting(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/Branch/UpdateBranchSetting",
    method: "Put",
    data,
  });
}

export function updateBranchWorkTime(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/Branch/UpdateBranchWorkTime",
    method: "Put",
    data,
  });
}

export function activationBranchWorkTime(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/Branch/ActivationBranchWorkTime",
    method: "Put",
    params: item,
  });
}

export function activationBranch(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/Branch/ActivationBranch",
    method: "Put",
    params: item,
  });
}

export function deleteBranch(item) {
  return requestAPI({
    url: "/TatweerSendGeteway/Branch/DeleteBranch",
    method: "Delete",
    params: item,
  });
}


export function updateAllWorkTime(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/Branch/UpdateAllWorkTime",
    method: "Put",
    data
  });
}