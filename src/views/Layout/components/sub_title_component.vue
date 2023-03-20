<template>
  <div>
    <v-list-item dense>
      <v-list-item-avatar
        class="text-center justify-center pa-3"
        color="#C51162"
        max-height="40"
      >
        <span class="white--text" style="font-size: 13px;">{{
          titleNumber
        }}</span>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title style="font-size: 13px;">
          <span style="color: #ffedf2">{{ title }}</span>
        </v-list-item-title>
        <v-list-item-subtitle style="font-size: 11px;color: #ffedf2;">
          {{ subTitle }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    subTitle: String,
    titleNumber: String,
  },
};
</script>

<style></style>
