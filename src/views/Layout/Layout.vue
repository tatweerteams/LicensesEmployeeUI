<template>
  <div>
    <v-app class="back">
      <slid-bar-component />
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import SlidBarComponent from "./components/slideBarComponent.vue";
export default {
  components: {
    "slid-bar-component": SlidBarComponent,
  },
  name: "LayoutsDemosBaselineFlipped",
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
  }),
  created() {
    this.$store.dispatch("auth/getUserInfoSesstion").then(() => {});
  },

  computed: {
    
  },
  methods: {},
};
</script>

<style scoped>
* {
  background-repeat: no-repeat;
  padding: 0;
}

.v-navigation-drawer .v-list {
  background: inherit;
  /* padding-top: 2px; */
}
.v-list .v-list-item--active .v-icon {
  color: white;
}
.v-list
  .v-list-item:not(.v-list-item--active):not(.v-list-item--disabled)
  .v-list-item__title[data-v-8b6adaf6][data-v-8b6adaf6] {
  color: #ecdede !important;
  font-size: 13px;
}
.v-list
  .v-list-item:not(.v-list-item--active):not(.v-list-item--disabled)
  .v-icon[data-v-8b6adaf6] {
  color: #ffffff !important;
}
.v-icon.v-icon {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-font-feature-settings: "liga";
  font-feature-settings: "liga";
  font-size: 20px;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  letter-spacing: normal;
  line-height: 1;
  position: relative;
  text-indent: 0;
  -webkit-transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
/* .v-application--is-rtl .v-list-group--no-action > .v-list-group__items > .v-list-item {
    padding-right: 40px;
} */
.v-application .title[data-v-8b6adaf6] {
  font-size: 0.85rem !important;
  font-weight: 200;
  line-height: 2rem;
  letter-spacing: 0.0125em !important;
  font-family: "Cairo", sans-serif !important;
  text-align: center;
}
/* .v-application--is-rtl .v-list-item__action:first-child, .v-application--is-rtl .v-list-item__icon:first-child {
    margin-left: 7px;
} */
/* .v-list-group__items {
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    margin-right: -10px !important;
} */
.v-application .title {
  font-size: 0.85rem !important;
  font-weight: 200;
  line-height: 4rem;
  letter-spacing: 0.0125em !important;
  font-family: "Cairo", sans-serif !important;
  text-align: center;
}
.v-list
  .v-list-item:not(.v-list-item--active):not(.v-list-item--disabled)
  .v-list-item__title[data-v-8b6adaf6] {
  color: #ecdede !important;
}

.v-list
  .v-list-item:not(.v-list-item--active):not(.v-list-item--disabled)
  .v-list-item__title {
  color: #7b7f83 !important;
}

.v-list .v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) i {
  color: #7b7f83 !important;
}

.v-list
  .v-list-item:not(.v-list-item--active):not(.v-list-item--disabled)
  .v-icon {
  color: #7b7f83 !important;
}

.v-list .v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: #7b7f83 !important;
}

.v-list .v-list-item--active {
  color: #439dab;
}

.theme--light.v-list-item .v-list-item__subtitle,
.theme--light.v-list-item .v-list-item__action-text {
  color: rgba(236, 236, 236, 0.6);
}
.active {
  background-color: #4361a5;
}

.v-list .v-divider {
  border-color: #7b7f83 !important;
  width: 80%;
}

.back {
  background: #f8f8f6 !important;
}
</style>
