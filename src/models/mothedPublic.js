import * as enums from "./enum.js";

export function OrderRequestTypeToTextPublic(orderRequestType) {
  return enums.OrderRequestTypeList.find((pred) => pred.id == orderRequestType)
    ?.name;
}

export function InputTypeToTextPublic(inputType) {
  return enums.InputTypeList.find((pred) => pred.id == inputType)?.name;
}
export function OrderItemStateToTextPublic(orderItemState) {
  return enums.OrderItemStateList.find((pred) => pred.id == orderItemState)
    ?.name;
}

export function OrderRequestStateToTextPublic(orderRequestState) {
  return enums.OrderRequestStateList.find(
    (pred) => pred.id == orderRequestState
  )?.name;
}

export function ChangeColorOrderRequestTypePublic(orderRequestType) {
  let color = "";
  switch (orderRequestType) {
    case enums.OrderRequestType.Individual:
      color = "indigo";
      break;
    case enums.OrderRequestType.Companies:
      color = "green";
      break;
    case enums.OrderRequestType.Certified:
      color = "orange";
      break;

    default:
      break;
  }
  return color;
}

export function ValidateAccountCountWithMinBranchCountPublic(item) {
  return item?.accountCount < item?.minOrderItemBranch;
}

export function ValidateOrderRequestStatePublic(item) {
  return item?.orderRequestState != enums.OrderRequestState.Process;
}

export function OrderRequestStateColorPublic(orderRequestState) {
  let color = "";
  switch (orderRequestState) {
    case enums.OrderRequestState.Process:
      color = "orange";
      break;
    case enums.OrderRequestState.Pinding:
      color = "#E91D62";
      break;
    case enums.OrderRequestState.GeneretedCode:
      color = "indigo";
      break;
    case enums.OrderRequestState.SendRequestBranch:
      color = "green";
      break;
    case enums.OrderRequestState.RejectRequest:
      color = "error";
      break;
    case enums.OrderRequestState.PrintOutCenter:
      color = "indigo";
      break;
    case enums.OrderRequestState.OrderRequestPrinting:
      color = "indigo";
      break;
    case enums.OrderRequestState.OrderRequestPrintedDone:
      color = "green";
      break;
    case enums.OrderRequestState.IsFrozen:
      color = "error";
      break;
    case enums.OrderRequestState.IsRejectedByCenter:
      color = "error";
      break;
    default:
      break;
  }

  return color;
}

export function UserTypeStateToTextPublic(userType) {
  return enums.UserTypeStateList.find((pred) => pred.id == userType)?.name;
}

export function HasPermassion(userPermasstions = [], isAccess = []) {
  return userPermasstions.some((item) => isAccess.includes(item));
}

export function AccountStatusToText(status) {
  let message = "";
  switch (status) {
    case enums.AccountState.IsActive:
      message = true;
      break;
    case enums.AccountState.IsSuspended:
      message = false;
      break;
  }

  return message;
}

export function LogActionTypeToText(logAction) {
  return enums.LogActionType.find((pred) => pred.id == logAction)?.name;
}
