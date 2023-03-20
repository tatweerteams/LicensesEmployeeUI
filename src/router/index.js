import Vue from "vue";
import VueRouter from "vue-router";
import layout from "../views/Layout/Layout.vue";

Vue.use(VueRouter);

export const routes = [
  {
    path: "/login",
    name: "login",
    hidden: true,
    meta: ["Allow"],
    component: () => import("../views/login/page/index.vue"),
  },

  {
    path: "/",
    name: "الرئيسية",
    meta: ["Allow"],
    icon: "mdi-view-dashboard-outline",
    component: layout,
    disabled:true,
    redirect: "/Home/index",
    children: [
      {
        path: "/Home/index",
        name: " الصفحة ",
        meta: ["Allow"],
        disabled:true,
        icon: "mdi-view-dashboard-outline",
        component: () => import("../views/home/pages/index.vue"),
      },
    ],
  },
 
   

  {
    path: "/Setting",
    name: "إعدادات النظام",
    meta: ["Allow"],
    icon: "mdi-cog",
    component: layout,
    redirect: "/Setting/Region/index",
    children: [
      {
        path: "/Setting/Region/index",
        name: "إدارة المناطق",
        meta: ["AddNewRegion","AdminSystem"],
        icon: "mdi-city-variant",
        disabled:true,
        component: () => import("../views/Region/Page/index.vue"),

      },

      {
        path: "/Setting/Bank/index",
        name: "إدارة المصارف",
        meta: ["AdminSystem"],
        icon: "mdi-bank",
        disabled:true,
        component: () => import("../views/Bank/Pages/index.vue"),
      },

      {
        path: "/Setting/BankRegion/index",
        name: "إعدادات المناطق ",
        meta: ["RegionManagment","AdminSystem"],
        icon: "mdi-city-variant",
        disabled:true,
        component: () => import("../views/BankRegion/Page/index.vue"),
      },

      {
        path: "/Setting/Branch/index",
        name: "إدارة الفروع",
        meta: ["AdminSystem","SettingBranch","AddOrUpdateBranch","BranchWorkTime","AddBranchOtherRegions"],
        icon: "mdi-bank",
        disabled:true,
        component: () => import("../views/Branch/Pages/Index.vue"),
      },
      {
        path: "/Setting/reasonRefuse/index",
        name: "إدارة أسباب الرفض",
        meta: ["AdminSystem","ReasonRefuseManagment"],
        icon: "mdi-message-cog",
        disabled:true,
        component: () => import("../views/reasonRefuse/pages/index.vue"),
      },
    ],
  },

  {
    path: "/account",
    name: "حسابات العملاء",
    meta: ["Allow"],
    icon: "mdi-view-dashboard-outline",
    component: layout,
    disabled:true,
    redirect: "/account/index",
    children: [
      {
        path: "/account/index",
        name: "العملاء",
        meta: ["AdminSystem","AccountsManagement","AddOrUpdateAccounts","AddAccountsToOtherBranches","DislpayAccountsOfOtherBranches"],
        disabled:true,
        icon: "mdi-view-dashboard-outline",
        component: () => import("../views/Account/Pages/Index.vue"),
      },
    ],
  },

  {
    path: "/OrderRequest",
    name: "طلبات دفاتر",
    meta: ["Allow"],
    icon: "mdi-newspaper-variant",
    component: layout,
    redirect: "/OrderRequest/index",
    children: [
      {
        path: "/OrderRequest/index",
        name: "طلب جديد",
        meta: ["AdminSystem","AddOrderRequestOtherBranch","OrderRequestNew"],
        icon: "mdi-newspaper-plus",
        disabled:true,
        component: () => import("../views/OrderRequest/pages/Index.vue"),
      },
      {
        path: "/OrderRequestSend/index",
        name: "طلبات المرسلة من الفرع",
        meta: ["AdminSystem","ApprovidRequest","RejectRequest"],
        icon: "mdi-newspaper-check",
        disabled:true,
        component: () => import("../views/orderRequestPinding/pages/index.vue"),
      },
      {
        path: "/OrderRequestBranch/index",
        name: "طباعة طلب داخل الفرع",
        meta: ["AdminSystem","OrderRequestPrintBranch"],
        icon: "mdi-newspaper-variant-multiple",
        disabled:true,
        component: () => import("../views/OrderRequest/pages/Index.vue"),
      },
      {
        path: "/OrderRequestReject/index",
        name: "طلبات المرفوضة",
        meta: ["AdminSystem","OrderRequestNew","RejectRequest","AddOrderRequestOtherBranch"],
        icon: "mdi-newspaper-remove",
        disabled:true,
        component: () => import("../views/orderRequestReject/pages/index.vue"),
      },
    ],
  },

  {
    path: "/Reports",
    name: "استفسارات و تقارير",
    meta: ["Allow"],
    icon: "mdi-chart-bar",
    component: layout,
    redirect: "/Reports/index",
    children: [
      {
        path: "/Reports/index",
        name: "استفسار علي دفتر صكوك",
        meta: ["BranchAllReport","accountRequestReport","AdminSystem"],
        icon: "mdi-chart-box-outline",
        disabled:true,
        component: () => import("../views/reports/pages/accountRequestReport.vue"),
      },
      {
        path: "/employee/index",
        name: "تقرير الموظفين",
        meta: ["BranchAllReport","empolyeeReport","AdminSystem"],
        icon: "mdi-file-chart",
        disabled:true,
        component: () => import("../views/reports/pages/empolyeeReport.vue"),
      },
      {
        path: "/branchOrderReport/index",
        name: "تقرير طلبات الفرع",
        meta: ["BranchAllReport","branchOrderReport","AdminSystem"],
        icon: "mdi-finance",
        disabled:true,
        component: () => import("../views/reports/pages/branchOrderReport.vue"),
      },
      {
        path: "/statisticBranchReport/index",
        name: "إحصائية طلبات الفروع",
        meta: ["BranchAllReport","statisticBranchReport","AdminSystem"],
        icon: "mdi-finance",
        disabled:true,
        component: () => import("../views/reports/pages/statisticBranchReport.vue"),
      },
      {
        path: "/OrderRequestPrintOut/index",
        name: "طلبات المطبوعة خارج المركز",
        meta: ["BranchAllReport","orderRequestPriteOut","AdminSystem"],
        icon: "mdi-chart-pie",
        disabled:true,
        component: () => import("../views/reports/pages/orderRequestPriteOut.vue"),
      },
       
    ],
  },


  

  {
    path: "/UserManagment",
    name: "إدارة المستخدمين",
    meta: ["Allow"],
    icon: "mdi-account-cog-outline",
    component: layout,
    redirect: "/UserManagment/Permisttion/index",
    children: [
      {
        path: "/UserManagment/Permisttion/index",
        name: "إدارة الصلاحية",
        meta: ["AdminSystem"],
        icon: "mdi-security",
        disabled:true,
        component: () => import("../views/userManagment/permisstion/pages/index.vue"),
      },
      {
        path: "/UserManagment/Role/index",
        name: "إدارة الأدوار",
        meta: ["AdminSystem","RoleManagment"],
        icon: "mdi-shield-lock-outline",
        disabled:true,
        component: () => import("../views/userManagment/role/pages/index.vue"),
      },
      {
        path: "/UserManagment/User/index",
        name: "المستخدمين",
        meta: ["AdminSystem","UserManagment","AddUserOtherBranchs"],
        icon: "mdi-shield-account",
        disabled:true,
        component: () => import("../views/userManagment/user/pages/index.vue"),
      },
    ],
  },

  {
    path: "/OrderRequestItem/:id",
    name: "OrderRequestItem",
    meta: ["Auth"],
    hidden: true,
    icon: "mdi-account-circle",
    component: layout,
    redirect: "/OrderRequestItem/index/:id",
    children: [
      {
        path: "/OrderRequestItem/index/:id",
        name: "",
        meta: ["Auth"],
        icon: "mdi-account-circle",
        props: true,
        disabled:true,
        component: () => import("../views/OrderRequestItem/pages/index.vue"),
      },
    ],
  },
  {
    path: "/OrderItem/:id",
    name: "OrderRequestPindingItem",
    meta: ["Auth"],
    hidden: true,
    icon: "mdi-account-circle",
    component: layout,
    redirect: "/OrderItem/index/:id",
    children: [
      {
        path: "/OrderItem/index/:id",
        name: "",
        meta: ["Auth"],
        icon: "mdi-account-circle",
        props: true,
        disabled:true,
        component: () => import("../views/orderRequestPinding/components/orderRequestItemComonent.vue"),
      },
    ],
  },

  {
    path: "/401",
    name: "Auth",
    meta: ["Auth"],
    icon: "mdi-view-dashboard-outline",
    component: layout,
    hidden:true,
    redirect: "/401/Auth",
    children: [
      {
        path: "/401/Auth",
        name: " 401 ",
        meta: ["Auth"],
        icon: "mdi-view-dashboard-outline",
        component: () => import("../views/a_pageHandler/401/index.vue"),
      },
    ],
  },
  {
    path: "/WorkTime",
    name: "WorkTime",
    meta: ["Auth"],
    icon: "mdi-view-dashboard-outline",
    component: layout,
    hidden:true,
    redirect: "/WorkTime/index",
    children: [
      {
        path: "/WorkTime/index",
        name: " WorkTime ",
        meta: ["Auth"],
        icon: "mdi-view-dashboard-outline",
        component: () => import("../views/a_pageHandler/timeOut/index.vue"),
      },
    ],
  },

  {
    path: "/SystemMoniter",
    name: "مراقية النظام",
    meta: ["AdminSystem"],
    icon: "mdi-view-dashboard-outline",
    component: layout,
    disabled:true,
    redirect: "/SystemMoniter/index",
    children: [
      {
        path: "/SystemMoniter/index",
        name: "النظام",
        meta: ["AdminSystem"],
        disabled:true,
        icon: "mdi-view-dashboard-outline",
        component: () => import("../views/Logging/Page/index.vue"),
      },
    ],
  },

  { path: "*", redirect: "/main", hidden: true },
];

const router = new VueRouter({
  routes,
});

export default router;
