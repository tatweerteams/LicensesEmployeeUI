<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <template v-slot:activator="{ on }">
      <template>
        <v-btn
          color="#E91D62"
          class="white--text mx-5"
          @click="openDialog"
          v-on="on"
          elevation="5"
        >
          <v-icon class="ml-2">mdi-plus-circle</v-icon
          ><span>تعديل توقيت الفروع</span>
        </v-btn>
      </template>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ titleDialog }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="formUpdateAllWorkTime" v-model="valid">
          <v-row>
            <v-col cols="12">
              <v-subheader class="font-weight-bold">
               قم بإختيار أيام أسبوع العمل  (إمكانية إختيار أكثر من يوم) </v-subheader
              >
              <v-chip-group mandatory column v-model="editedItem.days" multiple>
                <v-chip
                  filter-icon="check"
                  filter
                  v-for="day in DayweekEnumList"
                  :key="day.name"
                  color="#536dfe"
                  class="white--text"
                >
                  {{ day.name }}
                </v-chip>
              </v-chip-group>
            </v-col>
            <v-col cols="12" sm="6">
              <v-subheader class="font-weight-bold">بداية الدوام</v-subheader>
              <el-time-select
                clearable
                placeholder="بداية الدوام"
                v-model="editedItem.timeStart"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '23:30',
                }"
              >
              </el-time-select>
            </v-col>

            <v-col cols="12" sm="6">
              <v-subheader class="font-weight-bold">نهاية الدوام</v-subheader>
              <el-time-select
                placeholder="نهاية الدوام"
                :disabled="!editedItem.timeStart"
                v-model="editedItem.timeEnd"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '23:30',
                  minTime: editedItem.timeStart,
                }"
              >
              </el-time-select>
            </v-col>
            <v-subheader >في حالة لم يتم إختيار التوقيت سيتم تعديل حالة اليوم فقط</v-subheader>
            <v-col cols="12">
              <v-switch
                label="إلغاء تفعيل /  تفعيل أيام الإسبوع للفروع"
                color="#536DFE"
                hide-details
                dense
                class="justify-center text-center d-inline-block"
                v-model="editedItem.isActive"
              ></v-switch>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <div style="width: 100%;text-align: center;">
          <v-btn @click="save" class="mx-2 white--text" color="#536DFE">
            <v-icon>save</v-icon>
            <span>حفظ</span>
          </v-btn>
          <v-btn class="mx-2 white--text" @click="close" color="#E91D62">
            <v-icon dark>clear</v-icon>
            <span>إغلاق</span>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";

import * as enums from "../../../models/enum.js";
export default {
  name: "branch-setting",
  props: {},
  components: {},

  data: () => ({
    dialog: false,
    valid: false,
    editedItem: {
      days: [],
      timeStart: null,
      timeEnd: null,
      isActive: true,
    },

    defaultItem: {
      days: [],
      timeStart: null,
      timeEnd: null,
      isActive: true,
    },
    DayweekEnumList: enums.DayweekEnumList,
    selectedDays: [],
  }),

  computed: {
    titleDialog() {
      return "تعديل توقيت جميع الفروع";
    },
  },

  watch: {
    'editedItem.timeStart'(val){
        if(!val) this.editedItem.timeEnd=null;
    },  
  },
  methods: {
    ...mapActions({
      UpdateAllWorkTime: "branchWorkTimeStore/UpdateAllWorkTime",
    }),

    openDialog() {
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      setTimeout(() => {}, 300);
      this.editedItem = Object.assign({}, this.defaultItem);
      this.resetValidation();
    },

    save() {
      if(this.editedItem.timeStart && !this.editedItem.timeEnd)
      {
        this.notify("يجب إختيار توقيت النهاية", "#1d262d");
        return;
      }
      this.$store.dispatch("loading", true);
      this.UpdateAllWorkTime(this.editedItem)
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          this.close();

          this.$store.dispatch("loading", false);
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    resetValidation() {
      this.$refs.formUpdateAllWorkTime?.reset();
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
