import Vue from "vue";
import App from "./App.vue";
// import "./registerServiceWorker";
import router from "./router";
import "./router/routerfilter";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import Vuelidate from 'vuelidate';
import VueCharts from "vue-chartjs";
import VueApexCharts from 'vue-apexcharts';
import 'vue-cam';
import vidle from "./plugins/vidle.js";
import CircularCountDownTimer from "vue-circular-count-down-timer";
// import VueSecureHTML from 'vue-html-secure';


Vue.config.productionTip = false;
Vue.use(VueCharts);
Vue.use(VueApexCharts);
Vue.use(ElementUI,{ locale });
Vue.use(Vuelidate);
Vue.use(CircularCountDownTimer);
Vue.component('apexchart', VueApexCharts)
// App.config.globalProperties.$safeHTML = VueSecureHTML.safeHTML;
// App.config.globalProperties.$escapeHTML = VueSecureHTML.escapeHTML;
// App.config.globalProperties.$removeHTML = VueSecureHTML.removeHTML;

// App.use(VueSecureHTML);
new Vue({
  router,
  store,
  vuetify,
  vidle,
  render: h => h(App)
}).$mount("#app");
