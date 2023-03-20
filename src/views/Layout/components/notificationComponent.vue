<template>
  <v-navigation-drawer
    absolute
    temporary
    dark
    color="#E9EEF4"
    class="elevation-5"
    width="400"
    v-model="drawerNotivication"
  >
    <div v-if="lodding" class="text-center d-flex justify-center my-5">
      <v-progress-circular indeterminate color=" #11283d"></v-progress-circular>
      <p
        class="mx-3 font-weight-bold d-flex justify-space-between"
        style="color: #11283d"
      >
        جاري عرض الإشعارات .....
      </p>
    </div>
    <template v-else-if="!items || items.length == 0">
      <empty-component />
    </template>

    <template v-else>
      <data-list-notification-component :itemDataProp="items" />
    </template>

    <!-- <v-list v-else two-line nav class="pa-0">
      <div class="d-flex">
        <v-subheader class="text-color-not-read">
          <v-icon color="#11283d">mdi-bell</v-icon> <span>الإشعارات</span>
        </v-subheader>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="#11283d"
          small
          @click="readAll"
          class="sub-text-color-not-read mt-2 ml-3"
        >
          <span>قراءة الكل</span>
        </v-btn>
      </div>
      
    </v-list> -->
  </v-navigation-drawer>
</template>

<script>
import { EventBus } from "../../../eventBus";
import emptyComponent from "./empty_notification_component.vue";
import dataListNotificationComponent from "./data_list_notification_component.vue";
export default {
  props: {
    drawerNotivicationProp: {},
  },
  components: {
    "empty-component": emptyComponent,
    "data-list-notification-component": dataListNotificationComponent,
  },
  data: () => ({
    drawerNotivication: null,
    lodding: false,
    items: [
      // {
      //   title: "العنوان",
      //   subtitle: "تم رفض جميع المستندات الخاصة بك",
      //   isRead: false,
      // },
      // {
      //   title: "العنوان",
      //   subtitle: "تم رفض جميع المستندات الخاصة بك",
      //   isRead: true,
      // },
      // {
      //   title: "العنوان",
      //   subtitle: "تم رفض جميع المستندات الخاصة بك",
      //   isRead: true,
      // },
    ],
  }),

  watch: {
    drawerNotivicationProp: {
      handler(data) {
        if (data) {
          this.drawerNotivication = data;
          this.getNotification();
        }
      },
      immediate: true,
    },
    drawerNotivication(data) {
      if (!data) {
        EventBus.$emit("closeDrawerNotivication");
      }
    },
  },

  methods: {
    getNotification() {
      this.lodding = false;
    },

    readAll() {
      alert("read all");
    },
  },
};
</script>

<style scoped>
.text-color-not-read {
  color: #11283d !important;
  font-size: 16px !important;
}
.sub-text-color-not-read {
  color: #11283d !important;
  font-size: 12px !important;
  /*
  font-weight: 600 !important; */
}
</style>