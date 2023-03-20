import "@fortawesome/fontawesome-free/css/all.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

import ar from "vuetify/es5/locale/ar";

export default new Vuetify({
  lang: {
    locales: { ar },
    current: "ar",
  },
  rtl: true,
  icons: {
    iconfont: "fa" || "md",
  },
  theme: {
    themes: {
      light: {
        primary: "#2B9EB3",
      },
      dark: {
        background: "#F5F6FA",
      },
    },
  },
});
