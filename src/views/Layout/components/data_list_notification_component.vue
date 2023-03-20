<template>
  <div>
    <v-list two-line nav class="pa-0">
      <div class="d-flex elevation-5">
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
      <template v-for="(item, index) in items">
        <div
          :key="index"
          :style="item.isRead ? '' : 'background-color: #AFD8D9 !important'"
        >
          <v-divider style=" border:1px solid #aeccc8 !important" class="mx-5 my-1" v-if="index != 0">
          </v-divider>
          <v-list-item class="ma-0" style="max-height: 10px !important">
            <v-list-item-avatar
              color="#11283d"
              class="elevation-10 text-center justify-center"
            >
              <v-badge left :color="item.isRead ? '' : 'green'" overlap dot>
                <v-icon size="20">mdi-bell </v-icon>
              </v-badge>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                class="text-color-not-read"
                v-html="item.title"
              ></v-list-item-title>
              <v-list-item-subtitle
                class="sub-text-color-not-read"
                v-html="item.subtitle"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <div class="sub-text-color-not-read mx-16 my-0">
            <span>تاريخ : </span>
            <span>10/10/2020</span>
            <span>التوقيت : </span>
            <span>10:20:20 PM</span>
          </div>
        </div>
      </template>
    </v-list>
  </div>
</template>

<script>
export default {
  props: {
    itemDataProp: null,
  },
  data: () => ({
    items: [],
  }),
  watch: {
    itemDataProp: {
      handler(data) {
        if (data) {
          this.items = [...data];
        }
      },
      immediate: true,
    },
  },
  methods: {
    readAll() {
      // alert("read all");
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