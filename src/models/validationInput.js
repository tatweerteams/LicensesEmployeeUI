export const validationInput = {
  isEmpty: (v) => (v && !!v?.trim()) || "الرجاء إدخال هذا الحقل",
  numberOnly: (v) => /^[0-9]*$/.test(v) || "الرجاء ادخال أرقام فقط",
  numberNotZero: (v) =>
    (!isNaN(parseInt(v)) && v >= 1) || "يجب إدخال بطريقة صحيحة",
  currectInput: (v) => (!!v && !v?.includes("ـ")) || "يجب ادخال بطريقة الصحيحة",
  isArabic: (v) =>
    /^[\u0621-\u064A ]*$/.test(v) || "الرجاء إدخال باللغة العربية",
  numberAndArabic: (v) =>
    /^[\u0621-\u064A0-9\s]*$/.test(v) || "الرجاء إدخال بطريقة الصحيحة",
  phoneLength: (v) => v?.length == 10 || "رقم الهاتف يجب ان يتكون من 10 أرقام",

  phoneLengthOrEmpty: (v) =>
    v?.length == 10 ||
    v?.trim().length == 0 ||
    "رقم الهاتف يجب ان يتكون من 10 أرقام",

  numbersOrEmpty: (v) =>
    /^[0-9]*$/.test(v) || v?.trim() == null || "الرجاء ادخال أرقام فقط",

  phoneNumber: (v) =>
    v?.startsWith("092", 0) ||
    v?.startsWith("091", 0) ||
    v?.startsWith("094", 0) ||
    v?.startsWith("095", 0) ||
    v?.startsWith("021", 0) ||
    v?.startsWith("023", 0) ||
    v?.startsWith("025", 0) ||
    v?.startsWith("024", 0) ||
    v?.startsWith("053", 0) ||
    v?.startsWith("051", 0) ||
    v?.startsWith("054", 0) ||
    v?.startsWith("057", 0) ||
    v?.startsWith("064", 0) ||
    v?.startsWith("061", 0) ||
    v?.startsWith("067", 0) ||
    v?.startsWith("069", 0) ||
    v?.startsWith("063", 0) ||
    v?.startsWith("062", 0) ||
    v?.startsWith("071", 0) ||
    "يجب إدخال رقم الهاتف بطريقة الصحيحة ",

  phoneNumberOrEmpty: (v) =>
    v?.startsWith("092", 0) ||
    v?.startsWith("091", 0) ||
    v?.startsWith("094", 0) ||
    v?.startsWith("095", 0) ||
    v?.startsWith("021", 0) ||
    v?.startsWith("023", 0) ||
    v?.startsWith("025", 0) ||
    v?.startsWith("024", 0) ||
    v?.startsWith("053", 0) ||
    v?.startsWith("051", 0) ||
    v?.startsWith("054", 0) ||
    v?.startsWith("057", 0) ||
    v?.startsWith("064", 0) ||
    v?.startsWith("061", 0) ||
    v?.startsWith("067", 0) ||
    v?.startsWith("069", 0) ||
    v?.startsWith("063", 0) ||
    v?.startsWith("062", 0) ||
    v?.startsWith("071", 0) ||
    v?.trim() == "" ||
    v?.trim().length == 0 ||
    ".يجب إدخال رقم الهاتف بطريقة الصحيحة ",

  phoneNumberNotZero: (v) =>
    (!isNaN(parseInt(v)) && parseInt(v?.substring(3, v?.length)) >= 1) ||
    "يجب إدخال رقم الهاتف بطريقة الصحيحة ",

  selectedValidation: (v) => !!v || "الرجاء إختيار هذا الحقل",
  selectedListValidation: (v) => !!v.length > 0 || "الرجاء إختيار هذا الحقل",
  minLength: (v) => (v && v.trim().length >= 3) || "الرجاء إدخال 3 خانات",

  // minLengthAccount: (v) =>
  //   (v && (v.trim().length == 14 || v.trim().length == 15)) ||
  //   "الرجاء إدخال 14 او 15 خانة",

  minLengthAccount: (v) =>
    (v && v.trim().length == 11) || "الرجاء إدخال 11 خانة",

  numberAndEng: (v) =>
    /^[a-zA-z0-9]*$/.test(v) || "يجب ان يتكون من أرقام وحروف لاتينية فقط",

  englishOnly: (v) =>
    /^[a-zA-Z\s]*$/.test(v) || "يجب ان يتكون من حروف لاتينية فقط",

  maxNumberCheckBook: (v) =>
    (!isNaN(parseInt(v)) && v <= 99) ||
    "يجب ان تكون الكمية الدفاتر أقل من 99 دفتر ",

  numEngAr: (v) =>
    /^[a-zA-z0-9-\u0621-\u064A\s]*$/.test(v) || "يجب ان لا يتحوي علي رموز ",

  emailRules: (v) =>
    //eslint-disable-next-line
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      v
    ) || "يجب إدخال بطريق الصحيحة",

  numberAndEnglish: (v) =>
  /^[a-zA-z0-9]*$/i.test(v) || "يجب ان يتكون من أرقام وحروف لاتينية فقط",
};
