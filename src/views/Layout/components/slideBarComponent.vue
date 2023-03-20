<template>
  <nav>
    <v-app-bar app color="#081D38" elevate-on-scroll elevation="0">
      <v-app-bar-nav-icon
        color="#de9dff"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <subTitleComponent
        :title="userName"
        :subTitle="roleName"
        :titleNumber="employeeNo"
      ></subTitleComponent>

      <v-btn icon @click.stop="showNotification">
        <v-badge :content="messages" :value="messages" color="#de9dff" overlap>
          <v-icon color="#de9dff"> mdi-bell </v-icon>
        </v-badge>
      </v-btn>
      <v-btn icon @click="exit">
        <v-icon style="opacity:1;" color="#de9dff"> mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      right
      app
      v-model="drawer"
      dark
      color="#081D38"
      class="elevation-0"
      floating
    >
      <div class="text-center mt-5">
        <h4 class="mt-3 text-color">نظام إرسال طلبات دفاتر الصكوك</h4>
        <v-divider class="my-5 mx-2" color="#de9dff"></v-divider>
      </div>

      <subTitleComponent
        :title="bankName"
        :subTitle="branchName"
        :titleNumber="branchNumber"
      ></subTitleComponent>

      <v-list dense shaped subheader nav class="my-5">
        <template v-for="(route, i) in userRoutes">
          <template v-if="!route.hidden">
            <template v-if="route.children && route.children.length > 1">
              <template>
                <v-list-group
                  class="group px-0 py-0"
                  style="padding: 0px"
                  active-class="active"
                  color="#FFFFFF"
                  :key="i"
                  no-action
                  append-icon=""
                >
                  <template v-slot:activator>
                    <v-list-item-action class="my-0 ml-2 mr-3">
                      <v-icon color="#de9dff">{{ route.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content class="my-1">
                      <v-list-item-title
                        class="my-1"
                        style="color: #ffedf2 !important"
                        v-text="route.name"
                      ></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action style="margin-right: 12px" class="my-1">
                      <v-btn icon>
                        <v-icon style="color: #de9dff !important"
                          >keyboard_arrow_down</v-icon
                        >
                      </v-btn>
                    </v-list-item-action>
                  </template>
                  <template v-for="(childRoute, i) in route.children">
                    <template v-if="!childRoute.hidden">
                      <v-list-item
                        active-class="active"
                        :to="childRoute.path"
                        :key="i"
                        v-slot="{ active }"
                        color="#d5cec3"
                        class="px-0"
                        :disabled="!childRoute.disabled"
                      >
                        <div
                          class="d-flex px-3"
                          :style="
                            active
                              ? 'border-right: 4px solid #FFFFFF;background-color:#081d38;width: 100%;border-bottom-left-radius: 25px;border-top-left-radius: 25px; '
                              : ''
                          "
                        >
                          <v-list-item-icon
                            class="mx-5 justify-center text-center "
                          >
                          <!-- v-if="childRoute.disabled" -->

                            <v-icon
                              v-text="childRoute.icon"
                              :color="active || childRoute.disabled? '#de9dff' : '#d5cec3'"
                            />
                            <!-- <v-icon v-else color="#a19ea5">
                              mdi-cancel
                            </v-icon> -->
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title
                              :class="
                                active || childRoute.disabled
                                  ? 'text-color-selected'
                                  : 'text-color-unSelected'
                              "
                              class="py-1"
                              >{{ childRoute.name }}</v-list-item-title
                            >
                          </v-list-item-content>
                        </div>
                      </v-list-item>
                    </template>
                  </template>
                </v-list-group>
              </template>
            </template>
            <template v-else>
              <v-list-item
                style="padding-left: 5px;"
                active-class="active"
                :to="route.path"
                :key="i"
                v-slot="{ active }"
                color="#FFFFFF"
                class="px-0"
                :disabled="!route.disabled"
              >
                <div
                  class="d-flex px-3 "
                  :style="
                    active
                      ? 'border-right: 4px solid #FFFFFF;background-color:#081d38;width: 100%;border-bottom-left-radius: 25px;border-top-left-radius: 25px; '
                      : ''
                  "
                >
                  <v-list-item-icon class="mr-2 mx-3">
                    <v-icon
                      v-text="route.icon"
                      :color="active ? '#ffedf2' : '#de9dff'"
                    />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      :class="
                        active || !route.disabled
                          ? 'text-color-selected'
                          : 'text-color-unSelected'
                      "
                      class="py-1"
                      >{{ route.name }}</v-list-item-title
                    >
                  </v-list-item-content>
                </div>
              </v-list-item>
            </template>
          </template>
        </template>
      </v-list>
    </v-navigation-drawer>

    <notification-component :drawerNotivicationProp="drawerNotivication" />
  </nav>
</template>

<script>
import notificationComponent from "../components/notificationComponent.vue";
import subTitleComponent from "./sub_title_component.vue";
import { EventBus } from "../../../eventBus";

import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  components: {
    "notification-component": notificationComponent,
    subTitleComponent,
  },
  data: () => ({
    drawer: null,
    drawerNotivication: null,
    userRoles: [],
    messages: 0,
  }),

  created() {
    EventBus.$on("closeDrawerNotivication", () => {
      this.drawerNotivication = false;
    });

    this.$store.subscribe((mutation, state) => {
      if (mutation.type.startsWith("notification")) {
        this.messages = state.notification.notificationCount;
      }
    });
  },
  computed: {
    ...mapFields("auth", {
      userRoutes: "routes",
      userInfo: "userInfo",
    }),

    phoneNumber() {
      return this.userInfo?.phoneNumber ?? "";
    },
    userEmail() {
      return this.userInfo?.email ?? "";
    },
    userName() {
      return this.userInfo?.name ?? "";
    },
    employeeNo() {
      return this.userInfo?.employeeNumber ?? "000";
    },
    roleName() {
      return this.userInfo?.roleName ?? "";
    },
    bankName() {
      return this.userInfo?.bankName ?? "جميع المصارف";
    },
    branchName() {
      return this.userInfo?.branchName ?? "جميع الفروع";
    },
    branchNumber() {
      return this.userInfo?.branchNumber ?? "000";
    },
  },
  methods: {
    goToProfile() {
      this.$router.push("/profile");
    },
    exit() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },

    hasPermassion(meta) {
      var metaAllow = meta.some((item) => item == "Allow");
      if (metaAllow) {
        return true;
      }
      var result = this.userRoles.some((item) => meta.includes(item));
      if (result) {
        return true;
      }
      return false;
    },

    showNotification() {
      this.drawerNotivication = !this.drawerNotivication;
    },
  },
};
</script>

<style scoped>
.image {
  border: 2px solid #32746c;
}
.text-color {
  color: #acaef5 !important;
}

.text-color-selected {
  color: #ffedf2 !important;
  font-size: 14px !important;
  opacity: 1 !important;
}

.text-color-unSelected {
  color: #d5cec3 !important;
  font-size: 12px !important;
}
.sub-title {
  color: #a19ea5 !important;
  font-size: 10px !important;
}
.position-absolute-exit {
  position: absolute;
  bottom: 20px;
}
</style>
