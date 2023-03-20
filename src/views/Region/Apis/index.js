import requestAPI from "../../../util/baseUrlCustomer";

export function getRegions(filter) {
  return requestAPI({
    url: "/TatweerSendGeteway/Region/GetRegions",
    method: "Get",
    params:filter
  });
}

export function getRegionUnSelectedBank(filter) {
  return requestAPI({
    url: "/TatweerSendGeteway/Region/GetRegionUnSelectedBank",
    method: "Get",
    params:filter
  });
}
export function insertRegion(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/Region/InsertRegion",
    method: "Post",
    data,
  });
}
export function updateRegion(data) {
  return requestAPI({
    url: "/TatweerSendGeteway/Region/UpdateRegion",
    method: "Put",
    data,
  });
}

export function deleteRegion(region) {
  return requestAPI({
    url: "/TatweerSendGeteway/Region/DeleteRegion",
    method: "Delete",
    params:region
  });
}