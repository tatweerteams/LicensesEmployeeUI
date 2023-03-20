<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <template v-slot:activator="{ on }">
      <template>
        <v-btn
          color="#536DFE"
          class="white--text "
          @click="openDialog"
          v-on="on"
          elevation="5"
        >
          <v-icon class="ml-2">mdi-plus-circle</v-icon><span> إضافة دور</span>
        </v-btn>
      </template>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-form ref="formRole" v-model="valid">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editItem.name"
                  prepend-icon="mdi-file-document-alert"
                  dense
                  :rules="[
                    validationInput.isEmpty,
                    validationInput.isArabic,
                    validationInput.minLength,
                    validationInput.currectInput,
                  ]"
                  label="اسم الدور"
                  required
                  maxLength="50"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectUserType"
                  :items="userTypes"
                  item-text="name"
                  item-value="id"
                  clearable
                  prepend-icon="search"
                  label="التبعية"
                  dense
                  :rules="[validationInput.selectedValidation]"
                  required
                >
                </v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="selectedParmisstions"
                  :items="parmisstions"
                  label="الصلاحية"
                  placeholder="اختر الصلاحية"
                  hint="اختر صلاحية واحدة علي الأقل"
                  :rules="[validationInput.selectedListValidation]"
                  required
                  item-text="description"
                  item-value="id"
                  multiple
                  :search-input.sync="searchPermisstion"
                  @keyup="getPermisstions"
                  dense
                  chips
                  return-object
                  persistent-hint
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <div style="width: 100%;text-align: center;">
          <v-btn
            @click="save"
            class="mx-2 white--text"
            :disabled="!valid"
            color="#536DFE"
          >
            <v-icon>save</v-icon>
            <span>حفظ البيانات</span>
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
import { validationInput } from "../../../../models/validationInput.js";
import { UserTypeStateList } from "../../../../models/enum";

import { mapActions } from "vuex";
// import { createHelpers } from "vuex-map-fields";
// const { mapMultiRowFields  } = createHelpers({
//   getterType: "getDataFields",
//   mutationType: "updateDataField",
// });
export default {
  name: "insert-Or-Update",
  props: {
    updateItemProp: {},
  },
  components: {},

  data: () => ({
    dialog: false,
    valid: false,
    validationInput: validationInput,

    editItem: {
      id: null,
      name: null,
      userType: 0,
      RolePermisstions: [],
    },

    defaultItem: {
      id: null,
      name: null,
      userType: 0,
      RolePermisstions: [],
    },

    parmisstions: [],

    searchPermisstion: null,
    selectedParmisstions: [],
    filterDataPermisstion: {
      name: null,
    },

    userTypes: UserTypeStateList,
    selectUserType: null,
  }),

  computed: {
    formTitle() {
      return this.editItem.id ? "تعديل بيانات الدور" : "إضافة دور جديد";
    },
    // ...mapMultiRowFields("permisstionStore", {
    //   parmisstions: "activePermisstions",
    // }),
  },

  watch: {
    updateItemProp: {
      handler(data) {
        if (data) this.editSelected(data);
      },
      immediate: true,
    },
    searchPermisstion(data) {
      this.filterDataPermisstion.name = data;
    },
  },
  methods: {
    ...mapActions({
      InsertRoleStore: "roleStore/InsertRole",
      UpdateRoleStore: "roleStore/UpdateRole",
      GetPermisstions: "permisstionStore/GetActivePermisstions",
    }),

    getPermisstions() {
      this.GetPermisstions(this.filterDataPermisstion)
        .then(() => {
          this.parmisstions = [
            ...this.$store.getters["permisstionStore/GET_ACTIVE_PERMISSTIONS"],
          ];
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
        });
    },

    openDialog() {
      this.dialog = true;
      this.getPermisstions();
    },

    editSelected(item) {
      this.selectUserType = item.userType;
      this.editItem.name = item.name;
      this.editItem.id = item.id;
      this._selectedPermisstion(item.rolePermisstions);
      this.dialog = true;
    },

    _selectedPermisstion(rolePermisstions) {
      this.getPermisstions();
      this.selectedParmisstions = [];

      rolePermisstions.map((item) =>
        this.selectedParmisstions.push({
          id: item.id,
          description: item.description,
        })
      );

      // this.selectedParmisstions = this.parmisstions;

      // this.selectedParmisstions = [];

      // rolePermisstions.map((item) =>
      //   this.parmisstions.push({
      //     id: item.id,
      //     description: item.description,
      //   })
      // );

      // this.selectedParmisstions = this.parmisstions;
    },

    clearPermisstion() {
      this.searchPermisstion = null;
      this.filterDataPermisstion.name = null;
      this.selectedParmisstions = [];
      this.parmisstions = [];
    },

    close() {
      this.resetValidation();
      this.editItem = Object.assign({}, this.defaultItem);
      this.selectUserType = null;
      this.dialog = false;
      this.clearPermisstion();
      this.$emit("close-dialog-InsertOrUpdate");
    },

    save() {
      this.editItem.RolePermisstions = [];
      this.selectedParmisstions.map((item) =>
        this.editItem.RolePermisstions.push({
          permisstionId: item.id,
        })
      );
      this.editItem.userType = this.selectUserType;
      if (this.editItem.id) {
        this.UpdateRole();
      } else {
        this.InsertRole();
      }
    },

    UpdateRole() {
      this.$store.dispatch("loading", true);
      this.UpdateRoleStore(this.editItem)
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          this.$emit("refresh-data");
          this.close();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },
    InsertRole() {
      this.$store.dispatch("loading", true);
      this.InsertRoleStore(this.editItem)
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          this.$emit("refresh-data");

          this.close();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    resetValidation() {
      this.$refs.formRole?.reset();
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
