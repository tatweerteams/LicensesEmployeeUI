export const DayweekEnum = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export const OrderRequestType = {
  Individual: 1,
  Companies: 2,
  Certified: 3,
};

export const OrderRequestState = {
  Process: 1,
  RejectRequest: 2,
  OrderRequestPrinting: 3, // new status
  OrderRequestPrintedDone: 4,
  IsRejectedByCenter: 5,
  IsFrozen: 6,
  Pinding: 7,
  GeneretedCode: 8,
  SendRequestBranch: 9,
  SendCenter: 10,
  PrintOutCenter: 11,
};

export const OrderItemState = {
  Success: 1,
  IsSuspended: 2,
};

export const UserTypeState = {
  SuperAdmin: 1,
  AdminCenter: 2,
  AdminBranch: 3,
  Employee: 4,
};

export const InputTypeState = {
  Defualt: 1,
  ImportExcel: 2,
  API: 3,
  FlixCupe: 4,
  Cosher: 5,
};

export const AccountState = {
  IsActive: 1,
  IsSuspended: 2,
};

export const EventTypeState = {
  Insert: 1,
  Delete: 2,
  Update: 3,
  Activation: 4,
  Login: 5,
  OrderRequest: 6,
  Exception: 7,
  ApprovedOrderRequest: 8,
  RejectOrderRequest: 9,
  FreezeOrderItem: 10,
};

export const InputTypeList = [
  {
    id: InputTypeState.Defualt,
    name: "طلب من الواجهة النظام",
  },
  {
    id: InputTypeState.ImportExcel,
    name: "طلب عن طريق الإكسل",
  },
  {
    id: InputTypeState.API,
    name: "طلب عن طريق API",
  },
  {
    id: InputTypeState.FlixCupe,
    name: "طلب عن طريق فلكس كيوب",
  },
  {
    id: OrderItemState.Cosher,
    name: "طلب عن طريق صراف الألي",
  },
];

export const OrderItemStateList = [
  {
    id: OrderItemState.Success,
    name: "مقبول",
  },
  {
    id: OrderItemState.IsSuspended,
    name: "تم تجميد",
  },
];
export const OrderRequestTypeList = [
  {
    id: OrderRequestType.Individual,
    name: "أفــراد",
  },
  {
    id: OrderRequestType.Companies,
    name: "شـركات",
  },
  // {
  //   id: OrderRequestType.Certified,
  //   name: "صـكــوك",
  // },
];

export const OrderRequestStateList = [
  {
    id: OrderRequestState.Process,
    name: "قيد الإدخال",
  },
  {
    id: OrderRequestState.Pinding,
    name: "تم الطلب",
  },
  {
    id: OrderRequestState.SendRequestBranch,
    name: "تم إرسالها لمركز الطباعة",
  },
  {
    id: OrderRequestState.GeneretedCode,
    name: "اصدار رقم إشاري",
  },
  {
    id: OrderRequestState.RejectRequest,
    name: "مرفوض من قبل الفرع",
  },
  {
    id: OrderRequestState.IsRejectedByCenter,
    name: "مرفوض من قبل المركز",
  },
  {
    id: OrderRequestState.PrintOutCenter,
    name: "طباعة خارج المركز",
  },
  {
    id: OrderRequestState.OrderRequestPrinting,
    name: "تحت الطباعة",
  },

  {
    id: OrderRequestState.OrderRequestPrintedDone,
    name: "تم الطباعة",
  },
  {
    id: OrderRequestState.IsFrozen,
    name: "تجميد طلبية من المركز",
  },
];

export const OrderRequestStateRejectList = [
  {
    id: OrderRequestState.RejectRequest,
    name: "مرفوض من قبل الفرع",
  },
  {
    id: OrderRequestState.IsRejectedByCenter,
    name: "مرفوض من قبل المركز",
  },

  {
    id: OrderRequestState.IsFrozen,
    name: "تجميد طلبية من المركز",
  },
];

export const UserTypeStateList = [
  {
    id: UserTypeState.SuperAdmin,
    name: "مدير النظام",
  },
  {
    id: UserTypeState.AdminCenter,
    name: "مدير المركز",
  },
  {
    id: UserTypeState.AdminBranch,
    name: "مدير الفرع",
  },
  {
    id: UserTypeState.Employee,
    name: "موظف",
  },
];

export const DayweekEnumList = [
  {
    id: DayweekEnum.Sunday,
    name: "الأحد",
  },
  {
    id: DayweekEnum.Monday,
    name: "الإثنين",
  },
  {
    id: DayweekEnum.Thursday,
    name: "الثلاثاء",
  },
  {
    id: DayweekEnum.Wednesday,
    name: "الإربعاء",
  },
  {
    id: DayweekEnum.Tuesday,
    name: "الخميس",
  },
  {
    id: DayweekEnum.Friday,
    name: "الجمعة",
  },
  {
    id: DayweekEnum.Saturday,
    name: "السبت",
  },
];

export const LogActionType = [
  {
    id: EventTypeState.Insert,
    name: "اضافة",
  },
  {
    id: EventTypeState.Delete,
    name: "حذف",
  },
  {
    id: EventTypeState.Update,
    name: "تعديل",
  },
  {
    id: EventTypeState.Activation,
    name: "تفعيل",
  },
  {
    id: EventTypeState.Login,
    name: "تسجيل دخول",
  },
  {
    id: EventTypeState.OrderRequest,
    name: "انشاء طلبية",
  },
  {
    id: EventTypeState.Exception,
    name: "خطأ",
  },
  {
    id: EventTypeState.ApprovedOrderRequest,
    name: "تخويل طلبية",
  },
  {
    id: EventTypeState.RejectOrderRequest,
    name: "رفض طلبية",
  },
  {
    id: EventTypeState.FreezeOrderItem,
    name: "الغاء حساب من طلبية",
  },
];
